"use server";

import { signIn, signOut } from "@/lib/auth";
import { uploadCloudinary } from "@/lib/cloudinary";
import { createUser } from "@/modules/user/user.service";
import { registerValidator } from "@/modules/user/UserValidators";
import { AuthError } from "next-auth";

export async function getDashboardUrl(role: string): Promise<string> {
  if (role === "admin") return "/admin";
  if (role === "recruiter") return "/recruiter";
  return "/candidate";
}

// Register Action
export async function registerAction(formData: FormData) {
  try {
    const avatarFile = formData.get("avatar");

    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      role: formData.get("role") as string,
    };

    // zod schema validation
    const parsedData = registerValidator.safeParse(raw);
    if (!parsedData.success) {
      return {
        success: false,
        errors: parsedData.error.flatten().fieldErrors,
      };
    }
    // image upload
    let avatarUrl: string | undefined;

    if (avatarFile instanceof File && avatarFile.size > 0) {
      if (!avatarFile.type.startsWith("image/")) {
        return {
          success: false,
          errors: { avatar: ["Invalid image type"] },
        };
      }

      avatarUrl = await uploadCloudinary(avatarFile);
    }

    await createUser({
      ...parsedData.data,
      avatar: avatarUrl,
      role: parsedData.data.role as "candidate" | "admin" | "recruiter",
    });

    return { success: true };
  } catch (error) {
    console.error("Error during registration:", error);
    return {
      success: false,
      errors: {
        general: ["An unexpected error occurred. Please try again later."],
      },
    };
  }
}

// login action
export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });
    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        errors: {
          general: [error.message],
        },
      };
    }
  }
}

// google login action
export async function googleLoginAction(role?: string) {
  await signIn("google", {
    redirectTo: `/${role ?? "candidate"}`,
  });
}

// logout action
export async function logoutAction() {
  await signOut({
    redirectTo: "/",
  });
}
