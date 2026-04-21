import CustomButton from "@/shared/CustomButton";
import { categoryCardsData } from "@/utils/category";
import Image from "next/image";

import { IoArrowForwardSharp } from "react-icons/io5";

const Categories = () => {
  return (
    <section className="container-layout py-8 md:py-14">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-semibold font-clash leading-tight md:leading-[160%]">
          Explore by <span className="text-blue-text">Category</span>
        </h2>
        <div className="flex items-center gap-2 text-indigoTags cursor-pointer text-sm md:text-md">
          <h3 className="font-medium">Show all jobs</h3>
          <IoArrowForwardSharp className="text-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-10">
        {categoryCardsData.map((card) => (
          <div
            key={card.id}
            className={`${card.id === 3 ? "bg-indigoTags text-white" : "bg-white"} flex flex-col items-center gap-4 px-4 md:px-5 py-5 space-y-3 border border-third-gray/30 cursor-pointer transition-transform duration-300 hover:scale-105`}
          >
            <Image
              src={card.image}
              alt={card.title}
              className="object-contain w-12 md:w-16 h-auto"
              width={64}
              height={64}
              priority
            />
            <div className="text-center">
              <h4
                className={`text-base md:text-lg font-semibold ${card.id === 3 ? "text-white" : "text-dark-text"}`}
              >
                {card.title}
              </h4>
              <div className="flex gap-4 md:gap-7 pt-2 justify-center items-center">
                <p
                  className={`text-xs md:text-sm ${card.id === 3 ? "text-white" : "text-third-gray"}`}
                >
                  {card.jobs}
                </p>
                <IoArrowForwardSharp className="text-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="bg-indigoTags relative h-auto md:h-103.5 w-full flex flex-col md:flex-row items-center justify-around my-10 md:my-15 px-6 md:px-0 py-10 md:py-0"
        style={{
          clipPath:
            "polygon(10% 0%, 80% 0%, 100% 0%, 100% 80%, 90% 100%, 0% 100%, 0% 80%, 0% 20%)",
        }}
      >
        <div className="space-y-4 md:space-y-5 text-white text-center md:text-left">
          <h2 className="font-clash font-semibold leading-tight md:leading-[110%] text-2xl sm:text-3xl md:text-4xl lg:text-[48px]">
            Start posting <br /> jobs today
          </h2>
          <p className="font-epilogue font-medium leading-[160%] text-sm md:text-base">
            Start posting jobs for only $10.
          </p>
          <CustomButton
            label="Sign Up For Free"
            className="bg-white text-indigoTags font-epilogue font-bold leading-[160%] px-4 py-2 w-full md:w-auto"
          />
        </div>
        <div className="mt-6 md:mt-0 md:mt-14 w-full md:w-auto flex justify-center">
          <Image
            src={`/images/hero/dashboard.png`}
            alt="dashboard"
            width={300}
            height={200}
            priority
            className="w-full md:w-auto max-w-xs md:max-w-none"
          />
        </div>
      </div>
    </section>
  );
};

export default Categories;
