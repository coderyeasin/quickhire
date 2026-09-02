"use client";
import { useMyApplications } from "@/Hooks/useApplications";
import CustomPagination from "@/shared/CustomPagination";
import CustomTable from "@/shared/CustomTable";
import Modal from "@/shared/Modal";
import Spinner from "@/shared/Spinner";
import StatusBadge from "@/shared/StatusBadge";
import { ApplicationsType } from "@/types/interfaces";
import { ModalMode } from "@/types/types";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FiExternalLink } from "react-icons/fi";

const col = createColumnHelper<ApplicationsType>();

const CandidateApplicationsPage = () => {
  const [open, setOpen] = useState(false);
  const [applicantsId, setApplicantsId] = useState<string | null>(null);
  const [mode, setMode] = useState<ModalMode>("applicants");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading } = useMyApplications();

  const applicants: ApplicationsType[] = useMemo(
    () => data?.data ?? [],
    [data],
  );

  const isExpired = (job: ApplicationsType["jobId"]) =>
    job?.status === "expired" ||
    (!!job?.deadline && new Date(job.deadline).getTime() <= Date.now());

  const columns = useMemo(
    () => [
      col.display({
        id: "job",
        header: "Position",
        cell: (i) => {
          const j = i.row.original.jobId;
          const expired = isExpired(j);
          return j ? (
            <div
              onClick={
                expired
                  ? undefined
                  : () => {
                      setMode("applicants");
                      setOpen(true);
                      setApplicantsId(i.row.original._id);
                    }
              }
              className={`font-medium transition-colors text-left flex items-start gap-3 ${
                expired ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              }`}
            >
              <div>
                <p className="font-medium hover:text-dark-text text-sm text-indigoTags">
                  {j.title}
                </p>
                <p className="text-xs hover:text-primary-gray text-indigoTags">
                  {j.company}
                </p>
                {expired && (
                  <StatusBadge status="expired" />
                )}
              </div>
              {!expired && (
                <FiExternalLink className="size-4 hover:text-primary-gray text-indigoTags" />
              )}
            </div>
          ) : (
            <span className="text-xs text-primary-gray">Job removed</span>
          );
        },
      }),
      col.display({
        id: "type",
        header: "Type",
        cell: (i) => (
          <span className="text-sm text-dark-text capitalize">
            {i.row.original.jobId?.type ?? "—"}
          </span>
        ),
      }),
      col.display({
        id: "deadline",
        header: "Deadline",
        cell: (i) => {
          const deadline = i.row.original.jobId?.deadline;
          const expired = isExpired(i.row.original.jobId);
          return expired ? (
            <StatusBadge status="expired" />
          ) : (
            <span className="text-sm text-dark-text capitalize">
              {deadline
                ? new Date(deadline).toLocaleDateString("en-BD")
                : "—"}
            </span>
          );
        },
      }),

      col.accessor("appliedAt", {
        header: "Applied",
        cell: (i) => (
          <span className="text-xs text-primary-gray">
            {new Date(i.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
      col.accessor("status", {
        header: "Status",
        cell: (i) => <StatusBadge status={i.getValue()} />,
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: applicants,
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
      <h3 className="text-lg font-semibold text-dark-text text-center ">
        Total Applications: {applicants.length}
      </h3>
      <CustomTable
        table={table}
        isLoading={isLoading}
        emptyMessage="No applications yet"
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
        applicantsId={applicantsId}
      />
    </div>
  );
};

export default CandidateApplicationsPage;
