"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FiBriefcase,
  FiUser,
  FiMail,
  FiCalendar,
  FiFileText,
  FiExternalLink,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiEye,
  FiStar,
  FiMapPin,
  FiDollarSign,
} from "react-icons/fi";

import { ApplicationsType } from "@/types/interfaces";
import { useApplications } from "@/Hooks/useApplications";
import Spinner from "@/shared/Spinner";
import { useSession } from "next-auth/react";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  reviewing: "bg-blue-50 text-blue-600 border-blue-200",
  shortlisted: "border bg-indigo-50 text-indigoTags border-indigo-200",
};

const statusIcons = {
  pending: <FiClock className="size-4" />,
  approved: <FiCheckCircle className="size-4" />,
  rejected: <FiXCircle className="size-4" />,
  reviewing: <FiEye className="size-4" />,
  shortlisted: <FiStar className="size-4" />,
};

const WholeApplication = ({
  applicantsId,
}: {
  applicantsId: string | null | undefined;
}) => {
  const { data: session } = useSession();
  const [currentTime] = useState(() => Date.now());

  const recruiterEmail = session?.user?.email;
  const userRole = session?.user?.role;

  const { data, isLoading } = useApplications();

  const applications: ApplicationsType[] = useMemo(
    () => data?.data ?? [],
    [data],
  );

  const applicants = applications.find((j) => j._id === applicantsId);
  const isExpired =
    applicants?.jobId?.status === "expired" ||
    (!!applicants?.jobId?.deadline &&
      new Date(applicants.jobId.deadline).getTime() <= currentTime);

  const shortDescription =
    userRole !== "candidate"
      ? applicants?.jobId?.description?.split(" ").slice(0, 180).join(" ") +
        "..."
      : applicants?.jobId?.description?.split(" ").slice(0, 30).join(" ") +
        "...";

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-5">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Application Details
            </h2>

            <p className="text-sm text-third-gray mt-1">
              {userRole !== "candidate"
                ? "Review candidate application information"
                : "Quick overview of your applied job"}
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium w-fit ${
              statusStyles[
                (applicants?.status || "pending") as keyof typeof statusStyles
              ]
            }`}
          >
            {
              statusIcons[
                (applicants?.status || "pending") as keyof typeof statusIcons
              ]
            }

            <span className="capitalize">{applicants?.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 p-4 md:p-5">
          <div className="xl:col-span-3 space-y-4">
            <div className="border border-gray-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiBriefcase className="text-third-gray" />

                <h3 className="text-base md:text-lg font-semibold text-gray-900">
                  Job Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <p className="text-xs text-third-gray mb-1">Position</p>

                  <h4 className="text-base font-semibold text-gray-800">
                    {applicants?.jobId?.title}
                  </h4>
                </div>

                <div>
                  <p className="text-xs text-third-gray mb-1">Company</p>

                  <p className="text-sm text-dark-text">
                    {applicants?.jobId?.company}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-third-gray mb-1">Job ID</p>

                  {isExpired && userRole === "candidate" ? (
                    <span className="text-sm text-primary-gray break-all">
                      {applicants?.jobId?._id}
                    </span>
                  ) : (
                    <Link
                      href={`/${userRole}/jobs/${applicants?.jobId?._id}`}
                      className="text-sm text-indigo-600 hover:underline break-all"
                    >
                      {applicants?.jobId?._id}
                    </Link>
                  )}
                </div>
              </div>

              {userRole === "candidate" && (
                <div className="flex flex-wrap gap-4 mt-6 text-sm text-third-gray">
                  <span className="flex items-center gap-1.5">
                    <FiMapPin />
                    {applicants?.jobId?.location}
                  </span>

                  {applicants?.jobId?.salary && (
                    <span className="flex items-center gap-1.5">
                      <FiDollarSign />
                      {applicants?.jobId?.salary}
                    </span>
                  )}
                </div>
              )}
              {applicants?.jobId?.deadline && (
                <span className="flex items-center gap-1.5 text-sm text-third-gray mt-1">
                  <FiClock />
                  Deadline:{" "}
                  {new Date(applicants.jobId.deadline).toLocaleDateString(
                    "en-BD",
                  )}
                </span>
              )}
            </div>

            <div className="border border-gray-100 rounded-xl p-4">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {applicants?.jobId?.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-indigo-50 text-indigoTags text-xs rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {userRole !== "candidate" ? (
              <>
                <div className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FiFileText className="text-third-gray" />

                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                      Cover Letter
                    </h3>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-dark-text leading-7 whitespace-pre-line">
                      {applicants?.coverLetter?.slice(0, 100)}
                    </p>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FiExternalLink className="text-third-gray" />

                    <h3 className="text-base md:text-lg font-semibold text-dark-text">
                      Resume / CV
                    </h3>
                  </div>

                  {applicants?.resumeUrl && (
                    <Link
                      href={applicants.resumeUrl}
                      target="_blank"
                      className="inline-flex items-center gap-2 bg-dark-text text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition text-sm"
                    >
                      Open Resume
                      <FiExternalLink />
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <div className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FiFileText className="text-third-gray" />

                  <h3 className="text-base md:text-lg font-semibold text-gray-900">
                    Job Description
                  </h3>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-dark-text leading-7">
                    {shortDescription}
                  </p>

                  <Link
                    href={`/${userRole}/jobs/${applicants?.jobId?._id}`}
                    className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-indigo-600 hover:underline"
                  >
                    View Full Job Details
                    <FiExternalLink className="size-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {userRole !== "candidate" ? (
              <div className="border border-gray-100 rounded-xl p-4 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FiUser className="text-third-gray" />

                    <h3 className="text-base font-semibold text-gray-900">
                      Candidate
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-third-gray mb-1">Name</p>

                      <p className="text-sm font-medium text-gray-800">
                        {applicants?.candidateId?.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-third-gray flex items-center gap-1 mb-1">
                        <FiMail className="size-3.5" />
                        Email
                      </p>

                      <p className="text-sm text-dark-text break-all">
                        {applicants?.candidateId?.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-third-gray mb-1">
                        Candidate ID
                      </p>

                      <p className="text-sm text-dark-text break-all">
                        {applicants?.candidateId?._id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FiUser className="text-third-gray" />

                    <h3 className="text-base font-semibold text-gray-900">
                      Recruiter
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-third-gray mb-1">Name</p>

                      <p className="text-sm font-medium text-gray-800">
                        {applicants?.recruiterId?.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-third-gray flex items-center gap-1 mb-1">
                        <FiMail className="size-3.5" />
                        Recruiter Email
                      </p>

                      <p className="text-sm text-dark-text break-all">
                        {recruiterEmail || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-third-gray mb-1">
                        Recruiter ID
                      </p>

                      <p className="text-sm text-dark-text break-all">
                        {applicants?.recruiterId?._id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FiCalendar className="text-third-gray" />

                    <h3 className="text-base font-semibold text-gray-900">
                      Application Timeline
                    </h3>
                  </div>

                  <div>
                    <p className="text-xs text-third-gray mb-1">Applied At</p>

                    <p className="text-sm text-dark-text font-medium">
                      {applicants?.appliedAt
                        ? new Date(applicants.appliedAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Quick Overview
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-third-gray mb-1">
                        Employment Type
                      </p>

                      <p className="text-sm text-dark-text capitalize">
                        {applicants?.jobId?.type || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-third-gray mb-1">Categories</p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {applicants?.jobId?.category?.map((cat) => (
                          <span
                            key={cat}
                            className="px-2.5 py-1 bg-indigo-50 text-indigoTags text-xs rounded-full font-medium"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {userRole !== "candidate" && (
              <div className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FiCalendar className="text-third-gray" />

                  <h3 className="text-base font-semibold text-gray-900">
                    Timeline
                  </h3>
                </div>

                <div>
                  <p className="text-xs text-third-gray mb-1">Applied At</p>

                  <p className="text-sm text-dark-text font-medium">
                    {applicants?.appliedAt
                      ? new Date(applicants.appliedAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WholeApplication;
