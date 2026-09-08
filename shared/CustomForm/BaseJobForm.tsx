"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import { labelCls } from "@/shared/ApplyForm";
import { JobInput, JobSelect, JobTextarea } from "./FormFields";

export interface SharedJobFormValues {
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "remote" | "intern";
  description: string;
  salary: string;
  deadline: string;
  skills: string;
  category: string;
  companyLogo?: any;
}

interface BaseJobFormProps {
  mode: "create" | "update";
  initialValues: Partial<SharedJobFormValues>;
  validationSchema?: any;
  isPending: boolean;
  onSubmit: (data: SharedJobFormValues) => void;
  onCancel: () => void;
}

export default function BaseJobForm({
  mode,
  initialValues,
  validationSchema,
  isPending,
  onSubmit,
  onCancel,
}: BaseJobFormProps) {
  const isEdit = mode === "update";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SharedJobFormValues>({
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
    defaultValues: initialValues,
  });

  return (
    <div className="max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              rules={{ required: "Job title is required" }}
              placeholder="e.g. Frontend Engineer"
            />
            <JobInput
              label="Company"
              name="company"
              register={register}
              errors={errors}
              rules={{ required: "Company name is required" }}
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
              rules={{ required: "At least one category is required" }}
              placeholder="Frontend, Backend, Design"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <JobInput
              label="Location"
              name="location"
              register={register}
              errors={errors}
              rules={{ required: "Location is required" }}
              placeholder="e.g. Remote / Dhaka"
            />
            <JobSelect
              label="Job Type"
              name="type"
              register={register}
              options={[
                { value: "full-time", label: "Full-time" },
                { value: "part-time", label: "Part-time" },
                { value: "remote", label: "Remote" },
                { value: "intern", label: "Intern" },
              ]}
            />
          </div>

          <JobTextarea
            label="Description"
            name="description"
            register={register}
            errors={errors}
            rules={{ required: "Job description is required" }}
            placeholder="Describe responsibilities, requirements..."
          />

          <div>
            <JobInput
              label="Required Skills"
              name="skills"
              register={register}
              errors={errors}
              rules={{ required: "At least one skill is required" }}
              placeholder="React, Node.js, TypeScript"
            />
            <p className="text-xs text-primary-gray mt-1">
              Separate skills with commas
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-dark-text border-b border-slate-100 pb-3">
            Additional Info
          </h3>
          <JobInput
            label="Salary"
            name="salary"
            register={register}
            errors={errors}
            placeholder="e.g. 50k-90k USD / Negotiable"
          />
          <JobInput
            label="Application Deadline"
            name="deadline"
            type="date"
            register={register}
            errors={errors}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isPending}
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
            className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-lg hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
