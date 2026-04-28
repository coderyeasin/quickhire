"use client";

import { usePathname } from "next/navigation";
import { FiBell } from "react-icons/fi";
import Image from "next/image";

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  "/admin": { title: "Dashboard", sub: "Platform overview" },
  "/admin/jobs": { title: "Manage Jobs", sub: "Review and control all jobs" },
  "/admin/add": { title: "Post New Job", sub: "Create a new listing" },
  "/admin/profile": { title: "Settings", sub: "Account preferences" },
  "/recruiter": { title: "Dashboard", sub: "Your recruitment overview" },
  "/recruiter/jobs": { title: "My Jobs", sub: "Jobs you've posted" },
  "/recruiter/add": { title: "Post a Job", sub: "Create a new listing" },
  "/recruiter/profile": { title: "Profile", sub: "Your public profile" },
  "/candidate": { title: "Dashboard", sub: "Your job search overview" },
  "/candidate/jobs": {
    title: "Available Jobs",
    sub: "Available jobs to apply",
  },
  "/candidate/applications": {
    title: "Applications",
    sub: "Track your applications",
  },
  "/candidate/profile": { title: "Profile", sub: "Your candidate profile" },
};

interface ITopHeader {
  user: {
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    role?: string;
  };
}

export default function TopHeader({ user }: ITopHeader) {
  const pathname = usePathname();
  const pageInfo = PAGE_TITLES[pathname] ?? { title: "Dashboard", sub: "" };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40 shrink-0">
      <div className="flex flex-col">
        <h2 className="font-bold text-dark-text font-clash text-lg leading-tight">
          {pageInfo.title}
        </h2>
        <p className="text-xs text-primary-gray">{pageInfo.sub}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Live
        </div>

        <button className="relative p-2 text-primary-gray hover:text-dark-text hover:bg-slate-100 rounded-lg transition-colors">
          <FiBell className="text-lg" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-indigoTags flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {!user.avatar ? (
              <Image
                src={user.avatar || ""}
                alt={user.name ?? "avatar"}
                fill
                className="object-cover"
              />
            ) : (
              (user.name?.charAt(0)?.toUpperCase() ?? "U")
            )}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-dark-text leading-tight">
              {user.name?.split(" ")[1]}
            </p>
            <p className="text-[11px] text-indigoTags capitalize font-medium">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
