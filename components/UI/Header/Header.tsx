"use client";

import CustomButton from "@/shared/CustomButton";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="w-full">
      <div className="container-layout">
        <nav className="flex justify-between items-center py-4 md:py-5">
          <div className=" flex items-center gap-7">
            <div className="text-xl font-bold text-dark-text">
              <Link href={`/`}>
                <Image
                  src="/images/Logo-blk.png"
                  alt="Logo"
                  width={152}
                  height={36}
                  priority
                  className="w-32 md:w-40 h-auto"
                />
              </Link>
            </div>

            <ul className="hidden lg:mt-2 md:flex text-md font-normal font-epilogue items-center gap-8">
              <li>
                <Link
                  href="#"
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
          {/* Desktop Buttons */}
          <div className="hidden md:flex divide-x-2 divide-gray-300 space-x-3 font-epilogue">
            <CustomButton
              label="Login"
              className="bg-white text-indigoTags font-bold px-5 py-2"
            />
            <CustomButton
              label="Sign Up"
              className="bg-indigoTags text-white font-bold px-5 py-2"
            />
          </div>

          {/* Hamburger Menu Icon */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-2xl text-dark-text z-20"
            aria-label="Toggle menu"
          >
            {isOpen ? <MdClose /> : <GiHamburgerMenu />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-primary-gray z-20 shadow-lg">
            <ul className="flex flex-col space-y-4 text-md font-normal font-epilogue px-6 py-6">
              <li>
                <Link
                  href="#"
                  className="text-white hover:text-dark-text transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white hover:text-dark-text transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Browse Companies
                </Link>
              </li>
            </ul>
            <div className="flex flex-col gap-3 font-epilogue px-6 pb-6">
              <CustomButton
                label="Login"
                className="bg-white text-indigoTags font-bold border border-indigoTags w-full py-2"
              />
              <CustomButton
                label="Sign Up"
                className="bg-indigoTags text-white font-bold w-full py-2"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
