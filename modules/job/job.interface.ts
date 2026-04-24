export type JobType = "full-time" | "part-time" | "remote" | "intern";
export type JobStatus = "pending" | "approved" | "rejected";

interface IJob {
  _id?: string;
  title: string;
  description: string;
  company: string;
  companyLogo: string;
  location: string;
  type: JobType;
  salary?: string;
  skills: string[];
  recruiterId: string;
  status: JobStatus;
  deadline?: Date;
}
