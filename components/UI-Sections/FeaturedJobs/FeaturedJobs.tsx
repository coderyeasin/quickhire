"use client";

import { useApprovedJobs } from "@/Hooks/useJobs";
import FeatureHeader from "@/shared/FeatureHeader";
import Spinner from "@/shared/Spinner";
import { JobsType } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const FeaturedJobs = () => {
  const { data, isLoading } = useApprovedJobs();
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredJobs: JobsType[] = useMemo(() => data?.data ?? [], [data]);
  const slicedJobs = useMemo(() => featuredJobs.slice(8, 16), [featuredJobs]);

  const nextSlide = () => {
    if (currentIndex < slicedJobs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <section className="container-layout py-8 md:py-14 overflow-hidden">
      <div className="flex flex-col md:grid md:grid-cols-2 items-center gap-y-6 md:gap-y-0 w-full">
        <FeatureHeader
          title={"Featured"}
          subTitle={"jobs"}
          linksTitle={"Show all jobs"}
        />

        {slicedJobs.length > 0 && (
          <div className="flex md:hidden justify-end gap-2 w-full order-2 px-1">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="p-2.5 rounded-full border border-third-gray/30 bg-white active:bg-gray-100 disabled:opacity-40 transition-opacity"
            >
              <IoChevronBackOutline className="text-lg text-dark-text" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex === slicedJobs.length - 1}
              className="p-2.5 rounded-full border border-third-gray/30 bg-white active:bg-gray-100 disabled:opacity-40 transition-opacity"
            >
              <IoChevronForwardOutline className="text-lg text-dark-text" />
            </button>
          </div>
        )}

        <div className="order-1 md:order-0 col-span-2 w-full mt-6 md:mt-8 lg:mt-10">
          <div
            className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 transition-transform duration-500 ease-out w-full md:transform-none!"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 16}px))`,
            }}
          >
            {slicedJobs.map((job: JobsType) => (
              <Link
                key={job._id}
                href={`/jobs/${job._id}`}
                className="w-full shrink-0 min-w-full md:min-w-0 md:shrink"
              >
                <div className="flex flex-col items-start gap-3 md:gap-4 px-3 md:px-4 lg:px-5 py-4 md:py-5 space-y-2 md:space-y-3 border border-third-gray/20 cursor-pointer transition-transform duration-300 hover:scale-105 rounded-lg md:rounded-xl bg-white w-full h-full">
                  <div className="flex items-start justify-between w-full gap-2 md:gap-3">
                    <Image
                      src={job.companyLogo}
                      alt={job.title}
                      className="object-contain w-10 md:w-12 lg:w-16 h-auto shrink-0"
                      width={64}
                      height={64}
                      priority
                    />
                    <p className="border-2 border-indigoTags capitalize text-indigoTags px-1.5 md:px-2 py-0.5 md:py-1 lg:py-2 text-xs md:text-sm font-semibold">
                      {job.type}
                    </p>
                  </div>
                  <div className="w-full">
                    <h4 className="text-sm md:text-base lg:text-lg font-semibold text-dark-text line-clamp-2">
                      {job.title}
                    </h4>
                    <p className="text-third-gray text-xs md:text-sm lg:text-base truncate">
                      {job.company} • {job.location}
                    </p>
                    <p className="text-third-gray py-1.5 md:py-2 lg:py-3 text-xs md:text-sm truncate">
                      {job.description}
                    </p>
                  </div>
                  <div className="w-full">
                    <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1 md:pt-2">
                      {job.category.slice(0, 2).map((cat) => (
                        <p
                          key={cat}
                          className={`text-xs font-semibold ${
                            cat.includes("Marketing")
                              ? "bg-ylwTags/10 border-ylwTags text-ylwTags"
                              : cat.includes("Technology") ||
                                  cat.includes("Data Science") ||
                                  cat.includes("Research")
                                ? "bg-redTags/10  border-redTags text-redTags"
                                : cat.includes("Business") ||
                                    cat.includes("Sales") ||
                                    cat.includes("Finance")
                                  ? "bg-indigoTags/10 border-indigoTags text-indigoTags"
                                  : cat.includes("Design")
                                    ? "bg-greenTags/10 border-greenTags text-greenTags"
                                    : "bg-third-gray/10 text-primary-gray/70"
                          } px-1.5 md:px-2 lg:px-3 py-0.5 md:py-1 lg:py-2 rounded-full`}
                        >
                          {cat}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
