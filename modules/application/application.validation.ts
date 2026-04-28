import z from "zod";

export const createApplicationValidationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  coverLetter: z
    .string()
    .max(1000, "Cover letter must be at most 1000 characters")
    .optional(),
  resumeUrl: z
    .string()
    .url("Resume URL must be a valid URL (Drive URL)")
    .optional(),
});

export const updateApplicationStatusValidationSchema = z.object({
  status: z.enum(["pending", "reviewing", "shortlisted", "rejected", "hired"]),
});

export type CreateAppType = z.infer<typeof createApplicationValidationSchema>;
export type UpdateAppStatusType = z.infer<
  typeof updateApplicationStatusValidationSchema
>;
