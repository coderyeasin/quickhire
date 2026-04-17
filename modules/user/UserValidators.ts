import z from "zod";

export const registerValidator = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
    avatar: z.any().optional(),
    role: z
      .enum(["candidate", "admin", "recruiter"] as const, {
        message: "Please select a valid role",
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginValidator = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const updateProfileValidator = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").optional(),
  avatar: z.string().optional(),
});

export const changePasswordValidator = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters long"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long"),
    confirmNewPassword: z
      .string()
      .min(6, "Confirm new password must be at least 6 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
  });

export type RegisterInput = z.infer<typeof registerValidator>;
export type LoginInput = z.infer<typeof loginValidator>;
export type UpdateProfileInput = z.infer<typeof updateProfileValidator>;
export type ChangePasswordInput = z.infer<typeof changePasswordValidator>;
