"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateApplication } from "@/Hooks/useApplications";
import CustomButton from "./CustomButton";
import { useRouter } from "next/navigation";
import {
  createApplicationValidationSchema,
  CreateAppType,
} from "@/modules/application/application.validation";
import { useSession } from "next-auth/react";

export const inputCls =
  "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-dark-text focus:outline-none focus:border-indigoTags/50 focus:ring-2 focus:ring-indigoTags/10 transition-all bg-white";
export const labelCls =
  "block text-xs font-semibold text-primary-gray uppercase tracking-wide mb-1.5";
export const errorCls = "text-red-500 text-xs mt-1";

const ApplyForm = ({ jobId }: { jobId: string }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { mutate: createApplication, isPending } = useCreateApplication();
  const role = session?.user?.role;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAppType>({
    resolver: zodResolver(createApplicationValidationSchema),
    defaultValues: {
      jobId,
    },
  });

  const onSubmit = (data: CreateAppType) => {
    createApplication(data, {
      onSuccess: () => {
        reset();
        router.push(role ? `/${role}/applications` : "/");
      },
    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl space-y-5 shadow-sm"
      >
        <h2 className="text-lg font-semibold">Apply for this job</h2>
        <input type="hidden" {...register("jobId")} />
        <div>
          <label className={labelCls}>Cover Letter</label>
          <textarea
            {...register("coverLetter")}
            rows={5}
            placeholder="Write your cover letter..."
            className={inputCls}
          />
          {errors.coverLetter && (
            <p className={errorCls}>{errors.coverLetter.message}</p>
          )}
        </div>
        <div>
          <label className={labelCls}>Resume URL</label>
          <input
            {...register("resumeUrl")}
            placeholder="https://your-resume-link.com"
            className={inputCls}
          />
          {errors.resumeUrl && (
            <p className={errorCls}>{errors.resumeUrl.message}</p>
          )}
        </div>

        <CustomButton
          disabled={isPending}
          type="submit"
          label={isPending ? "Submitting..." : "Apply Now"}
          className="w-full bg-indigoTags text-white py-2 rounded-lg text-sm font-medium disabled:opacity-60"
        />
      </form>
    </div>
  );
};

export default ApplyForm;
