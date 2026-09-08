import httpStatus from "http-status";
import { connectToDB } from "@/lib/mongodb";
import { JobModel } from "../job/job.model";
import AppError from "@/lib/AppError";
import { ApplicationModel } from "./application.model";
import { ApplicationStatus, STATUS_TRANSITION } from "./application.interface";
import {
  syncExpiredJobStatusById,
  syncExpiredJobStatuses,
} from "@/modules/job/job.service";

let applicationIndexesReady: Promise<void> | undefined;

const ensureApplicationIndexes = async () => {
  if (!applicationIndexesReady) {
    applicationIndexesReady = (async () => {
      try {
        await ApplicationModel.collection.dropIndex("jobId_1_candidateId_1");
      } catch {
        // The legacy unique index is absent on fresh databases.
      }
      await ApplicationModel.collection.createIndex(
        { jobId: 1, candidateId: 1, appliedAt: 1 },
        { name: "jobId_1_candidateId_1_appliedAt_1" },
      );
    })();
  }
  await applicationIndexesReady;
};

const getReopenTime = (job: {
  updatedAt?: Date;
  updateHistory?: { previousStatus: string; changedAt: Date }[];
}) => {
  const historyTime = job.updateHistory
    ?.filter((history) => history.previousStatus === "expired")
    .sort(
      (first, second) =>
        new Date(second.changedAt).getTime() -
        new Date(first.changedAt).getTime(),
    )[0]?.changedAt;

  if (!historyTime) return job.updatedAt;
  if (!job.updatedAt) return historyTime;

  return new Date(historyTime).getTime() > new Date(job.updatedAt).getTime()
    ? historyTime
    : job.updatedAt;
};

const isApplicationExpired = (
  appliedAt: Date,
  job: {
    status?: string;
    deadline?: Date;
    updatedAt?: Date;
    updateHistory?: { previousStatus: string; changedAt: Date }[];
  } | null,
) => {
  if (!job) return false;
  const deadlineExpired =
    job.status === "expired" ||
    (!!job.deadline && new Date(job.deadline).getTime() <= Date.now());
  const appliedBeforeReopen =
    !!getReopenTime(job) &&
    new Date(appliedAt).getTime() < new Date(getReopenTime(job)!).getTime();
  return deadlineExpired || appliedBeforeReopen;
};

// apply a job
const applyToJob = async (
  candidateId: string,
  jobId: string,
  coverLetter?: string,
  resumeUrl?: string,
) => {
  await connectToDB();
  await ensureApplicationIndexes();

  const job = await JobModel.findById(jobId);
  if (!job) {
    throw new AppError(httpStatus.NOT_FOUND, "Job not found");
  }

  if (job.status !== "approved") {
    throw new AppError(httpStatus.BAD_REQUEST, "This job is not available");
  }

  const jobAfterSync = await syncExpiredJobStatusById(jobId);
  if (jobAfterSync && jobAfterSync.status === "expired") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Application deadline has passed",
    );
  }

  const reopenTime = getReopenTime(job);
  const existingApplication = await ApplicationModel.findOne({
    candidateId,
    jobId,
    ...(reopenTime ? { appliedAt: { $gte: reopenTime } } : {}),
  });
  if (existingApplication) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already applied for this job",
    );
  }

  // create application - recruiterId denormalized from job
  const application = await ApplicationModel.create({
    candidateId,
    jobId,
    recruiterId: job.recruiterId,
    coverLetter,
    resumeUrl,
    status: "pending",
    appliedAt: new Date(),
  });

  return application;
};

// admin get all applications
const getAllApplications = async () => {
  await connectToDB();
  await syncExpiredJobStatuses();
  const applications = await ApplicationModel.find()
    .populate("candidateId", "name email ")
    .populate("jobId")
    .populate("recruiterId", "name email")
    .sort({ appliedAt: -1 })
    .lean();

  return applications.map((application) => ({
    ...application,
    isExpired: isApplicationExpired(
      application.appliedAt,
      application.jobId as (typeof applications)[number]["jobId"] & {
        updatedAt?: Date;
        updateHistory?: { previousStatus: string; changedAt: Date }[];
      },
    ),
  }));
};

// candidate get own application
const getOwnApplications = async (candidateId: string) => {
  await connectToDB();
  await syncExpiredJobStatuses();
  const applications = await ApplicationModel.find({ candidateId })
    .populate("jobId")
    .sort({ appliedAt: -1 })
    .lean();

  return applications.map((application) => ({
    ...application,
    isExpired: isApplicationExpired(
      application.appliedAt,
      application.jobId as typeof application.jobId & {
        updatedAt?: Date;
        updateHistory?: { previousStatus: string; changedAt: Date }[];
      },
    ),
  }));
};

// get single application details
const getApplicationById = async (
  applicationId: string,
  requestRole: string,
  requestId?: string,
) => {
  await connectToDB();
  const application = await ApplicationModel.findById(applicationId)
    .populate("candidateId", "name email avatar skills")
    .populate("jobId", "title company location salary skills recruiterId")
    .populate("recruiterId", "name email")
    .lean();

  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, "Application not found");
  }

  // authorization check
  if (
    requestRole !== "admin" &&
    application.candidateId.toString() !== requestId &&
    application.recruiterId.toString() !== requestId
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to view this application",
    );
  }

  return application;
};

// status update --- recruiter/admin
const updateApplicationStatus = async (
  applicationId: string,
  newStatus: ApplicationStatus,
  requestRole: string,
  requestId?: string,
) => {
  await connectToDB();
  const application = await ApplicationModel.findById(applicationId);
  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, "Application not found");
  }

  // ownership check
  if (
    requestRole !== "admin" &&
    application.recruiterId.toString() !== requestId
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this application",
    );
  }

  const job = await syncExpiredJobStatusById(application.jobId.toString());
  if (
    requestRole === "recruiter" &&
    job &&
    isApplicationExpired(application.appliedAt, job)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Expired applications cannot be updated",
    );
  }

  // status transition validation
  const allowedTransitions =
    STATUS_TRANSITION[application.status as ApplicationStatus];
  if (!allowedTransitions.includes(newStatus as ApplicationStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid status transition from ${application.status} to ${newStatus}`,
    );
  }

  application.status = newStatus as ApplicationStatus;

  const updatedApplication = await ApplicationModel.findByIdAndUpdate(
    applicationId,
    { status: newStatus },
    {
      returnDocument: "after",
      // new: true
    },
  )
    .populate("candidateId", "name email")
    .populate("jobId", "title company")
    .populate("recruiterId", "name email")
    .lean();

  return updatedApplication;
};

// Recruiter & Admin :get applicants for their posted jobs
const getJobApplicantsById = async (
  jobIds: string[],
  recruiterId: string,
  requestRole: string,
) => {
  await connectToDB();

  // check if job belongs to recruiter
  const jobs = await JobModel.find({ _id: { $in: jobIds } });
  if (jobs.length !== jobIds.length) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Job not found or you are not the owner",
    );
  }
  // console.log("Received jobId:", jobId, recruiterId, requestRole);

  //   ownership check
  if (
    requestRole !== "admin" &&
    jobs.some((job) => job.recruiterId?.toString() !== recruiterId)
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to view applicants for this job",
    );
  }

  // get applications for the job
  const applications = await ApplicationModel.find({
    jobId: { $in: jobIds },
  })
    .populate("recruiterId", "name email")
    .populate("candidateId", "name email ")
    .populate("jobId")
    .sort({ appliedAt: -1 })
    .lean();

  return applications.map((application) => ({
    ...application,
    isExpired:
      requestRole === "recruiter" &&
      isApplicationExpired(
        application.appliedAt,
        application.jobId as (typeof jobs)[number],
      ),
  }));
};

// candidate withdraw application
const withdrawApplication = async (
  applicationId: string,
  candidateId: string,
) => {
  await connectToDB();
  const application = await ApplicationModel.findById(applicationId);
  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, "Application not found");
  }

  // ownership check
  if (application.candidateId.toString() !== candidateId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to withdraw this application",
    );
  }

  const job = await syncExpiredJobStatusById(application.jobId.toString());
  if (job && isApplicationExpired(application.appliedAt, job)) {
    await ApplicationModel.findByIdAndDelete(applicationId);
    return { withdrawn: true };
  }

  await ApplicationModel.findByIdAndDelete(applicationId);
  return { withdrawn: true };
};

export const applicationServices = {
  applyToJob,
  getOwnApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getJobApplicantsById,
  withdrawApplication,
};
