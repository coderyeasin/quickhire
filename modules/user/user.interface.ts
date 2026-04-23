export type UserRole = "candidate" | "admin" | "recruiter";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  company?: string;
  password: string;
  confirmPassword: string;
  avatar?: string | null;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}
