"use client";

import { useRouter } from "next/navigation";
import { useCreateJob } from "@/Hooks/useJobs";
import { createJobSchema } from "@/utils/schemaValidate";
import BaseJobForm, {
  SharedJobFormValues,
} from "@/shared/CustomForm/BaseJobForm";

export default function PostedJob({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const createJob = useCreateJob();

  const handleCreateSubmit = async (data: SharedJobFormValues) => {
    try {
      const file = data.companyLogo?.[0];
      const formData = new FormData();

      formData.append("title", data.title.trim());
      formData.append("description", data.description);
      formData.append("company", data.company.trim());
      formData.append("location", data.location.trim());
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
    <BaseJobForm
      mode="create"
      initialValues={{ type: "full-time" }}
      validationSchema={createJobSchema}
      isPending={createJob.isPending}
      onSubmit={handleCreateSubmit}
      onCancel={() => router.push(redirectTo)}
    />
  );
}
