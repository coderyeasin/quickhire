import Link from "next/link";
import {
  FiBriefcase,
  FiPlusCircle,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiGrid,
} from "react-icons/fi";
import Image from "next/image";
import NavLinks from "@/shared/NavLinks";

const Sidebar = () => {
  // console.log("User Role in Sidebar:", role); // Debugging line to check the role value
  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-indigoTags text-white flex flex-col z-50">
      <div className="p-8">
        <Link href="/" className="text-2xl font-bold font-clash tracking-tight">
          <Image
            src={"/images/Logo-wht.png"}
            alt="wht-logo"
            width={152}
            height={36}
            priority
          />
          <span className="text-[10px] block text-white font-sans uppercase tracking-widest mt-1">
            Admin Portal
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <p className="text-[11px] font-bold text-white uppercase px-4 mb-4 tracking-wider">
          Main Menu
        </p>

        <NavLinks href="/admin" icon={<FiGrid />}>
          Dashboard
        </NavLinks>

        <NavLinks href="/admin/jobs" icon={<FiBriefcase />}>
          Manage Jobs
        </NavLinks>

        <NavLinks href="/admin/add" icon={<FiPlusCircle />}>
          Post New Job
        </NavLinks>

        <div className="pt-8">
          <p className="text-[11px] font-bold text-white uppercase px-4 mb-4 tracking-wider">
            Organization
          </p>
          <NavLinks href="/admin/candidates" icon={<FiUsers />}>
            Applications
          </NavLinks>
          <NavLinks href="/admin/profile" icon={<FiSettings />}>
            Settings
          </NavLinks>
        </div>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-third-gray/10">
        {/* <div className="flex items-center gap-3 px-3 py-4">
            <div className="w-10 h-10 rounded-full bg-indigo-text flex items-center justify-center font-bold text-white shrink-0">
              {session.user?.name?.charAt(0) || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{session.user?.name}</p>
              <p className="text-xs text-third-gray truncate">{session.user?.email}</p>
            </div>
          </div> */}
        <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-category-tech hover:bg-category-tech/10 rounded-lg w-full transition-colors group">
          <FiLogOut className="group-hover:translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
