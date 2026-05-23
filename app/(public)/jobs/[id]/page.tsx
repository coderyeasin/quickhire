import JobDetailsPage from "@/components/Dashboard/Candidate/JobDetails";
import { IDynamicData } from "@/types/interfaces";
import { use } from "react";

const SingleJobHome = ({ params }: IDynamicData) => {
  const catchParams = use(params);
  const jobsId = catchParams?.id;

  return <JobDetailsPage jobId={jobsId} />;
};

export default SingleJobHome;
