export type UserRole = "candidate" | "admin" | "recruiter";

export interface RecruiterProfile {
  jobTitle?: string;
  companyWebsite?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  phone?: string;
  linkedinUrl?: string;
  hiringFocus?: string;
  yearsOfExperience?: number;
  bio?: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  company?: string;
  password: string;
  confirmPassword: string;
  avatar?: string | null;
  role: UserRole;
  recruiterProfile?: RecruiterProfile;
  createdAt?: string;
}
