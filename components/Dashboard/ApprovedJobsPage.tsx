"use client";

import { useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useApprovedJobs } from "@/Hooks/useJobs";
import StatusBadge from "@/shared/StatusBadge";
import DataTable from "@/shared/DataTable";
import Modal from "@/shared/Modal";
import { JobsType, ModalMode } from "@/types/types";
import Spinner from "@/shared/Spinner";
import { FiExternalLink } from "react-icons/fi";
import CustomPagination from "@/shared/CustomPagination";

const col = createColumnHelper<JobsType>();

const ApprovedJobsPage = () => {
  const [open, setOpen] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [mode, setMode] = useState<ModalMode>("jobs");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useApprovedJobs();
  const jobs = useMemo(() => data?.data ?? [], [data]);

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
            className="font-medium flex gap-2 hover:text-dark-text text-indigoTags transition-colors text-left cursor-pointer"
          >
            {i.getValue()}
            <FiExternalLink className="size-4 hover:text-primary-gray text-indigoTags" />
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
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

export default ApprovedJobsPage;
