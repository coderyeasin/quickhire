import CustomButton from "@/shared/CustomButton";
import { categoryCardsData } from "@/utils/category";
import Image from "next/image";

import { IoArrowForwardSharp } from "react-icons/io5";

const Categories = () => {
  return (
    <section className="container-layout py-14">
      <div className="flex justify-between items-center">
        <h2 className="text-dark-text text-[48px] font-semibold font-clash leading-[160%]">
          Explore by <span className="text-blue-text">Category</span>
        </h2>
        <div className="flex items-end gap-3 text-indigoTags cursor-pointer">
          <h3 className=" text-md font-medium">Show all jobs</h3>
          <IoArrowForwardSharp className="text-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {categoryCardsData.map((card) => (
          <div
            key={card.id}
            className={` ${card.id === 3 ? "bg-indigoTags text-white" : "bg-white"} "flex flex-col items-center gap-5 px-5 py-5 space-y-3 border border-third-gray/30 cursor-pointer transition-transform duration-300 hover:scale-105`}
          >
            <Image
              src={card.image}
              alt={card.title}
              className="object-contain"
              width={64}
              height={64}
              priority
            />
            <div>
              <h4
                className={`text-lg font-semibold ${card.id === 3 ? "text-white" : "text-dark-text"}`}
              >
                {card.title}
              </h4>
              <div className="flex gap-7 pt-1">
                <p
                  className={`text-sm ${card.id === 3 ? "text-white" : "text-third-gray"}`}
                >
                  {card.jobs}
                </p>
                <IoArrowForwardSharp className="text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="bg-indigoTags relative h-103.5 w-full flex items-center justify-around my-15"
        style={{
          clipPath:
            "polygon(10% 0%, 80% 0%, 100% 0%, 100% 80%, 90% 100%, 0% 100%, 0% 80%, 0% 20%)",
        }}
      >
        <div className="space-y-5 text-white">
          <h2 className="font-clash font-semibold leading-[110%] text-[48px]">
            Start posting <br /> jobs today
          </h2>
          <p className="font-epilogue font-medium leading-[160%] ">
            Start posting jobs for only $10.
          </p>
          <CustomButton
            label="Sign Up For Free"
            className="bg-white text-indigoTags font-epilogue font-bold leading-[160%] px-4 py-2"
          />
        </div>
        <div className="lg:mt-14">
          <Image
            src={`/images/hero/dashboard.png`}
            alt="dashboard"
            width={584}
            height={346}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Categories;
