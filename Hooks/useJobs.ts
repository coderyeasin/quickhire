import httpStatus from "http-status";
import AppError from "@/lib/AppError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// GET APIs
async function fetchJobs() {
  const res = await fetch("/api/jobs");
  const data = await res.json();

  if (!data) throw new AppError(httpStatus.BAD_REQUEST, "Failed to fetch jobs");
  return data;
}

async function fetchMyJobs() {
  const res = await fetch("/api/jobs/mine");
  const data = await res.json();

  if (!data) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to fetch my jobs");
  }
  return data;
}

async function fetchJobById(id: string) {
  const res = await fetch(`/api/jobs/${id}`);
  const data = await res.json();

  if (!data) throw new AppError(httpStatus.BAD_REQUEST, "Failed to fetch job");
  return data;
}

// Queries
export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });
}

export function useMyJobs() {
  return useQuery({
    queryKey: ["jobs", "mine"],
    queryFn: fetchMyJobs,
  });
}

export function useJobById(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJobById(id),
  });
}

// Mutations (create, update, delete)

//-------- need to include--------- formdata format --- need to include
export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body) => {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data)
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create job");
      return data;
    },
    onSuccess: () => {
      toast.success("Job created successfully");
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      const err = error as AppError;
      toast.error(err.message || "Failed to create job");
    },
  });
}

//--------- need to include-------- formdata format --- need to include
export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: any }) => {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data)
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update job");
      return data;
    },
    onSuccess: () => {
      toast.success("Job updated successfully");
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      const err = error as AppError;
      toast.error(err.message || "Failed to update job");
    },
  });
}

export function useUpdateJobStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/jobs/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!data)
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Failed to update job status",
        );
      return data;
    },
    onSuccess: () => {
      toast.success("Job status updated successfully");
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      const err = error as AppError;
      toast.error(err.message || "Failed to update job status");
    },
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data)
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete job");
      return data;
    },
    onSuccess: () => {
      toast.success("Job deleted successfully");
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      const err = error as AppError;
      toast.error(err.message || "Failed to delete job");
    },
  });
}
