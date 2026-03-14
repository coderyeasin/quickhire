export interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}
