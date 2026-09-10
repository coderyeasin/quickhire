import { z } from "zod";

export const generatedJDSchema = z.object({
  title: z.string().min(1, "Job title is required").max(100).trim(),

  company: z.string().max(150).optional(),

  category: z.array(z.string().min(1)).min(1).max(10),

  location: z.string().max(150).optional(),

  type: z.string().max(50).optional(),

  salary: z.string().max(100).optional(),

  skills: z.array(z.string().min(1)).min(1).max(30),

  experience: z.string().max(100).optional(),
});

export const generatedJobDescriptionSchema = z.object({
  description: z.string().min(1).max(3000),
});

export type JobDescriptionInput = z.infer<typeof generatedJDSchema>;

export type GeneratedJobDescription = z.infer<
  typeof generatedJobDescriptionSchema
>;
