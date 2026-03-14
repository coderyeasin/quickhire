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
    "h-8 w-8 bg-[#363A45] rounded-full flex justify-center items-center";
  return (
    <footer className="bg-second-gray w-full h-124.25">
      <section className="container-layout">
        <div className="w-full flex justify-between items-start gap-14 border-b-2 border-third-gray  pt-20 pb-10 text-footerTxt font-epilogue leading-[160%]">
          <div className="w-5/12 space-y-5">
            <Image
              src={"/images/Logo-wht.png"}
              alt="wht-logo"
              width={152}
              height={36}
              priority
            />
            <p className="">
              Great platform for the job seeker that <br /> passionate about
              startups. Find your dream job easier.
            </p>
          </div>
          <div className="w-2/12">
            <h3 className=" text-lg font-semibold text-white">About</h3>
            <ul>
              {ftrLinks.slice(0, 5).map((item, i) => (
                <li key={i} className="py-2 cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-2/12">
            <h3 className="leading-[160%] text-lg font-semibold text-white">
              Resources
            </h3>
            <ul>
              {ftrLinks.slice(5, 9).map((item, i) => (
                <li key={i} className="py-2 cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-4/12 space-y-5">
            <p>
              The latest job news, articles, sent to <br /> your inbox weekly.
            </p>
            <div className="flex gap-2 ">
              <input
                type="text"
                placeholder="Email Address"
                className="outline-none font-epilogue bg-white text-third-gray text-sm px-4 py-3"
              />

              <CustomButton
                label="Subscribe"
                className="text-white font-bold bg-indigoTags px-5 py-2"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center py-10">
          <h3 className="font-medium font-epilogue leading-[160%] text-white/50">
            2021 @ QuickHire. All rights reserved.
          </h3>
          <div className="text-white flex justify-center items-center gap-3">
            <p className={socialCircle}>
              <FaFacebookF className="text-lg" />
            </p>
            <p className={socialCircle}>
              <FaInstagram className="text-lg" />
            </p>
            <p className={socialCircle}>
              <FaDribbble className="text-lg" />
            </p>
            <p className={socialCircle}>
              <FaLinkedinIn className=" text-lg" />
            </p>
            <p className={socialCircle}>
              <FaTwitter className=" text-lg" />
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
