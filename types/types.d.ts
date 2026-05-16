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
  deadline?: string;
  createdAt: string;
};
