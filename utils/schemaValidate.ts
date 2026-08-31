import z from "zod";

export const createJobSchema = z.object({
  title: z.string().min(3, "Title required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  company: z.string().min(2, "Company required"),
  companyLogo: z
    .any()
    .refine((file) => file?.length === 1, "Company logo is required"),
  category: z.string().min(1, "Enter at least one category"),
  location: z.string().min(2, "Location required"),
  type: z.enum(["full-time", "part-time", "remote", "intern"]),
  skills: z.string().min(1, "Enter at least one skill"),
  salary: z.string().optional(),
  deadline: z.string().optional(),
});

export type CreateJobsTypes = z.infer<typeof createJobSchema>;
