import { IUser, RecruiterProfile, UserRole } from "@/modules/user/user.interface";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session extends IUser {
    user: {
      id: string;
      name: string;
      email: string;
      company?: string;
      role: UserRole;
      avatar?: string;
      createdAt?: string;
      recruiterProfile?: RecruiterProfile;
    };
  }
  interface User {
    id: string;
    role: UserRole;
    avatar?: string;
    company?: string;
    createdAt?: string;
    recruiterProfile?: RecruiterProfile;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    avatar?: string;
    createdAt?: string;
    recruiterProfile?: RecruiterProfile;
  }
}
