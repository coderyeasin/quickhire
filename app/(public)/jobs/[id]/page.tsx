import JobDetailsPage from "@/components/Dashboard/Candidate/JobDetails";
import { IDynamicData } from "@/types/interfaces";

const SingleJobHome = async ({ params }: IDynamicData) => {
  const { id: jobsId } = await params;

  return <JobDetailsPage jobId={jobsId} />;
};

export default SingleJobHome;
