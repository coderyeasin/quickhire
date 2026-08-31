import { ILogin, IRegister } from "./interfaces";

export type UserRegister = IRegister | ILogin;

export type ModalMode = "login" | "register" | "jobs" | "applicants" | "search";

interface ModalType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  setMode: (mode: ModalMode) => void;
  jobId?: string | null;
  applicantsId?: string | null;
  searchTxt?: string | null;
  locationTxt?: string | null;
}

export type JobsType = {
  _id: string;
  title: string;
  description: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  skills: string[];
  category: string[];
  salary?: string;
  status: string;
  deadline: string;
  createdAt: string;
};

export interface UpdateJobForm {
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "remote" | "intern";
  description: string;
  salary: string;
  deadline: string;
  skills: string;
  category: string;
}
