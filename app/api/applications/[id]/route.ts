import { applicationControllers } from "@/modules/application/application.controller";

export const GET = applicationControllers.getSingleApplicantById;
export const DELETE = applicationControllers.withdrawAppliedJob;
