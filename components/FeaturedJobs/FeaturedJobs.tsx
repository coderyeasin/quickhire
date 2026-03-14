import featuredJobCardsData from "@/utils/featuredCard";
import Image from "next/image";
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {featuredJobCardsData.map((job) => (
          <div
            key={job.id}
            className={` "flex flex-col items-center gap-5 px-5 py-5 space-y-3 border border-third-gray/20 cursor-pointer transition-transform duration-300 hover:scale-105`}
          >
            <div className="flex items-start justify-between">
              <Image
                src={job.image}
                alt={job.title}
                className="object-contain"
                width={64}
                height={64}
                priority
              />
              <p className="border-2 border-indigoTags text-indigoTags px-2 py-2">
                {job.workType}
              </p>
            </div>
            <div>
              <h4 className={`text-lg font-semibold text-dark-text`}>
                {job.title}
              </h4>
              <p className="text-third-gray">
                {job.company} • {job.location}
              </p>
              <p className="text-third-gray py-3 truncate">
                {job.shortDescription}
              </p>
            </div>
            <div>
              <div className="flex gap-7 pt-1">
                {job.category.map((type) => (
                  <p
                    key={type}
                    className={` text-xs font-semibold ${
                      type.includes("Marketing")
                        ? "bg-ylwTags/10 border-ylwTags text-ylwTags"
                        : type.includes("Technology") ||
                            type.includes("Data Science") ||
                            type.includes("Research")
                          ? "bg-redTags/10  border-redTags text-redTags"
                          : type.includes("Business") ||
                              type.includes("Sales") ||
                              type.includes("Finance")
                            ? "bg-indigoTags/10 border-indigoTags text-indigoTags"
                            : type.includes("Design")
                              ? "bg-greenTags/10 border-greenTags text-greenTags"
                              : ""
                    } 
                        px-3 py-2 rounded-full`}
                  >
                    {type}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedJobs;
