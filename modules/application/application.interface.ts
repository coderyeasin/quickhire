import { Types } from "mongoose";

export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "hired";

export const STATUS_TRANSITION: Record<ApplicationStatus, ApplicationStatus[]> =
  {
    pending: ["reviewing", "rejected"],
    reviewing: ["shortlisted", "rejected"],
    shortlisted: ["hired", "rejected"],
    rejected: [],
    hired: [],
  };

export interface IApplication {
  _id?: string;
  jobId: Types.ObjectId;
  candidateId: Types.ObjectId;
  recruiterId: Types.ObjectId;
  coverLetter?: string;
  resumeUrl: string;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt?: Date;
}
