"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import AuthModal, { AuthMode } from "@/components/Auth/AuthModal";
import CustomButton from "@/shared/CustomButton";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { HiOutlineHome } from "react-icons/hi2";
import { CgProfile } from "react-icons/cg";
import { GoSignIn } from "react-icons/go";

function getDashboard(role?: string) {
  if (role === "admin") return "/admin";
  if (role === "recruiter") return "/recruiter";
  return "/candidate";
}

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Header() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [dropdownOpen, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = status === "authenticated";
  const user = session?.user;
  const dashboard = getDashboard(user?.role);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="container-layout">
      <nav className="flex justify-between items-center py-5">
        <div className="flex items-center gap-12">
          <Link href="/">
            <Image
              src="/images/Logo-blk.png"
              alt="Logo"
              width={152}
              height={36}
              priority
            />
          </Link>
          <ul className="flex space-x-10 text-md font-normal font-epilogue mt-2">
            <li>
              <Link
                href="/jobs"
                className="text-primary-gray hover:text-dark-text transition-colors"
              >
                Find Jobs
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-primary-gray hover:text-dark-text transition-colors"
              >
                Browse Companies
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-3 font-epilogue">
          {status === "loading" && (
            <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
          )}

          {isLoggedIn && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdown((p) => !p)}
                className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-indigoTags/30 group-hover:ring-indigoTags transition-all">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name ?? "avatar"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigoTags flex items-center justify-center text-white text-sm font-semibold">
                      {getInitials(user?.name)}
                    </div>
                  )}
                </div>
                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-sm font-semibold text-dark-text">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <span className="text-[11px] text-indigoTags capitalize font-medium">
                    {user?.role}
                  </span>
                </div>

                <MdOutlineKeyboardArrowDown
                  className={`w-6 h-6 text-primary-gray transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-sm font-semibold text-dark-text truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-primary-gray truncate">
                      {user?.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href={dashboard}
                      onClick={() => setDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-primary-gray hover:bg-indigoTags/5 hover:text-dark-text transition-colors"
                    >
                      <HiOutlineHome className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href={`${dashboard}/profile`}
                      onClick={() => setDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-primary-gray hover:bg-indigoTags/5 hover:text-dark-text transition-colors"
                    >
                      <CgProfile className="w-4 h-4" />
                      Profile
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => {
                        setDropdown(false);

                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex items-center gap-2.5 w-full px-4 py-2 cursor-pointer text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <GoSignIn className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {status === "unauthenticated" && (
            <div className="flex items-center gap-3 divide-x divide-gray-300">
              <CustomButton
                label="Login"
                onClick={() => {
                  setMode("login");
                  setOpen(true);
                }}
                className="bg-white text-indigoTags font-bold"
              />
              <CustomButton
                label="Sign Up"
                onClick={() => {
                  setMode("register");
                  setOpen(true);
                }}
                className="bg-indigoTags text-white font-bold"
              />
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={open}
        onClose={() => setOpen(false)}
        mode={mode}
        setMode={setMode}
      />
    </header>
  );
}
