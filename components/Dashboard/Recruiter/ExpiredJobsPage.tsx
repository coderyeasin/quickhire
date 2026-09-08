"use client";

import { useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FiExternalLink } from "react-icons/fi";
import { useExpiredJobs } from "@/Hooks/useJobs";
import StatusBadge from "@/shared/StatusBadge";
import CustomTable from "@/shared/CustomTable";
import CustomPagination from "@/shared/CustomPagination";
import Spinner from "@/shared/Spinner";
import { JobsType } from "@/types/types";

const col = createColumnHelper<JobsType>();

const ExpiredJobsPage = () => {
  const { data, isLoading } = useExpiredJobs();
  const jobs = useMemo(() => data?.data ?? [], [data]);

  const columns = useMemo(
    () => [
      col.accessor("title", {
        header: "Job Title",
        cell: (i) => (
          <button className="flex items-center gap-2 font-medium hover:text-dark-text cursor-pointer text-indigoTags transition-colors text-left">
            {i.getValue()}
            <FiExternalLink className="size-4" />
          </button>
        ),
      }),
      col.accessor("company", { header: "Company" }),
      col.accessor("deadline", {
        header: "Original Deadline",
        cell: (i) =>
          i.getValue() ? new Date(i.getValue()).toLocaleDateString() : "—",
      }),
      col.accessor("status", {
        header: "Status",
        cell: (i) => <StatusBadge status={i.getValue()} />,
      }),
      col.accessor("createdAt", {
        header: "Created",
        cell: (i) => new Date(i.getValue()).toLocaleDateString(),
      }),
      col.accessor("updatedAt", {
        header: "Updated At",
        cell: (i) => new Date(i.getValue()).toLocaleDateString(),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      {isLoading ? (
        <Spinner />
      ) : (
        <h3 className="text-lg font-semibold text-dark-text text-center">
          Expired Jobs: {jobs.length}
        </h3>
      )}

      <CustomTable
        table={table}
        isLoading={isLoading}
        emptyMessage="No expired jobs yet. Your expired jobs will appear here when their deadline has passed."
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
    </div>
  );
};

export default ExpiredJobsPage;
