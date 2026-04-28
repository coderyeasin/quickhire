"use client";
import Link from "next/link";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";
import NavLinks, { getNavItems, getNavItemsForRole } from "@/shared/NavLinks";
import { useState } from "react";
import { signOut } from "next-auth/react";

interface NavLinksProps {
  role: string;
  user: {
    name: string;
    email: string;
  };
}

export default function Sidebar({ role, user }: NavLinksProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="hidden lg:flex fixed inset-y-0 left-0 z-50">
        <SidebarContent role={role} user={user} />
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-6 left-1/2 z-50 p-2 bg-indigoTags text-white rounded-lg shadow-md cursor-pointer"
      >
        <FiMenu className="text-xl" />
      </button>

      {/* Mobile */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 text-white/60 hover:text-white cursor-pointer"
            >
              <FiX className="text-xl" />
            </button>

            <SidebarContent role={role} user={user} />
          </div>
        </div>
      )}
    </>
  );
}

function SidebarContent({ role, user }: NavLinksProps) {
  const { main, organization } = getNavItems(role);

  return (
    <aside className="w-64 bg-indigoTags text-white flex flex-col h-full">
      {/* Logo */}
      <div className="p-8 shrink-0">
        <Link href="/" className="block">
          <Image
            src="/images/Logo-wht.png"
            alt="logo"
            width={152}
            height={36}
            priority
          />
          <span className="text-[10px] block text-white/60 font-sans uppercase tracking-widest mt-1">
            {getNavItemsForRole(role)}
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <p className="text-[11px] font-bold text-white/40 uppercase px-4 mb-3 tracking-wider">
          Main Menu
        </p>

        {main.map((item) => (
          <NavLinks key={item.href} {...item} />
        ))}

        {organization.length > 0 && (
          <div className="pt-6">
            <p className="text-[11px] font-bold text-white/40 uppercase px-4 mb-3 tracking-wider">
              Organization
            </p>
            {organization.map((item) => (
              <NavLinks key={item.href} {...item} />
            ))}
          </div>
        )}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-3 px-3 py-3 mb-1">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">
            {user.name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-white/50 truncate">{user.email}</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white rounded-lg w-full transition-colors group"
        >
          <FiLogOut className="group-hover:translate-x-0.5 transition-transform" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
