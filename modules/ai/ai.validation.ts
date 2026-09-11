import { z } from "zod";

export const aiJobDescriptionFieldsSchema = z.object({
  title: z
    .string()
    .min(1, "Job title is required")
    .trim()
    .max(100, "Job title is too long"),

  company: z
    .string()
    .min(1, "Company name is required")
    .trim()
    .max(150, "Company name is too long"),

  category: z
    .array(z.string().min(1))
    .min(1, "At least one category is required"),

  location: z
    .string()
    .min(1, "Location is required")
    .trim()
    .max(150, "Location is too long"),

  type: z.enum(["full-time", "part-time", "remote", "intern"]),

  salary: z.string().optional().default("Negotiable"),

  skills: z
    .array(z.string().min(1))
    .min(1, "At least one skill is required")
    .max(30),
});

export const aiGeneratedJobDescriptionSchema = z.object({
  description: z.string().min(1, "Generated description is empty"),
});

export type AIJobDescriptionFields = z.infer<
  typeof aiJobDescriptionFieldsSchema
>;

export type AIGeneratedJobDescription = z.infer<
  typeof aiGeneratedJobDescriptionSchema
>;
