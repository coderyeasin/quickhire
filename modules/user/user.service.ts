import { connectToDB } from "@/lib/mongodb";
import { UserModel } from "./user.model";
import bcrypt from "bcryptjs";
import { UserRole } from "./user.interface";

// Get users
export async function getAllUsers() {
  await connectToDB();
  return await UserModel.find().sort({ createdAt: -1 });
}
// Get user by email
export async function getUserByEmail(email: string) {
  await connectToDB();
  return UserModel.findOne({ email }).lean();
}

// find user by id
export async function getUserById(id: string) {
  await connectToDB();
  return UserModel.findById(id).lean();
}

// create user - called during registration
export async function createUser(userData: {
  name: string;
  email: string;
  company?: string;
  password: string;
  avatar?: string;
  role?: UserRole;
}) {
  await connectToDB();
  const existingUser = await UserModel.findOne({ email: userData.email });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 12);

  const newUser = await UserModel.create({
    name: userData.name,
    email: userData.email,
    company: userData.company,
    password: hashedPassword,
    avatar: userData.avatar ?? null,
    role: userData.role ?? "candidate",
  });

  return newUser;
}

// update user profile for OAuth users
export async function findCreateOAuthUser(userData: {
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
}) {
  await connectToDB();

  let user = await UserModel.findOne({ email: userData.email });
  if (!user) {
    user = await UserModel.create({
      name: userData.name,
      email: userData.email,
      password: await bcrypt.hash(Math.random().toString(36).slice(-8), 12), // random password for OAuth users
      avatar: userData.avatar ?? null,
      role: userData.role ?? "candidate",
    });
  }
  return user;
}
