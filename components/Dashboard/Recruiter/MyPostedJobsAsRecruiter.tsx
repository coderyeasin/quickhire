"use client";

import { useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FiExternalLink, FiTrash2, FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDeleteJob, useMyJobs, useUpdateJobStatus } from "@/Hooks/useJobs";
import StatusBadge from "@/shared/StatusBadge";
import Modal from "@/shared/Modal";
import { JobsType, ModalMode } from "@/types/types";
import CustomPagination from "@/shared/CustomPagination";
import CustomTable from "@/shared/CustomTable";
import Spinner from "@/shared/Spinner";

const col = createColumnHelper<JobsType>();

const MyPostedJobsAsRecruiter = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [mode, setMode] = useState<ModalMode>("jobs");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading } = useMyJobs();
  const updateStatus = useUpdateJobStatus();
  const deleteJob = useDeleteJob();

  const jobs: JobsType[] = useMemo(() => data?.data ?? [], [data]);

  const columns = useMemo(
    () => [
      col.accessor("title", {
        header: "Job Title",
        cell: (i) => (
          <button
            onClick={() => {
              setMode("jobs");
              setOpen(true);
              setJobId(i.row.original._id);
            }}
            className="flex items-center gap-2 font-medium hover:text-dark-text cursor-pointer text-indigoTags transition-colors text-left"
          >
            {i.getValue()}
            <FiExternalLink className="size-4 text-indigoTags" />
          </button>
        ),
      }),
      col.accessor("company", { header: "Company" }),
      col.accessor("type", {
        header: "Type",
        cell: (i) => <span className="capitalize">{i.getValue()}</span>,
      }),
      col.accessor("status", {
        header: "Status",
        cell: (i) => <StatusBadge status={i.getValue()} />,
      }),
      col.accessor("createdAt", {
        header: "Posted",
        cell: (i) => new Date(i.getValue()).toLocaleDateString(),
      }),
      col.accessor("updatedAt", {
        header: "Updated At",
        cell: (i) => new Date(i.getValue()).toLocaleDateString(),
      }),
      col.accessor("updateHistory", {
        header: "Update History",
        cell: (i) => {
          const history = [...(i.getValue() ?? [])].reverse();

          return history.length ? (
            <div className="min-w-56 space-y-2 text-xs">
              {history.map((entry) => (
                <div key={entry._id ?? entry.changedAt} className="space-y-0.5">
                  <div className="flex justify-between gap-2 font-medium text-dark-text">
                    <span className="capitalize">{entry.role}</span>
                    <span className="text-slate-500">
                      {new Date(entry.changedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-500">
                    Previous: {entry.previousStatus}; Changed:{" "}
                    {entry.changedFields.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-slate-400">No updates</span>
          );
        },
      }),
      col.display({
        id: "actions",
        header: "Actions",
        cell: (i) => {
          const job = i.row.original;
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/recruiter/edit/${job._id}`)}
                className="p-1.5 text-slate-400 hover:text-indigoTags cursor-pointer hover:bg-slate-50 rounded-lg transition-colors"
              >
                <FiEdit2 className="text-sm" />
              </button>

              {job.status === "pending" && (
                <button
                  onClick={() =>
                    updateStatus.mutate({ id: job._id, status: "rejected" })
                  }
                  className="px-3 py-1 text-xs font-medium cursor-pointer bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                >
                  Reject
                </button>
              )}
              <button
                onClick={() => {
                  toast(
                    (t) => (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium">
                          Are you sure you want to permanently delete this job?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              deleteJob.mutate(job._id);
                              toast.dismiss(t.id);
                            }}
                            className="px-3 py-1 bg-red-500 text-white cursor-pointer text-xs rounded-lg"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => toast.dismiss(t.id)}
                            className="px-3 py-1 bg-slate-100 cursor-pointer text-slate-600 text-xs rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ),
                    { duration: Infinity },
                  );
                }}
                className="p-1.5 text-red-400 hover:text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiTrash2 className="text-sm" />
              </button>
            </div>
          );
        },
      }),
    ],
    [updateStatus, deleteJob, router],
  );

  const table = useReactTable({
    data: jobs ?? [],
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      {isLoading ? (
        <Spinner />
      ) : (
        <h3 className="text-lg font-semibold text-dark-text text-center ">
          Your Total Jobs: {jobs.length}
        </h3>
      )}
      <CustomTable
        table={table}
        isLoading={isLoading}
        emptyMessage="No jobs yet"
      />
      <CustomPagination
        pageIndex={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        nextPage={table.nextPage}
        previousPage={table.previousPage}
        setPageIndex={table.setPageIndex}
      />
      <Modal
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        setMode={setMode}
        jobId={jobId}
      />
    </div>
  );
};

export default MyPostedJobsAsRecruiter;
