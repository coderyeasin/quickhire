import { JobsType } from "./types";

export interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export interface CategoryCardType {
  id: number;
  title: string;
  jobs: string;
  image: string;
}

export type CategoryName =
  | "Marketing"
  | "Sales"
  | "Business"
  | "Finance"
  | "Technology"
  | "Design"
  | "Data Science"
  | "Research";

export interface JobCardType {
  id: number;
  title: string;
  company: string;
  location: string;
  category: CategoryName[];
  workType: "Full-time" | "Part-time" | "Contract" | "Remote";
  shortDescription: string;
  image: string;
}

//----------------- Real Types -----------------

export interface ITopHeaderUser {
  user: {
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    role?: string;
  };
}

export interface ICandidate {
  _id?: string;
  name: string;
  email: string;
}

export interface IRecruiter {
  _id?: string;
  name: string;
  company: string;
}

export interface ApplicationsType {
  _id: string;

  coverLetter: string;
  resumeUrl: string;
  status: string;
  appliedAt: string;

  candidateId: ICandidate | null;
  recruiterId: IRecruiter | null;
  jobId: JobsType | null;
}
