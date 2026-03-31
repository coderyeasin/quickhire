import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(
  req: NextRequest,
  requiredRole: "admin" | "candidate",
) {
  const session = await auth();
  if (!session || session.user.role !== requiredRole) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/candidate/:path*"],
};
