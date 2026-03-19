export type UserRole = "candidate" | "admin";

export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}
