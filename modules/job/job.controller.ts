import httpStatus from "http-status";
import { withAuth } from "@/lib/withAuth";
import catchAsync from "@/utils/catchAsync";
import createJobValidationSchema from "./job.validation";
import sendResponse from "@/utils/sendResponse";
import AppError from "@/lib/AppError";
import { NextRequest } from "next/server";
import { uploadCloudinary } from "@/lib/cloudinary";
import { jobServices } from "./job.service";
import { Types } from "mongoose";

export const createJobController = catchAsync(async (req: NextRequest) => {
  //   const user = await withAuth(["recruiter", "admin"]);

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
    recruiterId: new Types.ObjectId("69eafd9d84b0731c0dae368b"),
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

export const jobControllers = {
  createJobController,
};
