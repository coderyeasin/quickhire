import { applicationControllers } from "@/modules/application/application.controller";

export const GET = applicationControllers.getApplicantsForJob;
export const DELETE = applicationControllers.withdrawAppliedJob;
