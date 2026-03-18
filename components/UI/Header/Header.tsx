"use client";
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
