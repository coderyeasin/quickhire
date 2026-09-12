/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";

import { labelCls } from "@/shared/ApplyForm";
import { JobInput, JobSelect, JobTextarea } from "./FormFields";
import { JobDetailsFormProps } from "@/types/interfaces";
import { useSession } from "next-auth/react";

export default function JobDetailsForm({
  mode,
  initialValues,
  register,
  errors,
  isPending,
  isGeneratingAI,
  aiError,
  onGenerateAI,
}: JobDetailsFormProps) {
  const userRole = useSession()?.data?.user?.role;
  const isEdit = mode === "update";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
      <h3 className="text-sm font-semibold text-dark-text border-b border-slate-100 pb-3">
        {isEdit ? "Update Your Job Information" : "Job Details"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <JobInput
          label="Job Title"
          name="title"
          register={register}
          errors={errors}
          rules={{
            required: "Job title is required",
          }}
          placeholder="e.g. Frontend Engineer"
        />

        <JobInput
          label="Company"
          name="company"
          register={register}
          errors={errors}
          rules={{
            required: "Company name is required",
          }}
          placeholder="e.g. Acme Corp"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isEdit ? (
          <div>
            <label className={labelCls}>Company Logo</label>

            <div className="flex items-center gap-3 px-3 py-2 border border-slate-200 bg-slate-50/80 rounded-lg select-none opacity-80 h-[42px]">
              {initialValues.companyLogo ? (
                <>
                  <Image
                    src={initialValues.companyLogo}
                    alt="Company logo"
                    className="object-cover rounded"
                    width={40}
                    height={40}
                  />

                  <span className="text-xs text-slate-500 font-medium truncate">
                    Logo remains locked
                  </span>
                </>
              ) : (
                <span className="text-xs text-slate-400 italic">
                  No logo provided
                </span>
              )}
            </div>
          </div>
        ) : (
          <JobInput
            label="Company Logo"
            name="companyLogo"
            type="file"
            register={register}
            errors={errors}
          />
        )}

        <JobInput
          label="Category"
          name="category"
          register={register}
          errors={errors}
          rules={{
            required: "At least one category is required",
          }}
          placeholder="Frontend, Backend, Design"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <JobInput
          label="Location"
          name="location"
          register={register}
          errors={errors}
          rules={{
            required: "Location is required",
          }}
          placeholder="e.g. Remote / Dhaka"
        />

        <JobSelect
          label="Job Type"
          name="type"
          register={register}
          options={[
            {
              value: "full-time",
              label: "Full-time",
            },
            {
              value: "part-time",
              label: "Part-time",
            },
            {
              value: "remote",
              label: "Remote",
            },
            {
              value: "intern",
              label: "Intern",
            },
          ]}
        />
      </div>

      <div className="space-y-3">
        <JobTextarea
          label="Description"
          name="description"
          register={register}
          errors={errors}
          rules={{
            required: "Job description is required",
          }}
          placeholder="Describe responsibilities, requirements..."
        />

        {/* AI GENERATE */}

        {!isEdit && userRole === "recruiter" && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onGenerateAI}
              disabled={isGeneratingAI || isPending}
              className="inline-flex w-fit items-center gap-2 cursor-pointer rounded-lg border border-indigoTags/20 bg-indigoTags/5 px-4 py-2.5 text-sm font-semibold text-indigoTags transition-all hover:bg-indigoTags/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGeneratingAI ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigoTags/30 border-t-indigoTags" />
                  Generating...
                </>
              ) : (
                <>
                  <span className="text-base">✨</span>
                  Generate with AI
                </>
              )}
            </button>

            <p className="text-xs text-primary-gray">
              Generate a professional job description using your job
              information. You can review and edit it before posting.
            </p>

            {aiError && (
              <p className="text-sm font-medium text-red-500">{aiError}</p>
            )}
          </div>
        )}
      </div>

      <div>
        <JobInput
          label="Required Skills"
          name="skills"
          register={register}
          errors={errors}
          rules={{
            required: "At least one skill is required",
          }}
          placeholder="React, Node.js, TypeScript"
        />

        <p className="text-xs text-primary-gray mt-1">
          Separate skills with commas
        </p>
      </div>
    </div>
  );
}
