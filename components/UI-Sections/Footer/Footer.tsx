import CustomButton from "@/shared/CustomButton";
import Image from "next/image";
import React from "react";
import {
  FaDribbble,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const ftrLinks = [
  "Companies",
  "Pricing",
  "Terms",
  "Advice",
  "Privacy Policy",
  "Help Docs",
  "Guide",
  "Updates",
  "Contact Us",
];
const Footer = () => {
  const socialCircle =
    "h-8 w-8 bg-[#363A45] rounded-full flex justify-center items-center text-white cursor-pointer hover:bg-indigoTags transition-colors";
  return (
    <footer className="bg-second-gray w-full">
      <section className="container-layout">
        <div className="w-full flex flex-col md:flex-row justify-between items-start gap-6 md:gap-8 lg:gap-14 border-b-2 border-third-gray pt-10 md:pt-20 pb-8 md:pb-10 text-footerTxt font-epilogue leading-[160%]">
          <div className="w-full md:w-5/12 space-y-4 md:space-y-5">
            <Image
              src={"/images/Logo-wht.png"}
              alt="wht-logo"
              width={152}
              height={36}
              priority
              className="w-32 md:w-40 h-auto"
            />
            <p className="text-sm md:text-base">
              Great platform for the job seeker that passionate about startups.
              Find your dream job easier.
            </p>
          </div>
          <div className="w-full sm:w-1/2 md:w-2/12">
            <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-0">
              About
            </h3>
            <ul>
              {ftrLinks.slice(0, 5).map((item, i) => (
                <li
                  key={i}
                  className="py-1 md:py-2 cursor-pointer text-sm md:text-base hover:text-white transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full sm:w-1/2 md:w-2/12">
            <h3 className="leading-[160%] text-base md:text-lg font-semibold text-white mb-3 md:mb-0">
              Resources
            </h3>
            <ul>
              {ftrLinks.slice(5, 9).map((item, i) => (
                <li
                  key={i}
                  className="py-1 md:py-2 cursor-pointer text-sm md:text-base hover:text-white transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-4/12 space-y-4 md:space-y-5">
            <p className="text-sm md:text-base">
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <input
                type="text"
                placeholder="Email Address"
                className="outline-none font-epilogue bg-white text-third-gray text-sm px-3 md:px-4 py-2 md:py-3 flex-1 min-w-0"
              />

              <CustomButton
                label="Subscribe"
                className="text-white font-bold bg-indigoTags px-4 md:px-5 py-2 md:py-3 whitespace-nowrap w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-4 py-8 md:py-10">
          <h3 className="font-medium font-epilogue leading-[160%] text-white/50 text-center sm:text-left text-xs md:text-sm">
            2021 @ QuickHire. All rights reserved.
          </h3>
          <div className="text-white flex justify-center items-center gap-3 flex-wrap">
            <p className={socialCircle}>
              <FaFacebookF className="text-sm md:text-lg" />
            </p>
            <p className={socialCircle}>
              <FaInstagram className="text-sm md:text-lg" />
            </p>
            <p className={socialCircle}>
              <FaDribbble className="text-sm md:text-lg" />
            </p>
            <p className={socialCircle}>
              <FaLinkedinIn className="text-sm md:text-lg" />
            </p>
            <p className={socialCircle}>
              <FaTwitter className="text-sm md:text-lg" />
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
