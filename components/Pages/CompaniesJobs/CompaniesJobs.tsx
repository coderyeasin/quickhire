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
    <section className="w-full  pb-16 ">
      <div className="relative mx-auto mb-12 w-full max-w-3xl">
        <input
          type="text"
          placeholder="Search company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl px-5 py-3.5 border-l-4 border-l-indigoTags outline-none focus:ring-2 focus:ring-indigoTags"
        />
      </div>

      {companyGroups.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-lg font-medium text-third-gray">
            No companies found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {companyGroups.slice(0, 9).map((group) => (
            <div
              key={group.name}
              className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-transparent hover:shadow-2xl"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                  {group.logo ? (
                    <Image
                      src={group.logo}
                      alt={group.name}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-indigoTags">
                      {group.name.charAt(0)}
                    </span>
                  )}
                </div>

                <span className="rounded-full px-3 py-1 text-xs font-bold text-indigoTags bg-indigoTags/10">
                  {group.count} Jobs
                </span>
              </div>

              <h3 className="mb-4 text-xl font-bold text-dark-text">
                {group.name}
              </h3>

              <div className="mb-8 grow space-y-3">
                {group.jobs.slice(0, 2).map((job) => (
                  <Link href={`/jobs/${job._id}`} key={job._id}>
                    <div className="relative border-l-2 border-gray-100 pl-4 py-1 transition-colors hover:border-indigo-500">
                      <h4 className="truncate text-sm font-semibold text-second-gray">
                        {job.title}
                      </h4>

                      <p className="text-xs text-third-gray">
                        {job.location} •
                        <span className="capitalize"> {job.type}</span>
                      </p>
                    </div>
                  </Link>
                ))}

                {group.count > 2 && (
                  <p className="text-xs font-medium italic text-blue-text">
                    + {group.count - 2} more roles
                  </p>
                )}
              </div>

              {/* <Link
                href={`/jobs?company=${encodeURIComponent(group.name)}`}
                className="mt-auto inline-flex items-center justify-center gap-3 bg-indigoTags rounded-lg px-4 py-3 text-sm font-bold text-white transition-all active:scale-95"
              >
                View Company Profile
                <FaArrowRight />
              </Link> */}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CompaniesJobs;
