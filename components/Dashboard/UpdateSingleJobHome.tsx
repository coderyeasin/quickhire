"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUpdateJob } from "@/Hooks/useJobs";
import { errorCls, inputCls, labelCls } from "@/shared/ApplyForm";
import { UpdateJobForm } from "@/types/types";
import Image from "next/image";
import { EditJobFormType } from "@/types/interfaces";

function UpdateSingleJobHome({ jobData, redirectTo }: EditJobFormType) {
  const router = useRouter();
  const updateJob = useUpdateJob();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateJobForm>({
    defaultValues: {
      title: jobData.title || "",
      company: jobData.company || "",
      location: jobData.location || "",
      type:
        (jobData.type as "full-time" | "part-time" | "remote" | "intern") ||
        "full-time",
      description: jobData.description || "",
      salary: jobData.salary || "",
      deadline: jobData.deadline
        ? new Date(jobData.deadline).toISOString().split("T")[0]
        : "",
      skills: Array.isArray(jobData.skills)
        ? jobData.skills.join(", ")
        : (jobData.skills as string) || "",
      category: Array.isArray(jobData.category)
        ? jobData.category.join(", ")
        : (jobData.category as string) || "",
    },
  });

  const onSubmit = async (data: UpdateJobForm) => {
    try {
      const updateData = {
        title: data.title.trim(),
        description: data.description,
        company: data.company.trim(),
        location: data.location.trim(),
        type: data.type,
        salary: data.salary || "Negotiable",
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        skills: data.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        category: data.category
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        status: jobData.status as "pending" | "approved" | "rejected",
        companyLogo: jobData.companyLogo,
      };
      updateJob.mutate(
        { id: jobData._id, updateData },
        {
          onSuccess: () => router.push(redirectTo),
        },
      );
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  return (
    <div className="max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-dark-text border-b border-slate-100 pb-3">
            Update Your Job Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Job Title</label>
              <input
                {...register("title", { required: "Job title is required" })}
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
                {...register("company", {
                  required: "Company name is required",
                })}
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
              <div className="flex items-center gap-3 px-3 py-2 border border-slate-200 bg-slate-50/80 rounded-lg select-none opacity-80 h-[42px]">
                {jobData.companyLogo ? (
                  <>
                    <Image
                      src={jobData.companyLogo}
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

            <div>
              <label className={labelCls}>Category</label>
              <input
                {...register("category", {
                  required: "At least one category is required",
                })}
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
                {...register("location", { required: "Location is required" })}
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
              {...register("description", {
                required: "Job description is required",
              })}
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
              {...register("skills", {
                required: "At least one skill is required",
              })}
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

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={updateJob.isPending}
            className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-indigoTags text-white font-semibold rounded-lg hover:bg-indigoTags/90 transition-all disabled:opacity-60"
          >
            {updateJob.isPending && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {updateJob.isPending ? "Saving Changes..." : "Update Job"}
          </button>
          <button
            type="button"
            onClick={() => router.push(redirectTo)}
            className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-lg hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
export default UpdateSingleJobHome;
