"use client";

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth.actions";
import AuthModal, { AuthMode } from "@/components/Auth/AuthModal";
import CustomButton from "@/shared/CustomButton";

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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = status === "authenticated" && !!session;
  const user = session?.user;
  const dashboard = getDashboard(user?.role);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleOpenModal(selectedMode: AuthMode) {
    setMode(selectedMode);
    setOpen(true);
  }

  async function handleLogout() {
    setDropdownOpen(false);
    await logoutAction();
  }

  return (
    <header className="container-layout">
      <nav className="flex justify-between items-center py-5">
        {/* Logo + Nav links */}
        <div className="text-xl font-bold text-dark-text flex items-center gap-12">
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

        {/* Right side */}
        <div className="flex items-center gap-3 font-epilogue">
          {status === "loading" ? (
            // Skeleton while session loads — prevents layout shift
            <div className="w-9 h-9 rounded-full bg-indigoTags/20 animate-pulse" />
          ) : isLoggedIn ? (
            // ── Logged-in: avatar + dropdown ─────────────────────
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 group focus:outline-none"
                aria-label="User menu"
              >
                {/* Avatar */}
                <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-indigoTags/30 group-hover:ring-indigoTags transition-all">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name ?? "Avatar"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigoTags flex items-center justify-center text-white text-sm font-semibold">
                      {getInitials(user?.name)}
                    </div>
                  )}
                </div>
                {/* Name + role badge */}
                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-sm font-semibold text-dark-text">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <span className="text-[11px] text-indigoTags capitalize font-medium">
                    {user?.role}
                  </span>
                </div>
                {/* Chevron */}
                <svg
                  className={`w-4 h-4 text-primary-gray transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User info header */}
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
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-primary-gray hover:bg-indigoTags/5 hover:text-dark-text transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"
                        />
                      </svg>
                      Dashboard
                    </Link>

                    <Link
                      href={`${dashboard}/profile`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-primary-gray hover:bg-indigoTags/5 hover:text-dark-text transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                      Profile
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // ── Logged-out: Login + Sign Up buttons ──────────────
            <div className="flex items-center gap-3 divide-x divide-gray-300">
              <CustomButton
                label="Login"
                onClick={() => handleOpenModal("login")}
                className="bg-white text-indigoTags font-bold"
              />
              <CustomButton
                label="Sign Up"
                onClick={() => handleOpenModal("register")}
                className="bg-indigoTags text-white font-bold"
              />
            </div>
          )}
        </div>

        {/* Modal — outside the button group, always mounted */}
        <AuthModal
          isOpen={open}
          onClose={() => setOpen(false)}
          mode={mode}
          setMode={setMode}
        />
      </nav>
    </header>
  );
}

/*
import AuthModal, { AuthMode } from "@/components/Auth/AuthModal";
import CustomButton from "@/shared/CustomButton";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  const handleOpenModal = (selectedMode: AuthMode) => {
    setMode(selectedMode);
    setOpen(true);
  };
  return (
    <header className="container-layout">
      <nav className="flex justify-between items-center py-5">
        <div className="text-xl font-bold text-dark-text flex items-center gap-12">
          <Link href={`/`}>
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
                className=" text-primary-gray hover:text-dark-text"
              >
                Find Jobs
              </Link>
            </li>
            <li>
              <Link href="#" className="text-primary-gray hover:text-dark-text">
                Browse Companies
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-3 divide-x divide-gray-300 font-epilogue">
          <CustomButton
            label="Login"
            onClick={() => handleOpenModal("login")}
            className="bg-white text-indigoTags font-bold"
          />
          <CustomButton
            label="Sign Up"
            onClick={() => handleOpenModal("register")}
            className="bg-indigoTags text-white font-bold"
          />
          <AuthModal
            isOpen={open}
            onClose={() => setOpen(false)}
            mode={mode}
            setMode={setMode}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
*/
