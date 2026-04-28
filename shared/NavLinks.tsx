import {
  FiGrid,
  FiBriefcase,
  FiPlusCircle,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiFileText,
} from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface INavItems {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function getNavItems(role: string): {
  main: INavItems[];
  organization: INavItems[];
} {
  if (role === "admin") {
    return {
      main: [
        { href: "/admin", label: "Dashboard", icon: <FiGrid /> },
        { href: "/admin/jobs", label: "Manage Jobs", icon: <FiBriefcase /> },
        { href: "/admin/add", label: "Post New Job", icon: <FiPlusCircle /> },
      ],
      organization: [
        { href: "/admin/candidates", label: "Applications", icon: <FiUsers /> },
        { href: "/admin/profile", label: "Settings", icon: <FiSettings /> },
      ],
    };
  } else if (role === "recruiter") {
    return {
      main: [
        { href: "/recruiter", label: "Dashboard", icon: <FiGrid /> },
        { href: "/recruiter/jobs", label: "My Jobs", icon: <FiBriefcase /> },
        {
          href: "/recruiter/add",
          label: "Post New Job",
          icon: <FiPlusCircle />,
        },
      ],
      organization: [
        {
          href: "/recruiter/applications",
          label: "Applications",
          icon: <FiUsers />,
        },
        { href: "/recruiter/profile", label: "Settings", icon: <FiSettings /> },
      ],
    };
  } else if (role === "candidate") {
    return {
      main: [
        { href: "/candidate", label: "Dashboard", icon: <FiGrid /> },
        {
          href: "/candidate/jobs",
          label: "Available Jobs",
          icon: <FiBriefcase />,
        },
        {
          href: "/candidate/applications",
          label: "My Applications",
          icon: <FiFileText />,
        },
      ],
      organization: [
        { href: "/candidate/profile", label: "Settings", icon: <FiSettings /> },
      ],
    };
  } else {
    return { main: [], organization: [] };
  }
}

export function getNavItemsForRole(role: string) {
  if (role === "admin") return "Admin Portal";
  if (role === "recruiter") return "Recruiter Portal";
  return "Candidate Portal";
}

function NavLinks({ href, label, icon }: INavItems) {
  const pathName = usePathname();
  const isActive = pathName === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? "bg-white/20 text-white"
          : "text-white/60 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  );
}

export default NavLinks;
