import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/candidate": ["candidate", "admin"],
  "/recruiter": ["recruiter", "admin"],
};

function getDashboardRoute(role: string) {
  if (role === "admin") return "/admin";
  if (role === "recruiter") return "/recruiter";
  return "/candidate";
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isProtected = Object.keys(ROLE_ROUTES).some((r) =>
    pathname.startsWith(r),
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (session && isProtected) {
    const role = session.user.role;
    for (const [route, allowed] of Object.entries(ROLE_ROUTES)) {
      if (pathname.startsWith(route) && !allowed.includes(role)) {
        return NextResponse.redirect(new URL(getDashboardRoute(role), req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/candidate/:path*", "/recruiter/:path*"],
};
