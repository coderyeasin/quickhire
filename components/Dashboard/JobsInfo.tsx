"use client";
import { useMyApplications } from "@/Hooks/useApplications";
import { useJobById } from "@/Hooks/useJobs";
import ApplyForm from "@/shared/ApplyForm";
import CustomButton from "@/shared/CustomButton";
import Spinner from "@/shared/Spinner";
import { ApplicationsType } from "@/types/interfaces";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiMapPin, FiClock, FiDollarSign } from "react-icons/fi";

const JobsInfo = ({ jobId }: { jobId: string | null | undefined }) => {
  const [isApply, setIsApply] = useState(false);
  const [currentTime] = useState(() => Date.now());
  const { data: session } = useSession();
  const role = session?.user.role;
  const { data, isLoading } = useJobById(jobId as string);

  const { data: applicantsData } = useMyApplications({
    enabled: !!session?.user && session.user.role === "candidate",
  });

  const appData: ApplicationsType[] = useMemo(
    () => applicantsData?.data ?? [],
    [applicantsData],
  );

  const job = useMemo(() => data?.data ?? [], [data]);

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
  const canApply =
    (role === "admin" && job.status === "approved") ||
    (role === "candidate" &&
      job.status === "approved" &&
      (!job.deadline || new Date(job.deadline).getTime() > currentTime));
  const isExpired =
    job.status === "expired" ||
    (!!job.deadline && new Date(job.deadline).getTime() <= currentTime);

  const alreadyApplied = appData?.some((item) => {
    const isSameCandidate =
      String(item?.candidateId?._id || item?.candidateId) ===
      String(session?.user?.id);
    const isSameJob =
      String(item?.jobId?._id || item?.jobId) === String(job?._id);

    return isSameCandidate && isSameJob && !item.isExpired;
  });

  const skills = parseArray(job.skills);
  const categories = parseArray(job.category);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div
      className={`${role ? "max-w-5xl" : "contain-layout"} mx-auto w-full px-4 sm:px-6`}
    >
      {!isApply ? (
        <div className="rounded-2xl overflow-hidden mx-auto">
          <div className="p-4 md:p-8 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <Image
                src={job?.companyLogo ? job?.companyLogo : "I"}
                alt={job?.company}
                width={70}
                height={70}
                className="rounded-xl border object-cover w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-indigo-50 text-indigoTags rounded-full text-xs font-semibold capitalize">
                    {job.type}
                  </span>
                  {isExpired && (
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold">
                      Expired
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark-text">
                  {job.title}
                </h1>

                <p className="text-slate-600 mt-1">{job.company}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-sm text-third-gray">
                  <span className="flex items-center gap-1.5">
                    <FiMapPin /> {job.location}
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
          <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            <div>
              <h2 className="text-base md:text-lg font-semibold text-dark-text mb-3">
                Job Description
              </h2>
              {!role ? (
                <div className="space-y-3 text-slate-600 leading-relaxed text-sm md:text-base">
                  {job?.description
                    ?.split("\n")
                    .map((line: string, index: number) => {
                      const trimmed = line.trim();
                      if (!trimmed) return null;

                      // Check if the line is a bullet point from the textarea
                      if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
                        return (
                          <div
                            key={index}
                            className="flex items-start gap-2 pl-4"
                          >
                            <span className="text-blue-500 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                            <span>{trimmed.replace(/^[*-\s]+/, "")}</span>
                          </div>
                        );
                      }

                      if (
                        trimmed.toLowerCase().includes("responsibilities") ||
                        trimmed.toLowerCase().includes("requirements")
                      ) {
                        return (
                          <h4
                            key={index}
                            className="pt-4 font-semibold text-slate-800 text-base md:text-lg"
                          >
                            {trimmed}
                          </h4>
                        );
                      }

                      return <p key={index}>{trimmed}</p>;
                    })}
                </div>
              ) : (
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {job?.description?.slice(0, 200)}...
                </p>
              )}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="p-4 md:px-8 border-t border-slate-100 flex justify-center sm:justify-end">
            <CustomButton
              disabled={alreadyApplied || isExpired}
              onClick={() => {
                if (alreadyApplied) {
                  toast.error("You already applied for this job");
                  return;
                }

                if (canApply) {
                  setIsApply(true);
                  return;
                }

                if (!role) {
                  toast.error("You need to login or register first");
                  return;
                }

                if (role === "admin") {
                  toast.error("You need to change job status");
                  return;
                }

                if (role === "recruiter") {
                  toast.error("Can not apply as a recruiter");
                  return;
                }
              }}
              label={
                isExpired
                  ? "Deadline Expired"
                  : alreadyApplied
                    ? "Already Applied"
                    : "Apply Now"
              }
              className="w-full sm:w-auto px-6 py-3 bg-indigoTags text-white rounded-xl font-semibold hover:bg-indigoTags/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      ) : (
        <div className="p-4 md:p-8 bg-white rounded-lg md:rounded-xl mx-auto shadow-sm w-full max-w-3xl">
          <ApplyForm jobId={job._id} />
        </div>
      )}
    </div>
  );
};
export default JobsInfo;
