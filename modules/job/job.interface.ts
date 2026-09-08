import { Types } from "mongoose";

export type JobType = "full-time" | "part-time" | "remote" | "intern";
export type JobStatus = "pending" | "approved" | "rejected" | "expired";
export interface IJobUpdateHistory {
  updatedBy: Types.ObjectId;
  role: "recruiter" | "admin";
  changedAt: Date;
  previousStatus: JobStatus;
  changedFields: string[];
}

export interface IJob {
  _id?: string;
  title: string;
  description: string;
  company: string;
  companyLogo: string;
  category: string[];
  location: string;
  type: JobType;
  salary?: string;
  skills: string[];
  recruiterId?: Types.ObjectId;
  status: JobStatus;
  deadline?: Date;
  updateHistory?: IJobUpdateHistory[];
}
