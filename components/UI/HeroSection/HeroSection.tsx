import CustomButton from "@/shared/CustomButton";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import { SlLocationPin } from "react-icons/sl";


const HeroSection = () => {
  return (
    <section className="container-layout relative py-10">
      <div className="flex lg:flex-row justify-between items-center relative ">
        <div className="flex flex-col items-start justify-center z-10 space-y-5 py-20">
          <h1 className="text-[72px] font-bold text-dark-text leading-20 font-clash">
            Discover <br /> more than <br />
            <span className="text-blue-text">5000+ Jobs</span>
            <Image
              src="/images/line-shape.png"
              alt="line-shape"
              width={400}
              height={50}
              className="object-contain"
              priority
            />
          </h1>
          <p className="text-xl text-primary-gray/70 leading-[160%]">
            Great platform for the job seeker that searching for <br /> new
            career heights and passionate about startups.
          </p>
          <div className="flex flex-col items-start gap-5">
            <div className="p-4 bg-white flex flex-col lg:flex-row items-end gap-3">
              <div className="flex items-center text-2xl gap-3">
                <FiSearch />

                <input
                  type="text"
                  placeholder="Job title or keyword"
                  className="outline-none font-epilogue text-third-gray text-sm w-67.5 px-3 py-2 border-b-2 border-gray-300 focus:border-indigo-text transition-colors duration-300"
                />
              </div>
              <div className="flex items-center text-2xl gap-3">
                <SlLocationPin />

                <input
                  type="text"
                  placeholder="Florence, Italy"
                  className="outline-none font-epilogue text-third-gray text-sm w-67.5 px-3 py-2 border-b-2 border-gray-300 focus:border-indigo-text transition-colors duration-300"
                />
              </div>
              <CustomButton
                label="Search my job"
                className="text-white font-bold bg-indigoTags w-44 py-4"
              />
            </div>
            <p className="text-md font-epilogue text-second-gray/70">
              Popular : UI Designer, UX Researcher, Android, Admin
            </p>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end z-0">
          <div className="absolute -translate-y-6/12 w-125.25 h-176.75">
            <Image
              src="/images/hero/candidates.png"
              alt="hero"
              fill
              className="object-contain [clip-path:polygon(0_0,100%_0,100%_80%,94%_100%,0_100%)]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
