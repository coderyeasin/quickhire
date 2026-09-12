"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import GeneratedDescription from "./GeneratedDescription";
import { generateAIJobDescription } from "@/Hooks/useAIToGenerateDes";
import JobDetailsForm from "./JobDetailsForm";
import {
  handleCancelAI,
  handleGeneratedAIContent,
  handleAIDescriptionContent,
} from "@/lib/handlerAi";
import { BaseJobFormProps, SharedJobFormValues } from "@/types/interfaces";
import { useSession } from "next-auth/react";

export default function BaseJobForm({
  mode,
  initialValues,
  validationSchema,
  isPending,
  onSubmit,
  onCancel,
}: BaseJobFormProps) {
  const userRole = useSession()?.data?.user?.role;
  const isEdit = mode === "update";

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<SharedJobFormValues>({
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
    defaultValues: initialValues,
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);
  const [generatedDescription, setGeneratedDescription] = useState<
    string | null
  >(null);

  const handleGenerateAI = () => {
    return handleGeneratedAIContent(
      getValues,
      setAIError,
      setIsGeneratingAI,
      generateAIJobDescription,
      setGeneratedDescription,
    );
  };

  const handleUseAIDescription = () => {
    return handleAIDescriptionContent(
      generatedDescription,
      setValue,
      setGeneratedDescription,
      setAIError,
    );
  };

  const handleDiscardAI = () => {
    return handleCancelAI(setGeneratedDescription, setAIError);
  };

  const handleFormSubmit = (data: SharedJobFormValues) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-3xl">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <JobDetailsForm
          mode={mode}
          initialValues={initialValues}
          register={register}
          errors={errors}
          isPending={isPending}
          isGeneratingAI={isGeneratingAI}
          aiError={aiError}
          onGenerateAI={handleGenerateAI}
        />

        {/* GENERATED DESCRIPTION */}
        {userRole === "recruiter" && generatedDescription && (
          <GeneratedDescription
            description={generatedDescription}
            onUse={handleUseAIDescription}
            onDiscard={handleDiscardAI}
          />
        )}

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-dark-text border-b border-slate-100 pb-3">
            Additional Info
          </h3>

          <div>
            <label
              htmlFor="salary"
              className="block text-sm font-medium text-dark-text mb-2"
            >
              Salary
            </label>

            <input
              id="salary"
              {...register("salary")}
              placeholder="e.g. 50k-90k USD / Negotiable"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigoTags"
            />

            {errors.salary && (
              <p className="mt-1 text-sm text-red-500">
                {errors.salary.message as string}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-dark-text mb-2"
            >
              Application Deadline
            </label>

            <input
              id="deadline"
              type="date"
              {...register("deadline")}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigoTags"
            />

            {errors.deadline && (
              <p className="mt-1 text-sm text-red-500">
                {errors.deadline.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isPending || isGeneratingAI}
            className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-indigoTags text-white font-semibold rounded-lg hover:bg-indigoTags/90 transition-all disabled:opacity-60"
          >
            {isPending && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}

            {isEdit
              ? isPending
                ? "Saving Changes..."
                : "Update Job"
              : isPending
                ? "Posting..."
                : "Post Job"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isPending || isGeneratingAI}
            className="px-6 py-3 bg-slate-100 text-slate-600 cursor-pointer font-semibold rounded-lg hover:bg-slate-200 transition-all disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
