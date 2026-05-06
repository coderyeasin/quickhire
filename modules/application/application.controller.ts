import { withAuth } from "@/lib/withAuth";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { NextRequest } from "next/server";
import httpStatus from "http-status";
import {
  createApplicationValidationSchema,
  updateApplicationStatusValidationSchema,
} from "./application.validation";
import AppError from "@/lib/AppError";
import { applicationServices } from "./application.service";
import { ApplicationStatus } from "./application.interface";

const createApplication = catchAsync(async (req: NextRequest) => {
  const user = await withAuth(["candidate", "admin"]);

  const body = await req.json();

  const parsedData = createApplicationValidationSchema.safeParse(body);

  if (!parsedData.success)
    throw new AppError(httpStatus.BAD_REQUEST, "Data is not parsed");

  console.log("Received application data:", parsedData.data);

  const result = await applicationServices.applyToJob(
    user.id,
    parsedData.data?.jobId as string,
    parsedData.data?.coverLetter,
    parsedData.data?.resumeUrl,
  );

  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully applied to the job",
    data: result,
  });
});

const getAllAppliedJobs = catchAsync(async () => {
  await withAuth(["admin"]);

  const result = await applicationServices.getAllApplications();

  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully get all applications",
    data: result,
  });
});

const getMyApplications = catchAsync(async () => {
  const user = await withAuth(["candidate"]);

  const result = await applicationServices.getOwnApplications(user.id);

  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully get my applications",
    data: result,
  });
});

const getSingleApplicantById = catchAsync(async (req, routeCtx) => {
  const user = await withAuth(["candidate", "recruiter", "admin"]);

  const { id: applicationId } = await routeCtx.params;
  const result = await applicationServices.getApplicationById(
    applicationId,
    user.role,
    user.id,
  );

  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully get single application",
    data: result,
  });
});

const updateAppliedJobStatus = catchAsync(async (req, routeCtx) => {
  const user = await withAuth(["recruiter", "admin"]);

  const { id: applicationId } = await routeCtx.params;

  const body = await req.json();

  const parsedData = updateApplicationStatusValidationSchema.safeParse(body);

  if (!parsedData.success)
    throw new AppError(httpStatus.BAD_REQUEST, "Status is required");

  const { status } = parsedData.data;

  if (!["reviewing", "shortlisted", "rejected", "hired"].includes(status))
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid status. Allowed values are reviewing, shortlisted, rejected, hired",
    );

  const result = await applicationServices.updateApplicationStatus(
    applicationId,
    status as ApplicationStatus,
    user.role,
    user.id,
  );

  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully updated application status",
    data: result,
  });
});

//job/id/applicants
const getJobByIdApplicants = catchAsync(async (req, routeCtx) => {
  const user = await withAuth(["recruiter", "admin"]);

  const { id: jobId } = await routeCtx.params;

  const result = await applicationServices.getJobApplicantsById(
    jobId,
    user.id,
    user.role,
  );

  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully get applicants for the job",
    data: result,
  });
});

const withdrawAppliedJob = catchAsync(async (req, routeCtx) => {
  const user = await withAuth(["candidate"]);

  const { id: applicationId } = await routeCtx.params;

  const result = await applicationServices.withdrawApplication(
    applicationId,
    user.id,
  );

  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully withdrawn the application",
    data: result,
  });
});

export const applicationControllers = {
  createApplication,
  getAllAppliedJobs,
  getMyApplications,
  updateAppliedJobStatus,
  getSingleApplicantById,
  getJobByIdApplicants,
  withdrawAppliedJob,
};
