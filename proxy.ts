import { NextResponse } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/candidate": ["candidate", "admin"],
  "/recruiter": ["recruiter", "admin"],
};

function getDashboardRoute(role: string) {
  if (role === "admin") return "/admin";
  // if(role === "candidate") return "/candidate";
  if (role === "recruiter") return "/recruiter";
  return "/candidate";
}

export default function proxy(req) {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  //   not logged in - redirect to login
  const isProtectedRoute = Object.keys(ROLE_ROUTES).some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !session) {
    // return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (session) {
    const userRole = session.user.role;

    for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
      if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
        return NextResponse.redirect(
          new URL(`/${getDashboardRoute(userRole)}`, req.url),
        );
      }
    }

    // if (pathname === "/login" || pathname === "/register") {
    //   return NextResponse.redirect(new URL(`/${getDashboardRoute(userRole)}`, req.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/candidate/:path*",
    "/recruiter/:path*",
    // "/login",
    // "/register",
  ],
};
