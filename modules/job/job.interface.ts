import { Types } from "mongoose";

export type JobType = "full-time" | "part-time" | "remote" | "intern";
export type JobStatus = "pending" | "approved" | "rejected";

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
}
