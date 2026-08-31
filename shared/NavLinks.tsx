import Link from "next/link";

function NavLinks({
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

export default NavLinks;
