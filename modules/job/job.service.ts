/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { CreatedJobType, UpdateJobType } from "./job.validation";
import { JobModel } from "./job.model";
import { connectToDB } from "@/lib/mongodb";
import AppError from "@/lib/AppError";

export function isJobExpiredByDeadline(deadline?: Date | string) {
  if (!deadline) return false;
  return new Date(deadline).getTime() <= Date.now();
}

export async function syncExpiredJobStatuses() {
  await connectToDB();

  const now = new Date();
  const result = await JobModel.updateMany(
    { status: "approved", deadline: { $lte: now } },
    { $set: { status: "expired" } },
  );

  return result;
}

export async function syncExpiredJobStatusById(jobId: string) {
  await connectToDB();

  const job = await JobModel.findById(jobId);
  if (!job) return null;

  if (job.status === "approved" && isJobExpiredByDeadline(job.deadline)) {
    job.status = "expired";
    await job.save();
  }

  return job;
}

// create jobs
async function createJobIntoDB(payload: CreatedJobType) {
  await connectToDB();
  const result = await JobModel.create(payload);
  return result;
}

//get all jobs - with all statuses only for --- admin --- for approved
export async function getAllJobsFromDB() {
  await connectToDB();
  await syncExpiredJobStatuses();
  const res = await JobModel.find()
    .sort({ updatedAt: -1, createdAt: -1 })
    .lean();
  return res;
}

// get all jobs for public only --- approved jobs
export async function getAllApprovedJobs() {
  await connectToDB();
  await syncExpiredJobStatuses();

  const query: Record<string, any> = { status: "approved" };
  const res = await JobModel.find(query)
    .sort({ updatedAt: -1, createdAt: -1 })
    .lean();
  return res;
}

// get single Job
export async function getJobById(id: string) {
  await connectToDB();

  const res = await JobModel.findById(id)
    .populate("recruiterId", "name company")
    .lean();

  if (!res) {
    throw new AppError(httpStatus.BAD_REQUEST, "Job not found");
  }
  return res;
}

// get recruiter's own jobs
export async function getRecruiterJobs(recruiterId: string) {
  await connectToDB();
  await syncExpiredJobStatuses();

  const res = await JobModel.find({ recruiterId })
    .sort({ updatedAt: -1, createdAt: -1 })
    .lean();
  return res;
}

export async function getExpiredJobs(recruiterId: string, role?: string) {
  await connectToDB();
  await syncExpiredJobStatuses();

  const query =
    role === "admin"
      ? { status: "expired" }
      : { recruiterId, status: "expired" };
  const res = await JobModel.find(query)
    .sort({ updatedAt: -1, createdAt: -1 })
    .lean();

  return res;
}

// Update Job - recruiter & admin edit their own jobs
export async function updateJobs(
  id: string,
  data: UpdateJobType,
  requesterId: string,
  requesterRole: string,
) {
  await connectToDB();

  const res = await JobModel.findById(id);
  if (!res) throw new AppError(httpStatus.BAD_REQUEST, "Job not found");

  if (requesterRole !== "admin" && res.recruiterId.toString() !== requesterId) {
    throw new AppError(httpStatus.FORBIDDEN, "You do not own this Job");
  }

  const changedFields = Object.keys(data).filter(
    (field) =>
      field !== "status" &&
      JSON.stringify(res.get(field)) !==
        JSON.stringify(data[field as keyof UpdateJobType]),
  );
  const updateData = {
    ...data,
    ...(requesterRole === "recruiter" || res.status === "expired"
      ? { status: "pending" as const }
      : {}),
  };

  if (updateData.status && updateData.status !== res.status) {
    changedFields.push("status");
  }

  const updatedData = await JobModel.findByIdAndUpdate(
    id,
    {
      $set: updateData,
      ...(changedFields.length > 0
        ? {
            $push: {
              updateHistory: {
                updatedBy: requesterId,
                role: requesterRole,
                changedAt: new Date(),
                previousStatus: res.status,
                changedFields,
              },
            },
          }
        : {}),
    },
    {
      // new: true,
      returnDocument: "after",
      runValidators: true,
    },
  ).lean();
  return updatedData;
}

// Job Status Changed By Admin --- update status
export async function updateJobStatus(
  id: string,
  status: "approved" | "rejected",
) {
  await connectToDB();

  const res = await JobModel.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  ).lean();

  if (!res) {
    throw new AppError(httpStatus.NOT_FOUND, "Job not found");
  }
  return res;
}

// Delete A Job
export async function deleteJob(
  id: string,
  requesterId: string,
  requesterRole: string,
) {
  await connectToDB();

  const result = await JobModel.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Job not found");
  }
  if (
    requesterRole !== "admin" &&
    result.recruiterId.toString() !== requesterId
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "You do not own this job");
  }
  await result.deleteOne();
  return { deleted: true };
}

export const jobServices = {
  createJobIntoDB,
  getAllJobsFromDB,
  getAllApprovedJobs,
  getJobById,
  getRecruiterJobs,
  getExpiredJobs,
  updateJobs,
  updateJobStatus,
  deleteJob,
};
