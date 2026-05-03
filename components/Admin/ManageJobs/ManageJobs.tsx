"use client";

import { useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { useDeleteJob, useJobs, useUpdateJobStatus } from "@/Hooks/useJobs";
import StatusBadge from "@/shared/StatusBadge";
import PageHeader from "@/shared/PageHeader";
import DataTable from "@/shared/DataTable";
import CustomModal from "@/shared/CustomModal";

type JobRow = {
  _id: string;
  title: string;
  company: string;
  type: string;
  status: string;
  createdAt: string;
};

const col = createColumnHelper<JobRow>();

const ManageJobs = () => {
  // const {isOpen, setIsOpen} = useState(false);
  const { data, isLoading } = useJobs();
  const updateStatus = useUpdateJobStatus();
  const deleteJob = useDeleteJob();

  const jobs: JobRow[] = useMemo(() => data?.data ?? [], [data]);

  const columns = useMemo(
    () => [
      col.accessor("title", {
        header: "Job Title",
        cell: (i) => (
          <span className="font-medium text-dark-text">{i.getValue()}</span>
        ),
      }),
      col.accessor("company", { header: "Company" }),
      col.accessor("type", { header: "Type" }),
      col.accessor("status", {
        header: "Status",
        cell: (i) => <StatusBadge status={i.getValue()} />,
      }),
      col.accessor("createdAt", {
        header: "Posted",
        cell: (i) => new Date(i.getValue()).toLocaleDateString(),
      }),
      col.display({
        id: "actions",
        header: "Actions",
        cell: (i) => {
          const job = i.row.original;
          return (
            <div className="flex items-center gap-2">
              {job.status === "pending" && (
                <>
                  <button
                    onClick={() =>
                      updateStatus.mutate({ id: job._id, status: "approved" })
                    }
                    className="px-3 py-1 text-xs font-medium cursor-pointer bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      updateStatus.mutate({ id: job._id, status: "rejected" })
                    }
                    className="px-3 py-1 text-xs font-medium cursor-pointer bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  toast(
                    (t) => (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium">Delete this job?</p>
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
    [updateStatus, deleteJob],
  );

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Jobs"
        sub={`${jobs.length} total jobs`}
        action={
          <Link
            href="/admin/add"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigoTags text-white text-sm font-medium rounded-lg hover:bg-indigoTags/90 transition-colors"
          >
            <FiPlus /> Post New Job
          </Link>
        }
      />
      <DataTable
        table={table}
        isLoading={isLoading}
        emptyMessage="No jobs yet"
      />
      {/* <CustomModal /> */}
    </div>
  );
};

export default ManageJobs;
