import { FaSpinner } from "react-icons/fa6";

type SpinnerType = {
  size?: number;
  className?: string;
};

const Spinner = ({ size = 24, className = "" }: SpinnerType) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <FaSpinner size={size} className="animate-spin text-blue-500" />
    </div>
  );
};

export default Spinner;
