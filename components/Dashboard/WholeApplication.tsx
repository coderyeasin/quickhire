"use client";

import { useMemo } from "react";
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
} from "react-icons/fi";
import { ApplicationsType } from "@/types/interfaces";
import { useApplications } from "@/Hooks/useApplications";
import Spinner from "@/shared/Spinner";

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
  const { data, isLoading } = useApplications();
  const applications: ApplicationsType[] = useMemo(
    () => data?.data ?? [],
    [data],
  );

  const applicants = applications.find((j) => j._id === applicantsId);

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Application Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Review candidate application information
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium w-fit ${
              statusStyles[
                (applicants?.status || "default") as keyof typeof statusStyles
              ]
            }`}
          >
            {
              statusIcons[
                (applicants?.status || "default") as keyof typeof statusIcons
              ]
            }
            <span className="capitalize">{applicants?.status as string}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiBriefcase className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Job Information
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {applicants?.jobId?.title}
                  </h4>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="text-gray-700">{applicants?.jobId?.company}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Job ID</p>
                  <p className="text-gray-700 break-all">
                    {applicants?.jobId?._id}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiFileText className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Cover Letter
                </h3>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 leading-7 whitespace-pre-line">
                  {applicants?.coverLetter}
                </p>
              </div>
            </div>

            <div className="border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiExternalLink className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Resume / CV
                </h3>
              </div>

              <Link
                href={applicants?.resumeUrl as string}
                target="_blank"
                className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:opacity-90 transition"
              >
                Open Resume
                <FiExternalLink />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiUser className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Candidate
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">
                    {applicants?.candidateId?.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FiMail className="size-4" />
                    Email
                  </p>

                  <p className="text-gray-700 break-all">
                    {applicants?.candidateId?.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Candidate ID</p>

                  <p className="text-gray-700 break-all">
                    {applicants?.candidateId?._id}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiUser className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Recruiter
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>

                  <p className="font-medium text-gray-800">
                    {applicants?.recruiterId?.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FiMail className="size-4" />
                    Email
                  </p>

                  <p className="text-gray-700 break-all">
                    {applicants?.recruiterId?.company}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Recruiter ID</p>

                  <p className="text-gray-700 break-all">
                    {applicants?.recruiterId?._id}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiCalendar className="text-gray-500" />

                <h3 className="text-lg font-semibold text-gray-900">
                  Timeline
                </h3>
              </div>

              <div>
                <p className="text-sm text-gray-500">Applied At</p>

                <p className="text-gray-700 font-medium">
                  {new Date(applicants?.appliedAt as string).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WholeApplication;
