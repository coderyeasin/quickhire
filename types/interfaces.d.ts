/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldErrors, UseFormRegister, RegisterOptions } from "react-hook-form";
import { JobsType } from "./types";
import { LoginInput, RegisterInput } from "@/modules/user/UserValidators";
import { Table as TanTable } from "@tanstack/react-table";

export interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

interface IFormFields {
  register: UseFormRegister<any>;
  errors: FieldErrors<RegisterInput | LoginInput>;
  isPending: boolean;
  errorMessage?: string;
  submitLabel?: string;
  pendingLabel?: string;
}

export interface IRegister extends IFormFields {
  variant: "register";
  role: "candidate" | "recruiter";
  onBack: () => void;
}

export interface ILogin extends IFormFields {
  variant: "login";
}

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
  isExpired?: boolean;

  candidateId: ICandidate | null;
  recruiterId: IRecruiter | null;
  jobId: JobsType | null;
}

export interface IDynamicData {
  params: Promise<{
    id: string;
  }>;
}

export interface IJobFilters {
  search: string;
  category: string;
  jobType: string;
  deadline: string;
}

interface ITableType<T> {
  table: TanTable<T>;
  isLoading?: boolean;
  emptyMessage?: string;
}

export interface IJobsFiltered {
  jobs: JobsType[];
  values: IJobFilters;
  onChange: (values: IJobFilters) => void;
  onReset: () => void;
}

export interface ICustomPagination {
  pageIndex: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
  setPageIndex: (index: number) => void;
}

export interface EditJobFormType {
  jobData: JobsType;
  redirectTo: string;
}

export interface SharedJobFormValues {
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "remote" | "intern";
  description: string;
  salary: string;
  deadline: string;
  skills: string;
  category: string;
  companyLogo?: any;
}

export interface BaseJobFormProps {
  mode: "create" | "update";
  initialValues: Partial<SharedJobFormValues>;
  validationSchema?: any;
  isPending: boolean;
  onSubmit: (data: SharedJobFormValues) => void;
  onCancel: () => void;
}

export interface BaseFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  rules?: RegisterOptions;
  placeholder?: string;
}

export interface JobDetailsFormProps {
  mode: "create" | "update";
  initialValues: Partial<SharedJobFormValues>;
  register: UseFormRegister<SharedJobFormValues>;
  errors: FieldErrors<SharedJobFormValues>;
  isPending: boolean;
  isGeneratingAI: boolean;
  aiError: string | null;
  onGenerateAI: () => void;
}

export interface GeneratedDescriptionProps {
  description: string;
  onUse: () => void;
  onDiscard: () => void;
}
