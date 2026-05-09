import JobDetailsPage from "@/components/Dashboard/Candidate/JobDetails";

interface IDynamic {
  params: Promise<{
    id: string;
  }>;
}

const SingleJobHome = async ({ params }: IDynamic) => {
  const { id: jobsId } = await params;

  return <JobDetailsPage jobId={jobsId} />;
};

export default SingleJobHome;
