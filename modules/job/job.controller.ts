import httpStatus from "http-status";
import { withAuth } from "@/lib/withAuth";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import AppError from "@/lib/AppError";
import { NextRequest } from "next/server";
import { uploadCloudinary } from "@/lib/cloudinary";
import { jobServices } from "./job.service";
import { Types } from "mongoose";
import {
  createJobValidationSchema,
  UpdateJobType,
  updateJobValidationSchema,
} from "./job.validation";

export const createJob = catchAsync(async (req: NextRequest) => {
  const user = await withAuth(["recruiter", "admin"]);

  const formData = await req.formData();
  const logoFile = formData.get("companyLogo");

  const jobForm = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    company: formData.get("company") as string,
    category: formData.getAll("category") as string[],
    location: formData.get("location") as string,
    type: formData.get("type") as string,
    salary: formData.get("salary") as string,
    skills: formData.getAll("skills") as string[],
    deadline: formData.get("deadline") || undefined,
  };
  console.log("RAW:", jobForm);
  const parsedData = createJobValidationSchema.safeParse(jobForm);

  if (!parsedData.success) {
    throw new AppError(httpStatus.BAD_REQUEST, "Data is not matched");
  }

  //   company logo
  let companyLogoUrl: string | undefined;
  if (logoFile instanceof File && logoFile.size > 0) {
    if (!logoFile.type.startsWith("image/")) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid image type");
    }
    companyLogoUrl = await uploadCloudinary(logoFile);
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Company logo is required");
  }

  const payload = {
    ...parsedData.data,
    companyLogo: companyLogoUrl,
    recruiterId: new Types.ObjectId(user.id),
    // recruiterId: new Types.ObjectId("69eafd9d84b0731c0dae368b"),
    status: parsedData.data.status as "pending" | "approved" | "rejected",
  };
  console.log("PARSED:", parsedData);
  const res = await jobServices.createJobIntoDB(payload);

  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully a job are created",
    data: res,
  });
});

const getAllJobs = catchAsync(async () => {
  const result = await jobServices.getAllJobsFromDB();
  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully all Jobs are fetched",
    data: result,
  });
});

export const getMyJobs = catchAsync(async () => {
  const user = await withAuth(["admin", "recruiter"]);
  const result = await jobServices.getRecruiterJobs(user.id);
  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully get my Jobs",
    data: result,
  });
});

export const getSingleJobs = catchAsync(async (_, routeCtx) => {
  const result = await jobServices.getJobById(routeCtx.params.id);
  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully get Single Job",
    data: result,
  });
});

// need to modify
export const updateSingleJob = catchAsync(async (req, routeCtx) => {
  const user = await withAuth(["recruiter", "admin"]);

  const body = await req.json();
  const parsedData = updateJobValidationSchema.safeParse(body);

  if (!parsedData)
    throw new AppError(httpStatus.BAD_REQUEST, "Data is not parsed");

  const result = await jobServices.updateJobs(
    routeCtx.params.id,
    parsedData.data as UpdateJobType,
    user.id,
    user.role,
  );
  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Updated a Single Job",
    data: result,
  });
});

export const updateJobStatus = catchAsync(async (req, routeCtx) => {
  await withAuth(["admin"]);

  const { status } = await req.json();

  if (!["approved", "rejected"].includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Status must be approved or rejected",
    );
  }
  const result = await jobServices.updateJobStatus(routeCtx.params.id, status);
  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Status Updated",
    data: result,
  });
});

export const deleteJob = catchAsync(async (_, routeCtx) => {
  const user = await withAuth(["recruiter", "admin"]);

  const result = await jobServices.deleteJob(
    routeCtx.params.id,
    user.id,
    user.role,
  );
  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Deleted a Job",
    data: result,
  });
});

export const jobControllers = {
  createJob,
  getAllJobs,
  getMyJobs,
  getSingleJobs,
  updateSingleJob,
  updateJobStatus,
  deleteJob,
};
