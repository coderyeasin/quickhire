import { IUser, UserRole } from "@/modules/user/user.interface";
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
    };
  }
  interface User {
    id: string;
    role: UserRole;
    avatar?: string;
    company?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    avatar?: string;
  }
}
