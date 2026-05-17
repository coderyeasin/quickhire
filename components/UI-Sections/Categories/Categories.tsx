"use client";
import { useApprovedJobs } from "@/Hooks/useJobs";
import CustomButton from "@/shared/CustomButton";
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
import Link from "next/link";
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-semibold font-clash leading-tight md:leading-[160%]">
          Explore by <span className="text-blue-text">Category</span>
        </h2>
        <Link href="/jobs">
          <div className="flex items-center gap-2 text-indigoTags cursor-pointer text-sm md:text-md">
            <h3 className="font-medium">Show all jobs</h3>
            <IoArrowForwardSharp className="text-lg" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-10">
        {categoryCardsData.map((card) => {
          const isHighlighted = card.id === 2;
          const IconComponent = card.Icon;

          return (
            <div
              key={card.title}
              className={`flex flex-col items-center gap-4 px-4 md:px-5 py-6 border border-third-gray/15 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg
          ${isHighlighted ? "bg-indigoTags text-white" : "bg-white text-dark-text"}
        `}
            >
              <div className={`p-3 rounded-lg `}>
                <IconComponent
                  className={`size-24 md:text-4xl ${isHighlighted ? "text-white" : "text-indigoTags"}`}
                />
              </div>

              <div className="text-center">
                <h4 className="text-base md:text-lg font-semibold">
                  {card.title}
                </h4>
                <div className="flex gap-3 pt-2 justify-center items-center opacity-80">
                  <p className="text-xs md:text-sm">{card.jobs}</p>
                  <IoArrowForwardSharp className="text-lg transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          );
        })}
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
            onClick={() => {
              setMode("register");
              setOpen(true);
            }}
            label="Sign Up For Free"
            className="bg-white text-indigoTags font-epilogue font-bold leading-[160%] px-4 py-2 w-full md:w-auto"
          />
        </div>
        <div className="mt-6 md:mt-14 w-full md:w-auto flex justify-center">
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
      <Modal open={open} onOpenChange={setOpen} mode={mode} setMode={setMode} />
    </section>
  );
};

export default Categories;
