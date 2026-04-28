import { Types } from "mongoose";
import { z } from "zod";

export const jobTypeEnum = z.enum([
  "full-time",
  "part-time",
  "remote",
  "intern",
]);

export const jobStatusEnum = z.enum(["pending", "approved", "rejected"]);

export const createJobValidationSchema = z.object({
  title: z.string().min(1, "Job title is required").trim(),
  description: z.string().min(1, "Job description is required"),
  company: z.string().min(1, "Company name is required"),
  companyLogo: z.any().optional(),
  category: z
    .array(z.string().min(1))
    .min(1, "At least one category is required"),
  location: z.string().min(1, "Location is required"),
  type: jobTypeEnum,
  salary: z.string().optional().default("Negotiable"),
  skills: z.array(z.string().min(1)).min(1, "At least one skill is required"),
  recruiterId: z
    .string()
    .min(1, "Recruiter ID is required")
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid recruiter ID",
    })
    .transform((val) => new Types.ObjectId(val))
    .optional(),
  status: jobStatusEnum.default("pending"),
  deadline: z
    .union([z.string(), z.date()])
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

export const updateJobValidationSchema = createJobValidationSchema.partial();

export type CreatedJobType = z.infer<typeof createJobValidationSchema>;
export type UpdateJobType = z.infer<typeof createJobValidationSchema>;
