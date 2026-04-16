"use server";
import bcrypt from "bcrypt";
import { signIn, signOut } from "@/lib/auth";
import { connectToDB } from "@/lib/mongodb";
import { UserModel } from "@/modules/user/user.model";
import { AuthError } from "next-auth";

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  try {
    await connectToDB();
    const existingUser = await UserModel.findOne({ email }).exec();
    if (existingUser) {
      throw new Error("User already exists");
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      name,
      email,
      password: password,
      role: "candidate",
    });
    await signIn("credentials", {
      email,
      password: password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) return { error: "Auth failed" };
    return { error: "Something went wrong" };
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Invalid credentials" };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) return { error: "Auth failed" };
    return { error: "Something went wrong" };
  }
}

export async function logoutAction() {
  await signOut({ redirect: false });
  return { success: true };
}
