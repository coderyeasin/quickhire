import React from "react";
import { IoArrowForwardSharp } from "react-icons/io5";

const LatestJobs = () => {
  return (
    <section className="bg-[#F8F8FD] bg-[url(/images/hero/Pattern.png)] bg-no-repeat bg-contain bg-right">
      <div className="container-layout py-14">
        <div className="flex justify-between items-center">
          <h2 className="text-dark-text text-[48px] font-semibold font-clash leading-[160%]">
            Latest <span className="text-blue-text"> jobs open</span>
          </h2>
          <div className="flex items-end gap-3 text-indigoTags cursor-pointer">
            <h3 className=" text-md font-medium">Show all jobs</h3>
            <IoArrowForwardSharp className="text-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;
