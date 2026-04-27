import httpStatus from "http-status";
import { connectToDB } from "@/lib/mongodb";
import { JobModel } from "../job/job.model";
import AppError from "@/lib/AppError";
import { ApplicationModel } from "./application.model";
import { ApplicationStatus, STATUS_TRANSITION } from "./application.interface";

// apply a job
const applyToJob = async (
  candidateId: string,
  jobId: string,
  coverLetter?: string,
  resumeUrl?: string,
) => {
  await connectToDB();

  //   approved jobs
  const job = await JobModel.findOne({ _id: jobId, status: "approved" });
  if (!job) {
    throw new AppError(httpStatus.NOT_FOUND, "Job not found or not approved");
  }

  // deadline check
  if (job.deadline && job.deadline < new Date()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Application deadline has passed",
    );
  }

  // duplicate check
  const existingApplication = await ApplicationModel.findOne({
    candidateId,
    jobId,
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

// candidate get own application
const getOwnApplications = async (candidateId: string) => {
  await connectToDB();
  return ApplicationModel.find({ candidateId });
};

// Recruiter:get applicants for their job
const getApplicantsForJob = async (
  recruiterId: string,
  jobId: string,
  requestRole: string,
) => {
  await connectToDB();

  // check if job belongs to recruiter
  const job = await JobModel.findById(jobId);
  if (!job) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Job not found or you are not the owner",
    );
  }

  //   ownership check
  if (requestRole !== "admin" && job.recruiterId.toString() !== recruiterId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to view applicants for this job",
    );
  }

  // get applications for the job
  return ApplicationModel.find({ jobId })
    .populate("candidateId", "name email avatar skills")
    .sort({ appliedAt: -1 })
    .lean();
};

// admin get all applications
const getAllApplications = async () => {
  await connectToDB();
  return ApplicationModel.find()
    .populate("candidateId", "name email ")
    .populate("jobId", "title company")
    .populate("recruiterId", "name email")
    .sort({ appliedAt: -1 })
    .lean();
};

// get single application details
const getSingleApplicants = async (
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
    { new: true },
  )
    .populate("candidateId", "name email")
    .populate("jobId", "title company")
    .populate("recruiterId", "name email")
    .lean();

  return updatedApplication;
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

  // only pending applications can be withdrawn
  if (application.status !== "pending") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only pending applications can be withdrawn",
    );
  }

  await ApplicationModel.findByIdAndDelete(applicationId);
  return { withdrawn: true };
};

export const applicationServices = {
  applyToJob,
  getOwnApplications,
  getApplicantsForJob,
  getAllApplications,
  getSingleApplicants,
  updateApplicationStatus,
  withdrawApplication,
};
