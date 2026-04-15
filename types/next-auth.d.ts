import { IUser } from "@/modules/user/user.interface";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session extends IUser {
    user: {
      id: string;
      name: string;
      email: string;
      role: "candidate" | "admin";
      avatar?: string;
    };
  }
  interface User {
    id: string;
    role: "candidate" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "candidate" | "admin";
    avatar?: string;
  }
}
