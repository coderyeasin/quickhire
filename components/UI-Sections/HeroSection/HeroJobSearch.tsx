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
    <div className="lg:w-213 flex flex-col items-start gap-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-3 md:p-4 bg-white flex flex-col md:flex-row items-stretch md:items-end gap-3 w-full"
      >
        <div className="w-full md:w-4/12 flex items-center text-xl md:text-2xl gap-2 flex-1 md:flex-none">
          <FiSearch className="shrink-0" />
          <input
            type="text"
            {...register("searchTxt")}
            placeholder="Job title or keyword"
            className="outline-none font-epilogue text-third-gray text-sm w-full px-2 md:px-3 py-2 border-b-2 border-gray-300 focus:border-indigo-text transition-colors duration-300"
          />
        </div>

        <div className="w-full md:w-4/12 flex items-center text-xl md:text-2xl gap-2 flex-1 md:flex-none">
          <SlLocationPin className="shrink-0" />
          <input
            type="text"
            {...register("locationTxt")}
            placeholder="Florence, Italy"
            className="outline-none font-epilogue text-third-gray text-sm w-full px-2 md:px-3 py-2 border-b-2 border-gray-300 focus:border-indigo-text transition-colors duration-300"
          />
        </div>

        <CustomButton
          type="submit"
          label="Search my job"
          className="text-white font-bold bg-indigoTags w-full md:w-4/12 py-2 md:py-4 whitespace-nowrap transition-all hover:opacity-90 active:scale-95"
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
