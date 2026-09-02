/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "@/lib/AppError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateJobType } from "@/modules/job/job.validation";

// GET APIs
async function fetchJobs() {
  const res = await fetch("/api/jobs");
  const data = await res.json();

  if (!data) throw new AppError(httpStatus.BAD_REQUEST, "Failed to fetch jobs");
  return data;
}

async function fetchApprovedJobs() {
  const res = await fetch("/api/jobs/approved");
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

async function fetchExpiredJobs() {
  const res = await fetch("/api/jobs/expired");
  const data = await res.json();

  if (!data) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to fetch expired jobs");
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
    queryKey: ["jobs", "all"],
    queryFn: fetchJobs,
  });
}

export function useApprovedJobs() {
  return useQuery({
    queryKey: ["jobs", "approved"],
    queryFn: fetchApprovedJobs,
  });
}

export function useMyJobs() {
  return useQuery({
    queryKey: ["jobs", "mine"],
    queryFn: fetchMyJobs,
  });
}

export function useExpiredJobs() {
  return useQuery({
    queryKey: ["jobs", "expired"],
    queryFn: fetchExpiredJobs,
  });
}

export function useJobById(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJobById(id),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

// Mutations (create, update, delete)
export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: FormData) => {
      const res = await fetch("/api/jobs", {
        method: "POST",
        body,
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

//--------- need to include-------- formdata format --- if logo need change
export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updateData,
    }: {
      id: string;
      updateData: UpdateJobType;
    }) => {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (!data)
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update job");
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success("Job updated successfully");
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["job", variables.id] });
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
