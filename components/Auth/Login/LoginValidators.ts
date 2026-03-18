import z from "zod";

export const loginValidation = z.object({
  email: z.string().email("Invalid your email"),
  password: z.string().min(6, "Password is required"),
});
