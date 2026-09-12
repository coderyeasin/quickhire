"use client";

import { useRouter } from "next/navigation";
import { useUpdateJob } from "@/Hooks/useJobs";
import { EditJobFormType, SharedJobFormValues } from "@/types/interfaces";
import BaseJobForm from "@/shared/CustomForm/BaseJobForm";

function UpdateSingleJobHome({ jobData, redirectTo }: EditJobFormType) {
  const router = useRouter();
  const updateJob = useUpdateJob();

  const initialFormValues: Partial<SharedJobFormValues> = {
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
    companyLogo: jobData.companyLogo,
  };

  const handleUpdateSubmit = async (data: SharedJobFormValues) => {
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
    <BaseJobForm
      mode="update"
      initialValues={initialFormValues}
      isPending={updateJob.isPending}
      onSubmit={handleUpdateSubmit}
      onCancel={() => router.push(redirectTo)}
    />
  );
}
export default UpdateSingleJobHome;
