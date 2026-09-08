"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useJobs } from "@/Hooks/useJobs";
import { JobsType } from "@/types/types";
import Spinner from "@/shared/Spinner";

const CompaniesJobs = () => {
  const { data, isLoading } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");

  const companyGroups = useMemo(() => {
    const rawJobs: JobsType[] = data?.data ?? [];

    const filtered = rawJobs.filter(
      (job) => job.status === "approved" && job.company,
    );

    const grouped: Record<string, JobsType[]> = filtered.reduce(
      (acc, job) => {
        const companyName = job.company || "Unknown Company";

        if (!acc[companyName]) {
          acc[companyName] = [];
        }

        acc[companyName].push(job);

        return acc;
      },
      {} as Record<string, JobsType[]>,
    );

    return Object.entries(grouped)
      .map(([name, jobs]: [string, JobsType[]]) => ({
        name,
        jobs,
        count: jobs.length,
        logo: jobs[0]?.companyLogo || null,
      }))
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => b.count - a.count);
  }, [data, searchTerm]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className="w-full pb-8 md:pb-12 lg:pb-16 ">
      <div className="relative mx-auto mb-8 md:mb-10 lg:mb-12 w-full max-w-3xl">
        <input
          type="text"
          placeholder="Search company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg md:rounded-xl px-3 md:px-5 py-2.5 md:py-3.5 border-l-4 border-l-indigoTags text-sm md:text-base outline-none focus:ring-2 focus:ring-indigoTags"
        />
      </div>

      {companyGroups.length === 0 ? (
        <div className="flex items-center justify-center py-16 md:py-20">
          <p className="text-base md:text-lg font-medium text-third-gray text-center px-4">
            No companies found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {companyGroups.slice(0, 9).map((group) => (
            <div
              key={group.name}
              className="group relative flex flex-col rounded-lg md:rounded-2xl border border-gray-100 bg-white p-4 md:p-6 transition-all duration-300 hover:border-transparent hover:shadow-2xl"
            >
              <div className="mb-4 md:mb-6 flex items-start justify-between gap-3">
                <div className="flex h-12 md:h-16 w-12 md:w-16 items-center justify-center overflow-hidden rounded-lg md:rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0">
                  {group.logo ? (
                    <Image
                      src={group.logo}
                      alt={group.name}
                      width={64}
                      height={64}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <span className="text-xl md:text-2xl font-bold text-indigoTags">
                      {group.name.charAt(0)}
                    </span>
                  )}
                </div>

                <span className="rounded-full px-2 md:px-3 py-1 text-xs md:text-sm font-bold text-indigoTags bg-indigoTags/10 whitespace-nowrap">
                  {group.count} Jobs
                </span>
              </div>

              <h3 className="mb-3 md:mb-4 text-base md:text-xl font-bold text-dark-text line-clamp-2">
                {group.name}
              </h3>

              <div className="mb-6 md:mb-8 grow space-y-2 md:space-y-3">
                {group.jobs.slice(0, 2).map((job) => (
                  <Link href={`/jobs/${job._id}`} key={job._id}>
                    <div className="relative border-l-2 border-gray-100 pl-3 md:pl-4 py-1 transition-colors hover:border-indigo-500">
                      <h4 className="truncate text-xs md:text-sm font-semibold text-second-gray">
                        {job.title}
                      </h4>

                      <p className="text-xs text-third-gray line-clamp-1">
                        {job.location} •
                        <span className="capitalize"> {job.type}</span>
                      </p>
                    </div>
                  </Link>
                ))}

                {group.count > 2 && (
                  <p className="text-xs font-medium italic text-blue-text pt-1">
                    + {group.count - 2} more roles
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CompaniesJobs;
