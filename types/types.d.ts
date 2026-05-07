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
