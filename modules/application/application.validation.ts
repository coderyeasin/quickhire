import z from "zod";

export const createApplicationValidationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  coverLetter: z
    .string()
    .max(800, "Cover letter must be at most 800 characters"),
  resumeUrl: z.string().url("Resume URL must be a valid URL (Drive URL)"),
});

export const updateApplicationStatusValidationSchema = z.object({
  status: z.enum(["pending", "reviewing", "shortlisted", "rejected", "hired"]),
});

export type CreateAppType = z.infer<typeof createApplicationValidationSchema>;
export type UpdateAppStatusType = z.infer<
  typeof updateApplicationStatusValidationSchema
>;
