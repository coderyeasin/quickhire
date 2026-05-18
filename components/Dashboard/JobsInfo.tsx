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
    (role === "admin" && job.status === "approved") || role === "candidate";

  const alreadyApplied = appData?.some(
    (item) =>
      String(item?.candidateId?._id || item?.candidateId) ===
        String(session?.user?.id) &&
      String(item?.jobId?._id || item?.jobId) === String(job?._id),
  );

  const skills = parseArray(job.skills);
  const categories = parseArray(job.category);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={role ? "max-w-5xl" : "contain-layout"}>
      {!isApply ? (
        <div className="rounded-2xl overflow-hidden mx-auto">
          <div className="p-6 md:p-8 border-b border-slate-100">
            <div className="flex items-center gap-5">
              <Image
                src={job?.companyLogo ? job?.companyLogo : "I"}
                alt={job?.company}
                width={70}
                height={70}
                className="rounded-xl border object-cover"
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-indigo-50 text-indigoTags rounded-full text-xs font-semibold capitalize">
                    {job.type}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-dark-text">
                  {job.title}
                </h1>

                <p className="text-slate-600 mt-1">{job.company}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-third-gray">
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
          <div className="p-6 md:p-8 space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-dark-text mb-3">
                Job Description
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {job?.description?.slice(0, 200)}...
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
          <div className="p-6 md:px-8 border-t border-slate-100 flex justify-end">
            <CustomButton
              disabled={alreadyApplied}
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
              label={alreadyApplied ? "Already Applied" : "Apply Now"}
              className="px-6 py-3 bg-indigoTags text-white rounded-xl font-semibold hover:bg-indigoTags/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      ) : (
        <div className="p-6 md:p-8 bg-white rounded-xl mx-auto shadow-sm">
          <ApplyForm jobId={job._id} />
        </div>
      )}
    </div>
  );
};
export default JobsInfo;
