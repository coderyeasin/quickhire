"use client";
import { useApprovedJobs } from "@/Hooks/useJobs";
import CustomButton from "@/shared/CustomButton";
import FeatureHeader from "@/shared/FeatureHeader";
import Modal from "@/shared/Modal";
import Spinner from "@/shared/Spinner";
import { JobsType, ModalMode } from "@/types/types";
import {
  Banknote,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CodeXml,
  Megaphone,
  Monitor,
  PencilRuler,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FaUsers } from "react-icons/fa6";
import { IoArrowForwardSharp } from "react-icons/io5";
import { MdOutlineCampaign } from "react-icons/md";

const CatIcons: Record<string, React.ElementType> = {
  Design: PencilRuler,
  Sales: ChartNoAxesCombined,
  Marketing: Megaphone,
  Finance: Banknote,
  Technology: Monitor,
  Engineering: CodeXml,
  Business: BriefcaseBusiness,
  "Human Resource": FaUsers,
  Default: MdOutlineCampaign,
};

const Categories = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("login");
  const { data, isLoading } = useApprovedJobs();

  const jobs: JobsType[] = useMemo(() => data?.data ?? [], [data]);

  const categoriesCount = jobs.reduce(
    (acc: Record<string, number>, job: JobsType) => {
      job.category.forEach((cat: string) => {
        acc[cat] = (acc[cat] || 0) + 1;
      });
      return acc;
    },
    {},
  );

  const categoryCardsData = Object.entries(categoriesCount).map(
    ([name, count], index) => ({
      id: index,
      title: name,
      jobs: `${count} Jobs Available`,
      Icon: CatIcons[name] || CatIcons.Default,
    }),
  );

  return isLoading ? (
    <Spinner />
  ) : (
    <section className="container-layout py-8 md:py-14">
      <div className="flex flex-col md:grid md:grid-cols-2 items-center gap-y-6 md:gap-y-0">
        <FeatureHeader
          title={"Explore by"}
          subTitle={"Category"}
          linksTitle={"Show all jobs"}
        />

        <div className="order-2 md:order-0 col-span-2 w-full mt-8 md:mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categoryCardsData.map((card) => {
              const IconComponent = card.Icon;

              return (
                <div
                  key={card.title}
                  className="group w-full flex flex-row md:flex-col items-center gap-4 px-4 md:px-5 md:py-6 
                border border-third-gray/15 cursor-pointer transition-all duration-300 
                hover:scale-105 hover:shadow-lg bg-white text-dark-text hover:bg-indigoTags
                hover:text-white"
                >
                  <div className="p-3 rounded-lg text-indigoTags group-hover:text-white transition-colors duration-300">
                    <IconComponent className="size-20 md:size-24 md:text-4xl" />
                  </div>

                  <div className="text-justify md:text-center w-full">
                    <h4 className="text-base md:text-lg font-semibold">
                      {card.title}
                    </h4>

                    <div className="flex justify-between md:justify-center items-start gap-3 pt-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm md:text-md">{card.jobs}</p>
                      <IoArrowForwardSharp className="text-lg transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="
        bg-indigoTags relative h-auto w-full
        flex flex-col md:flex-row items-start justify-center 
        px-16 my-15 md:h-100 lg:h-112.5
        [clip-path:polygon(10%_0%,80%_0%,100%_0%,100%_80%,90%_100%,0%_100%,0%_80%,0%_20%)]"
      >
        <div className="w-full md:w-1/2 lg:w-5/12 text-center md:text-left space-y-5 mt-20 lg:mt-30 z-10">
          <h2 className="font-clash font-semibold tracking-wide leading-[100%] text-3xl sm:text-4xl lg:text-5xl text-white">
            Start posting <br className="hidden md:inline" /> jobs today
          </h2>
          <p className="font-epilogue font-medium leading-relaxed text-sm sm:text-base text-white/90">
            Start posting jobs for only $10.
          </p>
          <div className="pt-2">
            <CustomButton
              onClick={() => {
                setMode("register");
                setOpen(true);
              }}
              label="Sign Up For Free"
              className="bg-white text-indigoTags font-epilogue font-bold px-6 py-3.5 w-full min-w-45 md:w-auto shadow-md hover:bg-white/90 transition-colors"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-7/12 flex justify-center items-center mt-14 md:mt-0 relative">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-none md:w-full lg:max-w-155 h-full flex items-end">
            <Image
              src="/images/hero/dashboard.png"
              alt="dashboard"
              width={650}
              height={480}
              priority
              className="w-full h-auto object-contain object-center transform md:translate-y-18 lg:translate-y-18"
            />
          </div>
        </div>
      </div>

      <Modal open={open} onOpenChange={setOpen} mode={mode} setMode={setMode} />
    </section>
  );
};

export default Categories;
