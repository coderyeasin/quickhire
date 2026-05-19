"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { SlLocationPin } from "react-icons/sl";
import { FiSearch } from "react-icons/fi";
import { ModalMode } from "@/types/types";
import CustomButton from "@/shared/CustomButton";
import Modal from "@/shared/Modal";

interface SearchFormValues {
  searchTxt: string;
  locationTxt: string;
}

const HeroJobSearch = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("search");

  const [modalSearch, setModalSearch] = useState("");
  const [modalLocation, setModalLocation] = useState("");

  const { register, handleSubmit, reset } = useForm<SearchFormValues>({
    defaultValues: {
      searchTxt: "",
      locationTxt: "",
    },
  });

  const onSubmit = (data: SearchFormValues) => {
    setModalSearch(data.searchTxt);
    setModalLocation(data.locationTxt);

    setMode("search");
    setOpen(true);

    reset();
  };

  return (
    <div className="w-full lg:w-213 flex flex-col items-start gap-3 md:gap-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-2 md:p-4 bg-white flex flex-col md:flex-row items-stretch gap-2 md:gap-3 w-full rounded-lg md:rounded-xl shadow-sm"
      >
        <div className="w-full md:flex-1 flex items-center gap-2 border-b-2 md:border-b-0 border-gray-300 focus-within:border-indigo-text md:border-l-2 md:border-l-indigoTags px-2 md:px-3 py-2">
          <FiSearch className="shrink-0 text-lg md:text-xl text-third-gray" />
          <input
            type="text"
            {...register("searchTxt")}
            placeholder="Job title or keyword"
            className="outline-none font-epilogue text-third-gray text-xs md:text-sm w-full placeholder-third-gray/50 focus:placeholder-third-gray/70 transition-all"
          />
        </div>

        <div className="w-full md:flex-1 flex items-center gap-2 border-b-2 md:border-b-0 border-gray-300 focus-within:border-indigo-text md:border-l-2 md:border-l-indigoTags px-2 md:px-3 py-2">
          <SlLocationPin className="shrink-0 text-lg md:text-xl text-third-gray" />
          <input
            type="text"
            {...register("locationTxt")}
            placeholder="Florence, Italy"
            className="outline-none font-epilogue text-third-gray text-xs md:text-sm w-full placeholder-third-gray/50 focus:placeholder-third-gray/70 transition-all"
          />
        </div>

        <CustomButton
          type="submit"
          label="Search my job"
          className="text-white font-bold bg-indigoTags w-full md:w-auto px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm md:text-base transition-all hover:opacity-90 active:scale-95 rounded-lg md:rounded-lg"
        />
      </form>

      <Modal
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        setMode={setMode}
        searchTxt={modalSearch}
        locationTxt={modalLocation}
      />
    </div>
  );
};

export default HeroJobSearch;
