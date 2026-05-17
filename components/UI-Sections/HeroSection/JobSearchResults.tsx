"use client";

import { useMemo } from "react";
import Link from "next/link";
import { JobsType } from "@/types/types";
import { useApprovedJobs } from "@/Hooks/useJobs";
import Spinner from "@/shared/Spinner";
import { FaArrowRight } from "react-icons/fa6";

interface IJobSearchResults {
  searchTxt: string | null | undefined;
  locationTxt: string | null | undefined;
}

const JobSearchResults = ({ searchTxt, locationTxt }: IJobSearchResults) => {
  const { data, isLoading } = useApprovedJobs();

  const jobs: JobsType[] = useMemo(() => data?.data ?? [], [data]);

  const filteredJobs = useMemo(() => {
    const cleanSearch = searchTxt?.trim() || "";
    const cleanLocation = locationTxt?.trim() || "";

    if (!cleanSearch && !cleanLocation) return [];

    return jobs.filter((job) => {
      const matchesSearch = cleanSearch
        ? job.title.toLowerCase().includes(cleanSearch.toLowerCase()) ||
          job.company?.toLowerCase().includes(cleanSearch.toLowerCase())
        : true;

      const matchesLocation = cleanLocation
        ? job.location.toLowerCase().includes(cleanLocation.toLowerCase())
        : true;

      return matchesSearch && matchesLocation;
    });
  }, [jobs, searchTxt, locationTxt]);

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="p-6 space-y-6 bg-white rounded-2xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 font-epilogue tracking-tight">
          Search Results
        </h2>
        {(searchTxt?.trim() || locationTxt?.trim()) && (
          <p className="text-xs font-medium text-slate-400 mt-1.5 flex items-center gap-1.5 flex-wrap">
            {searchTxt?.trim() && (
              <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                Keyword:
                <span className="text-slate-700">{searchTxt.trim()}</span>
              </span>
            )}
            {searchTxt?.trim() && locationTxt?.trim() && (
              <span className="text-slate-300">•</span>
            )}
            {locationTxt?.trim() && (
              <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                Location:{" "}
                <span className="text-slate-700">{locationTxt.trim()}</span>
              </span>
            )}
          </p>
        )}
      </div>

      {filteredJobs.length > 0 ? (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="group border border-slate-100 bg-slate-50/30 rounded-xl p-4 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-300 ease-out"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-base text-slate-800 group-hover:text-indigoTags transition-colors duration-200">
                    {job.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-epilogue mt-1">
                    {job.company} • {job.location}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <Link
                  href={`/jobs/${job._id}`}
                  className="text-xs font-semibold text-indigoTags hover:text-indigoTags/80 inline-flex items-center gap-1 transition-colors duration-200"
                >
                  View Details
                  <FaArrowRight className="shrink-0 text-md" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <h3 className="text-base font-semibold text-slate-700">
            No jobs found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-60 mx-auto">
            We could not find matches. Try adjusting your keyword or location
            criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobSearchResults;
