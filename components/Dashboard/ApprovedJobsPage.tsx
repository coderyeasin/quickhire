"use client";

import { useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useJobs } from "@/Hooks/useJobs";
import StatusBadge from "@/shared/StatusBadge";
import DataTable from "@/shared/DataTable";
import Modal from "@/shared/Modal";
import { JobsType, ModalMode } from "@/types/types";
import Spinner from "@/shared/Spinner";

const col = createColumnHelper<JobsType>();

const ApprovedJobsPage = () => {
  const [open, setOpen] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [mode, setMode] = useState<ModalMode>("jobs");

  const { data, isLoading } = useJobs();

  const jobs = useMemo(
    () =>
      (data?.data ?? []).filter((job: JobsType) => job.status === "approved"),
    [data],
  );

  const columns = useMemo(
    () => [
      col.accessor("title", {
        header: "Job Title",
        cell: (i) => (
          <button
            onClick={() => {
              setOpen(true);
              setJobId(i.row.original._id);
            }}
            className="font-medium text-dark-text hover:text-indigoTags transition-colors text-left cursor-pointer"
          >
            {i.getValue()}
          </button>
        ),
      }),

      col.accessor("company", {
        header: "Company",
      }),

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
    ],
    [],
  );

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-dark-text text-center">
        Total Approved Jobs: {jobs.length}
      </h3>

      <DataTable
        table={table}
        isLoading={isLoading}
        emptyMessage="No approved jobs found"
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

export default ApprovedJobsPage;
