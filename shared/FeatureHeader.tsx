import Link from "next/link";
import { IoArrowForwardSharp } from "react-icons/io5";

const FeatureHeader = ({
  title,
  subTitle,
  linksTitle,
}: {
  title: string;
  subTitle: string;
  linksTitle: string;
}) => {
  return (
    <>
      <div className="order-1 md:order-0 w-full text-left">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-semibold font-clash leading-tight md:leading-[160%]">
          {title} <span className="text-blue-text">{subTitle}</span>
        </h2>
      </div>

      <div
        className={`${title === "Latest" ? "hidden md:block" : "order-3 md:order-0 w-full flex justify-start md:justify-end mt-4 md:mt-0"} `}
      >
        <Link href="/jobs">
          <div className="flex items-center gap-2 text-indigoTags cursor-pointer text-sm md:text-md">
            <h3 className="font-medium">{linksTitle}</h3>
            <IoArrowForwardSharp className="text-lg" />
          </div>
        </Link>
      </div>
    </>
  );
};

export default FeatureHeader;
