"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCreateJob } from "@/Hooks/useJobs";
import { errorCls, inputCls, labelCls } from "@/shared/ApplyForm";
import { createJobSchema, CreateJobsTypes } from "@/types/constraints";

export default function PostedJob({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const createJob = useCreateJob();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateJobsTypes>({
    resolver: zodResolver(createJobSchema),
  });

  const onSubmit = async (data: CreateJobsTypes) => {
    try {
      const file = data.companyLogo?.[0];

      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("company", data.company);
      formData.append("location", data.location);
      formData.append("type", data.type);

      if (data.salary) formData.append("salary", data.salary);
      if (data.deadline) formData.append("deadline", data.deadline);

      data.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((skill) => formData.append("skills", skill));

      data.category
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
        .forEach((cat) => formData.append("category", cat));

      if (file) {
        formData.append("companyLogo", file);
      }

      createJob.mutate(formData, {
        onSuccess: () => router.push(redirectTo),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-dark-text border-b border-slate-100 pb-3">
            Job Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Job Title</label>
              <input
                {...register("title")}
                placeholder="e.g. Frontend Engineer"
                className={inputCls}
              />
              {errors.title && (
                <p className={errorCls}>{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className={labelCls}>Company</label>
              <input
                {...register("company")}
                placeholder="e.g. Acme Corp"
                className={inputCls}
              />
              {errors.company && (
                <p className={errorCls}>{errors.company.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Company Logo</label>
              <input
                type="file"
                accept="image/*"
                {...register("companyLogo")}
                className={inputCls}
              />
              {errors.companyLogo && (
                <p className={errorCls}>
                  {errors.companyLogo.message as string}
                </p>
              )}
            </div>

            <div>
              <label className={labelCls}>Category</label>
              <input
                {...register("category")}
                placeholder="Frontend, Backend, Design"
                className={inputCls}
              />
              {errors.category && (
                <p className={errorCls}>{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Location</label>
              <input
                {...register("location")}
                placeholder="e.g. Remote / Dhaka"
                className={inputCls}
              />
              {errors.location && (
                <p className={errorCls}>{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className={labelCls}>Job Type</label>
              <select {...register("type")} className={inputCls}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="remote">Remote</option>
                <option value="intern">Intern</option>
              </select>
              {errors.type && <p className={errorCls}>{errors.type.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Describe responsibilities, requirements..."
              className={`${inputCls} resize-none`}
            />
            {errors.description && (
              <p className={errorCls}>{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>Required Skills</label>
            <input
              {...register("skills")}
              placeholder="React, Node.js, TypeScript"
              className={inputCls}
            />
            {errors.skills && (
              <p className={errorCls}>{errors.skills.message}</p>
            )}
            <p className="text-xs text-primary-gray mt-1">
              Separate skills with commas
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-dark-text border-b border-slate-100 pb-3">
            Additional Info
          </h3>

          <div>
            <label className={labelCls}>Salary</label>
            <input
              {...register("salary")}
              placeholder="e.g. 50k-90k USD / Negotiable"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Application Deadline</label>
            <input type="date" {...register("deadline")} className={inputCls} />
          </div>
        </div>

        <button
          type="submit"
          disabled={createJob.isPending}
          className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-indigoTags text-white font-semibold rounded-lg hover:bg-indigoTags/90 transition-all disabled:opacity-60"
        >
          {createJob.isPending && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {createJob.isPending ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}
