"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useApprovedJobs } from "@/Hooks/useJobs";
import JobsFiltered from "@/shared/JobsFiltered";
import Spinner from "@/shared/Spinner";
import { JobsType } from "@/types/types";
import { IJobFilters } from "@/types/interfaces";

const AvailableJobsPage = () => {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const { data, isLoading } = useApprovedJobs();
  const [filters, setFilters] = useState<IJobFilters>({
    search: "",
    category: "",
    jobType: "",
    deadline: "",
  });

  const originalJobs: JobsType[] = useMemo(() => data?.data ?? [], [data]);

  const filteredJobs = useMemo(() => {
    return originalJobs.filter((job) => {
      const matchesSearch =
        !filters.search.trim() ||
        job.title.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory =
        !filters.category || job.category?.includes(filters.category);

      const matchesType =
        !filters.jobType ||
        job.type.toLowerCase() === filters.jobType.toLowerCase();

      let matchesDeadline = true;

      if (filters.deadline) {
        const selectedDate = new Date(filters.deadline).getTime();

        const jobDeadline = new Date(job.deadline).getTime();

        matchesDeadline = jobDeadline <= selectedDate;
      }

      return matchesSearch && matchesCategory && matchesType && matchesDeadline;
    });
  }, [originalJobs, filters]);

  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "",
      jobType: "",
      deadline: "",
    });
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <section>
      <JobsFiltered
        jobs={originalJobs}
        values={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mt-6 md:mt-8 lg:mt-10">
          {filteredJobs.map((job: JobsType) => (
            <Link
              href={
                userRole && userRole !== "recruiter"
                  ? `/${userRole}/jobs/${job._id}`
                  : userRole === "recruiter"
                    ? `/jobs/${job._id}`
                    : `/jobs/${job._id}`
              }
              key={job._id}
            >
              <div className="flex flex-col items-start gap-3 md:gap-4 px-3 md:px-4 lg:px-5 py-4 md:py-5 space-y-2 md:space-y-3 border border-third-gray/20 cursor-pointer transition-transform duration-300 hover:scale-105 rounded-lg md:rounded-xl">
                <div className="flex items-start justify-between w-full gap-3">
                  <Image
                    src={job.companyLogo}
                    alt={job.title}
                    className="object-contain w-10 md:w-12 lg:w-16 h-auto shrink-0"
                    width={64}
                    height={64}
                    priority
                  />

                  <p className="border-2 border-indigoTags text-indigoTags capitalize px-1.5 md:px-2 py-0.5 md:py-1 lg:py-2 text-xs md:text-sm font-semibold">
                    {job.type}
                  </p>
                </div>

                <div className="w-full">
                  <h4 className="text-sm md:text-base lg:text-lg font-semibold text-dark-text line-clamp-2">
                    {job.title}
                  </h4>

                  <p className="text-third-gray text-xs md:text-sm lg:text-base truncate">
                    {job.company} • {job.location}
                  </p>

                  <p className="text-third-gray py-1.5 md:py-2 lg:py-3 text-xs md:text-sm truncate">
                    {job.description}
                  </p>
                </div>

                <div className="w-full">
                  <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1 md:pt-2">
                    {job.category.map((type) => (
                      <p
                        key={type}
                        className={`text-xs font-semibold ${
                          type.includes("Marketing")
                            ? "bg-ylwTags/10 border-ylwTags text-ylwTags"
                            : type.includes("Technology") ||
                                type.includes("Data Science") ||
                                type.includes("Research")
                              ? "bg-redTags/10 border-redTags text-redTags"
                              : type.includes("Business") ||
                                  type.includes("Sales") ||
                                  type.includes("Finance")
                                ? "bg-indigoTags/10 border-indigoTags text-indigoTags"
                                : type.includes("Design")
                                  ? "bg-greenTags/10 border-greenTags text-greenTags"
                                  : "bg-greenTags/10 border-greenTags text-greenTags"
                        } px-1.5 md:px-2 lg:px-3 py-0.5 md:py-1 lg:py-2 rounded-full`}
                      >
                        {type}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-12 md:py-16 text-center border border-dashed border-third-gray/15 rounded-lg md:rounded-2xl bg-white max-w-sm mx-auto px-4">
          <h3 className="text-base md:text-lg font-bold text-dark-text font-epilogue">
            No entries match
          </h3>
          <p className="text-xs md:text-sm text-third-gray mt-2 px-2">
            Try adjusting your search filters.
          </p>
        </div>
      )}
    </section>
  );
};

export default AvailableJobsPage;
