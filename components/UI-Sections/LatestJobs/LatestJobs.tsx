"use client";
import { useApprovedJobs } from "@/Hooks/useJobs";
import FeatureHeader from "@/shared/FeatureHeader";
import Spinner from "@/shared/Spinner";
import { JobsType } from "@/types/types";
import Image from "next/image";
import { useMemo } from "react";

const LatestJobs = () => {
  const { data, isLoading } = useApprovedJobs();
  const latestJobs: JobsType[] = useMemo(() => data?.data ?? [], [data]);

  return isLoading ? (
    <Spinner />
  ) : (
    <section className="bg-[#F8F8FD] bg-[url(/images/hero/Pattern.png)] bg-no-repeat bg-contain bg-right lg:[clip-path:polygon(10%_0%,80%_0%,100%_0%,100%_80%,100%_100%,0%_100%,0%_80%,0%_20%)]">
      <div className="container-layout py-8 md:py-10 lg:py-14 flex flex-col md:grid md:grid-cols-1 items-center gap-y-6 md:gap-y-0">
        <FeatureHeader
          title={"Latest"}
          subTitle={"jobs open"}
          linksTitle={"Show all jobs"}
        />

        <div className="order-2 md:order-0 col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6 w-full mx-auto">
          {latestJobs.slice(0, 8).map((job: JobsType) => (
            <div
              key={job._id}
              className="flex flex-col sm:flex-row items-start gap-3 md:gap-4 lg:gap-6 bg-white p-3 md:p-4 lg:p-6 border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-lg md:rounded-xl"
            >
              <div className="shrink-0">
                <Image
                  src={job.companyLogo}
                  alt={job.company}
                  className="object-contain w-12 md:w-16 h-auto"
                  width={64}
                  height={84}
                  priority
                />
              </div>

              <div className="flex flex-col gap-1.5 md:gap-2 w-full">
                <h4 className="text-base md:text-lg lg:text-xl font-bold text-dark-text leading-tight line-clamp-2">
                  {job.title}
                </h4>
                <p className="text-third-gray font-medium text-xs md:text-sm truncate">
                  {job.company} • {job.location}
                </p>

                <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1 md:pt-2">
                  <p className="bg-greenTags/10 rounded-full capitalize text-greenTags px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm">
                    {job.type}
                  </p>
                  {job.category.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className={`text-xs font-semibold ${
                        cat.includes("Marketing")
                          ? "bg-ylwTags/10 border-2 border-ylwTags text-ylwTags"
                          : cat.includes("Technology") ||
                              cat.includes("Data Science") ||
                              cat.includes("Research")
                            ? "bg-redTags/10 border-2 border-redTags text-redTags"
                            : cat.includes("Business") ||
                                cat.includes("Sales") ||
                                cat.includes("Finance") ||
                                cat.includes("Design")
                              ? "bg-indigoTags/10 border-2 border-indigoTags text-indigoTags"
                              : "bg-third-gray/10 text-primary-gray/70"
                      } 
                        px-1.5 md:px-2 lg:px-3 py-0.5 md:py-1 rounded-full`}
                    >
                      {cat}
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
