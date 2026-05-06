"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCreateJob } from "@/Hooks/useJobs";

const schema = z.object({
  title: z.string().min(3, "Title required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  company: z.string().min(2, "Company required"),
  companyLogo: z
    .any()
    .refine((file) => file?.length === 1, "Company logo is required"),
  category: z.string().min(1, "Enter at least one category"),
  location: z.string().min(2, "Location required"),
  type: z.enum(["full-time", "part-time", "remote", "intern"]),
  skills: z.string().min(1, "Enter at least one skill"),
  salary: z.string().optional(),
  deadline: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputCls =
  "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-dark-text focus:outline-none focus:border-indigoTags/50 focus:ring-2 focus:ring-indigoTags/10 transition-all bg-white";
const labelCls =
  "block text-xs font-semibold text-primary-gray uppercase tracking-wide mb-1.5";
const errorCls = "text-red-500 text-xs mt-1";

interface PostJobFormProps {
  redirectTo: string;
}

export default function PostedJob({ redirectTo }: PostJobFormProps) {
  const router = useRouter();
  const createJob = useCreateJob();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // const file = data.companyLogo[0];

      console.log("Form data:", data);
      // const uploaded = await uploadCloudinary(file);
      // const logoUrl = uploaded.secure_url;

      // const skillsArray = data.skills
      //   .split(",")
      //   .map((s) => s.trim())
      //   .filter(Boolean);

      // const categoryArray = data.category
      //   .split(",")
      //   .map((c) => c.trim())
      //   .filter(Boolean);

      // createJob.mutate(
      //   {
      //     title: data.title,
      //     description: data.description,
      //     company: data.company,
      //     companyLogo: logoUrl,
      //     category: categoryArray,
      //     location: data.location,
      //     type: data.type,
      //     salary: data.salary || "Negotiable",
      //     skills: skillsArray,
      //     deadline: data.deadline ? new Date(data.deadline) : undefined,
      //   },
      //   {
      //     onSuccess: () => router.push(redirectTo),
      //   }
      // );
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="max-w-3xl">
      {/* <PageHeader
        title="Post a New Job"
        sub="Fill in the details --- it goes to admin review before going live"
      /> */}

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
