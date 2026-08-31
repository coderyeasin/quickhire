"use client";

import Image from "next/image";
import Link from "next/link";
import CustomButton from "@/shared/CustomButton";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Modal from "@/shared/Modal";
import UserProfile from "@/shared/UserProfile";
import { ModalMode } from "@/types/types";
import { usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";

const routes = [
  { name: "Find Jobs", path: "/jobs" },
  { name: "Browse Companies", path: "/companies" },
];

export default function Header() {
  const pathName = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHomePage = pathName === "/";
  const isLoggedIn = !!session;

  return (
    <section>
      <header
        className={`
        w-full z-50
        ${
          isHomePage
            ? "absolute top-0 left-0 bg-transparent"
            : "sticky top-0 bg-white shadow-sm"
        }
      `}
      >
        <nav className="container-layout flex justify-between items-center py-4 md:py-5">
          <div className="flex items-center gap-6 md:gap-12">
            <Link href="/">
              <Image
                src="/images/Logo-blk.png"
                alt="Logo"
                width={152}
                height={36}
                priority
                className="w-28 md:w-40 h-auto"
              />
            </Link>

            <ul className="hidden md:flex space-x-6 lg:space-x-10 text-sm md:text-md font-normal font-epilogue">
              {routes.map((route) => (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className={` ${
                      route.path === pathName ||
                      (route.path === "/jobs" && pathName.startsWith("/jobs/"))
                        ? "text-indigoTags font-semibold"
                        : "text-primary-gray"
                    } hover:text-dark-text transition-colors`}
                  >
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:flex items-center gap-3 font-epilogue">
            {isLoggedIn ? (
              <UserProfile />
            ) : (
              <div className="flex items-center gap-3 divide-x divide-gray-300">
                <CustomButton
                  label="Login"
                  onClick={() => {
                    setMode("login");
                    setOpen(true);
                  }}
                  className="bg-white text-indigoTags font-bold text-sm"
                />
                <CustomButton
                  label="Sign Up"
                  onClick={() => {
                    setMode("register");
                    setOpen(true);
                  }}
                  className="bg-indigoTags text-white font-bold text-sm"
                />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {isLoggedIn && <UserProfile />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <MdClose className="text-2xl text-dark-text" />
              ) : (
                <GiHamburgerMenu className="text-2xl text-dark-text" />
              )}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-in fade-in slide-in-from-top-2">
            <div className="container-layout py-4 space-y-4">
              <ul className="space-y-3 py-2">
                {routes.map((route) => (
                  <li key={route.path}>
                    <Link
                      href={route.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-2 rounded-lg transition-colors ${
                        route.path === pathName ||
                        (route.path === "/jobs" &&
                          pathName.startsWith("/jobs/"))
                          ? "text-indigoTags bg-indigoTags/5 font-semibold"
                          : "text-primary-gray hover:bg-gray-50"
                      }`}
                    >
                      {route.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {!isLoggedIn && (
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <CustomButton
                    label="Login"
                    onClick={() => {
                      setMode("login");
                      setOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="bg-white text-indigoTags font-bold border border-indigoTags w-full text-sm py-2"
                  />
                  <CustomButton
                    label="Sign Up"
                    onClick={() => {
                      setMode("register");
                      setOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="bg-indigoTags text-white font-bold w-full text-sm py-2"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <Modal open={open} onOpenChange={setOpen} mode={mode} setMode={setMode} />
    </section>
  );
}
