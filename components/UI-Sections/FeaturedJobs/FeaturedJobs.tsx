"use client";

import { useJobs } from "@/Hooks/useJobs";
import Spinner from "@/shared/Spinner";
import { JobsType } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { IoArrowForwardSharp } from "react-icons/io5";

const FeaturedJobs = () => {
  const { data, isLoading } = useJobs();

  const featuredJobs = useMemo(
    () =>
      (data?.data ?? []).filter((job: JobsType) => job.status === "approved"),
    [data],
  );

  return isLoading ? (
    <Spinner />
  ) : (
    <section className="container-layout py-8 md:py-14">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-semibold font-clash leading-tight md:leading-[160%]">
          Featured <span className="text-blue-text"> jobs</span>
        </h2>

        <Link href={"/jobs"}>
          <div className="flex items-center gap-2 text-indigoTags cursor-pointer text-sm md:text-md">
            <h3 className="font-medium">Show all jobs</h3>
            <IoArrowForwardSharp className="text-lg" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-10">
        {featuredJobs.slice(8, 16).map((job: JobsType) => (
          <div
            key={job._id}
            className="flex flex-col items-start gap-4 px-4 md:px-5 py-5 space-y-3 border border-third-gray/20 cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            <div className="flex items-start justify-between w-full gap-3">
              <Image
                src={job.companyLogo}
                alt={job.title}
                className="object-contain w-12 md:w-16 h-auto shrink-0"
                width={64}
                height={64}
                priority
              />
              <p className="border-2 border-indigoTags text-indigoTags px-2 py-1 md:px-2 md:py-2 text-xs md:text-sm">
                {job.type}
              </p>
            </div>
            <div className="w-full">
              <h4 className="text-base md:text-lg font-semibold text-dark-text line-clamp-2">
                {job.title}
              </h4>
              <p className="text-third-gray text-sm md:text-base">
                {job.company} • {job.location}
              </p>
              <p className="text-third-gray py-2 md:py-3 text-sm truncate">
                {job.description}
              </p>
            </div>
            <div className="w-full">
              <div className="flex flex-wrap gap-2 pt-2">
                {job.category.map((type) => (
                  <p
                    key={type}
                    className={`text-xs font-semibold ${
                      type.includes("Marketing")
                        ? "bg-ylwTags/10 border-ylwTags text-ylwTags"
                        : type.includes("Technology") ||
                            type.includes("Data Science") ||
                            type.includes("Research")
                          ? "bg-redTags/10  border-redTags text-redTags"
                          : type.includes("Business") ||
                              type.includes("Sales") ||
                              type.includes("Finance")
                            ? "bg-indigoTags/10 border-indigoTags text-indigoTags"
                            : type.includes("Design")
                              ? "bg-greenTags/10 border-greenTags text-greenTags"
                              : ""
                    } 
                        px-2 md:px-3 py-1 md:py-2 rounded-full`}
                  >
                    {type}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedJobs;
