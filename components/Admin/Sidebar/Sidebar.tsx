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

const Sidebar = ({ role }: { role: string }) => {
  console.log("User Role in Sidebar:", role); // Debugging line to check the role value
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

        <AdminNavLink href="/admin" icon={<FiGrid />}>
          Dashboard
        </AdminNavLink>

        <AdminNavLink href="/admin/jobs" icon={<FiBriefcase />}>
          Manage Jobs
        </AdminNavLink>

        <AdminNavLink href="/admin/add" icon={<FiPlusCircle />}>
          Post New Job
        </AdminNavLink>

        <div className="pt-8">
          <p className="text-[11px] font-bold text-white uppercase px-4 mb-4 tracking-wider">
            Organization
          </p>
          <AdminNavLink href="/admin/candidates" icon={<FiUsers />}>
            Applications
          </AdminNavLink>
          <AdminNavLink href="/admin/settings" icon={<FiSettings />}>
            Settings
          </AdminNavLink>
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

// Sidebar Link Component for cleaner code
function AdminNavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-footer-gray hover:text-white hover:bg-white/5 group"
    >
      <span className="text-xl group-hover:text-blue-text transition-colors">
        {icon}
      </span>
      {children}
    </Link>
  );
}
