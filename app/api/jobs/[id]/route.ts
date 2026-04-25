import { jobControllers } from "@/modules/job/job.controller";

export const GET = jobControllers.getSingleJobs;
export const PATCH = jobControllers.updateSingleJob;
export const DELETE = jobControllers.deleteJob;
