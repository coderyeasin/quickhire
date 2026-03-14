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
