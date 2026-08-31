"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { IJobFilters, IJobsFiltered } from "@/types/interfaces";

const JobsFiltered = ({ jobs, values, onChange, onReset }: IJobsFiltered) => {
  const { register, reset } = useForm<IJobFilters>({
    values,
  });

  const uniqueCategories = useMemo(() => {
    return Array.from(
      new Set(jobs.flatMap((job) => job.category || [])),
    ).sort();
  }, [jobs]);

  const uniqueTypes = useMemo(() => {
    return Array.from(
      new Set(jobs.map((job) => job.type).filter(Boolean)),
    ).sort();
  }, [jobs]);

  const handleFieldChange = (key: keyof IJobFilters, value: string) => {
    onChange({
      ...values,
      [key]: value,
    });
  };

  return (
    <div className="bg-white border border-third-gray/10 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row items-stretch lg:items-center gap-2 md:gap-3 lg:gap-4 w-full">
        <div className="flex-1 flex items-center gap-2 border border-third-gray/20 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 focus-within:border-indigoTags transition-colors duration-200 min-w-30">
          <input
            {...register("search")}
            type="text"
            value={values.search}
            onChange={(e) => handleFieldChange("search", e.target.value)}
            placeholder="Search by title..."
            className="w-full text-xs md:text-sm outline-none font-epilogue text-dark-text placeholder-third-gray/50 min-w-30"
          />
        </div>

        <div className="w-full sm:w-1/2 md:flex-1 lg:w-56 flex items-center gap-2 border border-third-gray/20 rounded-lg md:rounded-xl px-2 md:px-3 py-2 md:py-3 bg-white">
          <select
            {...register("category")}
            value={values.category}
            onChange={(e) => handleFieldChange("category", e.target.value)}
            className="w-full text-xs md:text-sm outline-none font-epilogue text-dark-text bg-transparent capitalize cursor-pointer"
          >
            <option value="">All Categories</option>

            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/3 md:flex-1 lg:w-48 flex items-center gap-2 border border-third-gray/20 rounded-lg md:rounded-xl px-2 md:px-3 py-2 md:py-3 bg-white">
          <select
            {...register("jobType")}
            value={values.jobType}
            onChange={(e) => handleFieldChange("jobType", e.target.value)}
            className="w-full text-xs md:text-sm outline-none font-epilogue text-dark-text bg-transparent capitalize cursor-pointer"
          >
            <option value="">All Job Types</option>

            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/3 md:flex-1 lg:w-48 flex items-center gap-2 border border-third-gray/20 rounded-lg md:rounded-xl px-2 md:px-3 py-2 md:py-3 bg-white">
          <input
            {...register("deadline")}
            type="date"
            value={values.deadline}
            onChange={(e) => handleFieldChange("deadline", e.target.value)}
            className="w-full text-xs md:text-sm outline-none font-epilogue text-dark-text cursor-pointer"
          />
        </div>

        <button
          onClick={() => {
            reset({
              search: "",
              category: "",
              jobType: "",
              deadline: "",
            });

            onReset();
          }}
          className="text-xs md:text-sm font-semibold text-redTags bg-redTags/5 cursor-pointer border border-redTags/10 rounded-lg md:rounded-xl px-2 md:px-4 py-2 md:py-3 hover:bg-redTags/10 transition-all active:scale-95 duration-200 whitespace-nowrap w-full sm:w-auto"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default JobsFiltered;
