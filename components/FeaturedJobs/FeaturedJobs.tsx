import React from "react";
import { IoArrowForwardSharp } from "react-icons/io5";

const FeaturedJobs = () => {
  return (
    <section className="container-layout py-14">
      <div className="flex justify-between items-center">
        <h2 className="text-dark-text text-[48px] font-semibold font-clash leading-[160%]">
          Featured <span className="text-blue-text"> jobs</span>
        </h2>
        <div className="flex items-end gap-3 text-indigoTags cursor-pointer">
          <h3 className=" text-md font-medium">Show all jobs</h3>
          <IoArrowForwardSharp className="text-xl" />
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
