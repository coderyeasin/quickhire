/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldErrors, UseFormRegister } from "react-hook-form";
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

//----------------- Real Types -----------------

// Register Interface

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

  candidateId: ICandidate | null;
  recruiterId: IRecruiter | null;
  jobId: JobsType | null;
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
