"use client";
import { FiCheckCircle } from "react-icons/fi";
import JobsInfo from "../JobsInfo";
import { IoArrowBackCircle } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const JobDetails = ({ jobId }: { jobId: string | null }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  return (
    <div className="mx-auto px-4 md:px-6">
      <div className="flex gap-6">
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <JobsInfo jobId={jobId} />
        </div>

        <div className="space-y-6 ">
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/${userRole}/jobs`);
              }}
              className="inline-flex items-center text-right gap-2 text-indigoTags cursor-pointer"
            >
              <IoArrowBackCircle size={22} />
              Back To Jobs
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Facilities & Perks
            </h2>

            <div className="space-y-3">
              {[
                "High-performance working environment",
                "Access to modern tools and technologies",
                "Team events and networking opportunities",
                "Professional development and training support",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 shrink-0" />

                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Why Join?</h2>

            <div className="space-y-3">
              {[
                "Remote friendly environment",
                "Career growth opportunities",
                "Flexible working hours",
                "Modern development workflow",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-1 shrink-0" />

                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
