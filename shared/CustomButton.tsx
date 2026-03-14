import { CustomButtonProps } from "@/types/interfaces";

const CustomButton = (props: CustomButtonProps) => {
  return (
    <button
      type={props.type || "button"}
      className={`px-6 py-3 cursor-pointer ${props.className || "w-20"}`}
      onClick={props.onClick}
    >
      {props.children || props.label}
    </button>
  );
};

export default CustomButton;
