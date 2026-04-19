import latestJobCardsData from "@/utils/latestJobCard";
import Image from "next/image";
import React from "react";
import { IoArrowForwardSharp } from "react-icons/io5";

const LatestJobs = () => {
  return (
    <section className="bg-[#F8F8FD] bg-[url(/images/hero/Pattern.png)] bg-no-repeat bg-contain bg-right lg:[clip-path:polygon(10%_0%,80%_0%,100%_0%,100%_80%,100%_100%,0%_100%,0%_80%,0%_20%)]">
      <div className="container-layout py-14 ">
        <div className="flex justify-between items-center">
          <h2 className="text-dark-text text-[48px] font-semibold font-clash leading-[160%]">
            Latest <span className="text-blue-text"> jobs open</span>
          </h2>
          <div className="flex items-end gap-3 text-indigoTags cursor-pointer">
            <h3 className=" text-md font-medium">Show all jobs</h3>
            <IoArrowForwardSharp className="text-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mx-auto">
          {latestJobCardsData.map((job) => (
            <div
              key={job.id}
              className="flex items-start gap-6 bg-white p-6 border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="shrink-0">
                <Image
                  src={job.image}
                  alt={job.title}
                  className="object-contain"
                  width={64}
                  height={84}
                  priority
                />
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-xl font-bold text-dark-text leading-tight">
                  {job.title}
                </h4>
                <p className="text-third-gray font-medium">
                  {job.company} • {job.location}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <p className="bg-greenTags/10 rounded-full text-greenTags px-3 py-1 text-sm">
                    {job.workType}
                  </p>
                  {job.category.map((type) => (
                    <span
                      key={type}
                      className={` text-xs font-semibold ${
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
                        px-3 py-1 rounded-full`}
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
