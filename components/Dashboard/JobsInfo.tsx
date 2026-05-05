import { useJobs } from "@/Hooks/useJobs";
import Spinner from "@/shared/Spinner";
import { JobsType } from "@/types/interfaces";
import Image from "next/image";
import { useMemo } from "react";
import { FiMapPin, FiBriefcase, FiClock, FiDollarSign } from "react-icons/fi";

export default function JobCard({
  jobId,
}: {
  jobId: string | null | undefined;
}) {
  const { data, isLoading } = useJobs();
  const jobs: JobsType[] = useMemo(() => data?.data ?? [], [data]);

  const job = jobs.find((j) => j._id === jobId);

  if (!job) {
    return null;
  }

  const parseArray = (arr: string[]) => {
    if (!arr?.length) return [];

    return arr.flatMap((item) =>
      item
        .replace(/"/g, "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    );
  };

  const skills = parseArray(job.skills);
  const categories = parseArray(job.category);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className=" rounded-2xl  overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="flex items-start gap-5">
            <Image
              src={job.companyLogo}
              alt={job.company}
              width={70}
              height={70}
              className="rounded-xl border object-cover"
            />

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-dark-text">
                {job.title}
              </h1>

              <p className="text-slate-600 mt-1">{job.company}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-third-gray">
                <span className="flex items-center gap-1.5">
                  <FiMapPin /> {job.location}
                </span>

                <span className="flex items-center gap-1.5">
                  <FiBriefcase /> {job.type}
                </span>

                {job.salary && (
                  <span className="flex items-center gap-1.5">
                    <FiDollarSign /> {job.salary}
                  </span>
                )}

                {job.deadline && (
                  <span className="flex items-center gap-1.5">
                    <FiClock />
                    Deadline:{" "}
                    {new Date(job.deadline).toLocaleDateString("en-BD")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 md:p-8 space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-dark-text mb-3">
              Job Description
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {job.description}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-dark-text mb-3">
              Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 bg-slate-100 text-dark-text text-sm rounded-full font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-dark-text mb-3">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-indigo-50 text-indigoTags text-sm rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-dark-text mb-3">
              Job Info
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-slate-500 text-sm">Posted On</p>
                <p className="font-medium text-dark-text mt-1">
                  {new Date(job.createdAt).toLocaleDateString("en-BD")}
                </p>
              </div>

              {job.deadline && (
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-slate-500 text-sm">Deadline</p>
                  <p className="font-medium text-dark-text mt-1">
                    {new Date(job.deadline).toLocaleDateString("en-BD")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <div className="p-6 md:px-8 border-t border-slate-100 flex justify-end">
          <CustomButton
            label=" Apply Now"
            className="px-6 py-3 bg-indigoTags text-white rounded-xl font-semibold hover:bg-indigoTags/90 transition"
          />
        </div> */}
      </div>
    </div>
  );
}
