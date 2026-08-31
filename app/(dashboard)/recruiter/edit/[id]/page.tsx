"use client";

import { use } from "react";
import { useJobById } from "@/Hooks/useJobs";
import { IDynamicData } from "@/types/interfaces";
import Spinner from "@/shared/Spinner";
import UpdateSingleJobHome from "@/components/Dashboard/UpdateSingleJobHome";

const UpdateSingleJobPage = ({ params }: IDynamicData) => {
  const catchParams = use(params);
  const jobId = catchParams?.id;

  const { data: jobResponse, isLoading } = useJobById(jobId as string);
  const jobData = jobResponse?.data ?? jobResponse;

  if (isLoading) {
    return <Spinner />;
  }

  if (!jobData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium">Job listing not found.</p>
      </div>
    );
  }

  return (
    <UpdateSingleJobHome jobData={jobData} redirectTo={"/recruiter/jobs"} />
  );
};

export default UpdateSingleJobPage;
