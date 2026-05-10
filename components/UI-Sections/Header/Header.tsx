"use client";

import Image from "next/image";
import Link from "next/link";
import CustomButton from "@/shared/CustomButton";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Modal from "@/shared/Modal";
import UserProfile from "@/shared/UserProfile";
import { ModalMode } from "@/types/types";

const routes = [
  { name: "Find Jobs", path: "/jobs" },
  { name: "Browse Companies", path: "/companies" },
];

export default function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("login");

  const isLoggedIn = !!session;

  return (
    <section>
      <header className="bg-[#f8f8fd]">
        <nav className="container-layout flex justify-between items-center py-5">
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
              {routes.map((route) => (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className="text-primary-gray hover:text-dark-text transition-colors"
                  >
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 font-epilogue">
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
      </header>

      <Modal open={open} onOpenChange={setOpen} mode={mode} setMode={setMode} />
    </section>
  );
}
