export interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
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

// Real Types

interface JobsType {
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
}
