import latestJobCardsData from "@/utils/latestJobCard";
import Image from "next/image";
import React from "react";
import { IoArrowForwardSharp } from "react-icons/io5";

const LatestJobs = () => {
  return (
    <section
      className="bg-[#F8F8FD] bg-[url(/images/hero/Pattern.png)] bg-no-repeat bg-contain bg-right"
      style={{
        clipPath:
          "polygon(10% 0%, 80% 0%, 100% 0%, 100% 80%, 100% 100%, 0% 100%, 0% 80%, 0% 20%)",
      }}
    >
      <div className="container-layout py-8 md:py-14">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-semibold font-clash leading-tight md:leading-[160%]">
            Latest <span className="text-blue-text"> jobs open</span>
          </h2>
          <div className="flex items-center gap-2 text-indigoTags cursor-pointer text-sm md:text-md">
            <h3 className="font-medium">Show all jobs</h3>
            <IoArrowForwardSharp className="text-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 w-full mx-auto mt-8 md:mt-10">
          {latestJobCardsData.map((job) => (
            <div
              key={job.id}
              className="flex flex-col sm:flex-row items-start gap-4 md:gap-6 bg-white p-4 md:p-6 border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="shrink-0 w-full sm:w-auto">
                <Image
                  src={job.image}
                  alt={job.title}
                  className="object-contain w-12 md:w-16 h-auto"
                  width={64}
                  height={84}
                  priority
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <h4 className="text-lg md:text-xl font-bold text-dark-text leading-tight line-clamp-2">
                  {job.title}
                </h4>
                <p className="text-third-gray font-medium text-sm md:text-base">
                  {job.company} • {job.location}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <p className="bg-greenTags/10 rounded-full text-greenTags px-2 md:px-3 py-1 text-xs md:text-sm font-semibold">
                    {job.workType}
                  </p>
                  {job.category.map((type) => (
                    <span
                      key={type}
                      className={`text-xs font-semibold ${
                        type.includes("Marketing")
                          ? "bg-ylwTags/10 border-2 border-ylwTags text-ylwTags"
                          : type.includes("Technology") ||
                              type.includes("Data Science") ||
                              type.includes("Research")
                            ? "bg-redTags/10 border-2 border-redTags text-redTags"
                            : type.includes("Business") ||
                                type.includes("Sales") ||
                                type.includes("Finance") ||
                                type.includes("Design")
                              ? "bg-indigoTags/10 border-2 border-indigoTags text-indigoTags"
                              : ""
                      } 
                        px-2 md:px-3 py-1 rounded-full`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;
