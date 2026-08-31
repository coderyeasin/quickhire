import httpStatus from "http-status";
import { UserRole } from "@/modules/user/user.interface";
import { auth } from "@/lib/auth";
import AppError from "@/lib/AppError";

export async function withAuth(allowedRoles?: UserRole[]) {
  const session = await auth();

  if (!session?.user) {
    throw new AppError(httpStatus.BAD_REQUEST, "Not authenticated");
  }
  if (allowedRoles && !allowedRoles.includes(session.user.role as UserRole)) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You do not have permission");
  }
  return session.user;
}
