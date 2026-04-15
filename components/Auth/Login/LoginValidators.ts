import z from "zod";

export const loginValidation = z.object({
  name: z.string().min(5, "Invalid your name"),
  email: z.string().email("Invalid your email"),
  password: z.string().min(6, "Password is required"),
  avatar: z.string().min(6, "Avatar is required"),
});
