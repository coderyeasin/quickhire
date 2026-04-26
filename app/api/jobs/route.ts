import { jobControllers } from "@/modules/job/job.controller";

export const GET = jobControllers.getAllJobs;
export const POST = jobControllers.createJob;
