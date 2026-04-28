import httpStatus from "http-status";
import AppError from "@/lib/AppError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// GET APIs
async function fetchAllApplications() {
  const res = await fetch("/api/applications");
  const data = await res.json();

  if (!data)
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to fetch applications");
  return data;
}

async function fetchMyApplications() {
  const res = await fetch("/api/applications/mine");
  const data = await res.json();

  if (!data) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to fetch my applications",
    );
  }
  return data;
}

async function fetchApplicationById(id: string) {
  const res = await fetch(`/api/applications/${id}`);
  const data = await res.json();

  if (!data)
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to fetch application");
  return data;
}

async function fetchApplicationsByJobId(jobId: string) {
  const res = await fetch(`/api/jobs/${jobId}/applicants`);
  const data = await res.json();

  if (!data)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to fetch applications for job",
    );
  return data;
}

// Queries
export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: fetchAllApplications,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: ["applications", "mine"],
    queryFn: fetchMyApplications,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useApplicationById(id: string) {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => fetchApplicationById(id),
    refetchOnWindowFocus: false,
  });
}

export function useApplicationsByJobId(jobId: string) {
  return useQuery({
    queryKey: ["applications", "job", jobId],
    queryFn: () => fetchApplicationsByJobId(jobId),
    refetchOnWindowFocus: false,
  });
}

// Mutations (create, update, delete)
export const useCreateApplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body) => {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new AppError(
          res.status,
          errorData.message || "Failed to create application",
        );
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      qc.invalidateQueries({ queryKey: ["applications"] });
      qc.invalidateQueries({ queryKey: ["applications", "mine"] });
    },
    onError: (error) => {
      if (error instanceof AppError) {
        toast.error(`Error ${error.statusCode}: ${error.message}`);
      } else {
        toast.error(
          "An unexpected error occurred while submitting the application.",
        );
      }
    },
  });
};

export function useUpdateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: any }) => {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data)
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Failed to update application",
        );
      return data;
    },
    onSuccess: () => {
      toast.success("Application updated successfully");
      qc.invalidateQueries({ queryKey: ["applications"] });
      qc.invalidateQueries({ queryKey: ["applications", "mine"] });
    },
    onError: (error) => {
      const err = error as AppError;
      toast.error(err.message || "Failed to update application");
    },
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/applications/${id}/status`, {
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
          "Failed to update application status",
        );
      return data;
    },
    onSuccess: () => {
      toast.success("Application status updated successfully");
      qc.invalidateQueries({ queryKey: ["applications"] });
      qc.invalidateQueries({ queryKey: ["applications", "mine"] });
    },
    onError: (error) => {
      const err = error as AppError;
      toast.error(err.message || "Failed to update application status");
    },
  });
}

export function useWithdrawApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new AppError(
          res.status,
          errorData.message || "Failed to delete application",
        );
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Application deleted successfully");
      qc.invalidateQueries({ queryKey: ["applications"] });
      qc.invalidateQueries({ queryKey: ["applications", "mine"] });
    },
    onError: (error) => {
      if (error instanceof AppError) {
        toast.error(`Error ${error.statusCode}: ${error.message}`);
      } else {
        toast.error(
          "An unexpected error occurred while deleting the application.",
        );
      }
    },
  });
}
