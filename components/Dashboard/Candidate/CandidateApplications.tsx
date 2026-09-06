"use client";
import {
  useMyApplications,
  useWithdrawApplication,
} from "@/Hooks/useApplications";
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
import toast from "react-hot-toast";

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
  const { mutate, isPending } = useWithdrawApplication();

  const applicants: ApplicationsType[] = useMemo(
    () => data?.data ?? [],
    [data],
  );

  const isExpired = (application: ApplicationsType) =>
    application.isExpired ??
    (application.jobId?.status === "expired" ||
      (!!application.jobId?.deadline &&
        new Date(application.jobId.deadline).getTime() <= Date.now()) ||
      (!!application.jobId?.updatedAt &&
        new Date(application.appliedAt).getTime() <
          new Date(application.jobId.updatedAt).getTime()));

  const columns = useMemo(
    () => [
      col.display({
        id: "job",
        header: "Position",
        cell: (i) => {
          const j = i.row.original.jobId;
          const expired = isExpired(i.row.original);
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
                <p
                  className={`font-medium text-sm ${expired ? "text-slate-400" : "text-indigoTags hover:text-dark-text"}`}
                >
                  {j.title}
                </p>
                <p
                  className={`text-xs ${expired ? "text-slate-400" : "text-indigoTags hover:text-primary-gray"}`}
                >
                  {j.company}
                </p>
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
          <span
            className={`text-sm capitalize ${isExpired(i.row.original) ? "text-slate-400" : "text-dark-text"}`}
          >
            {i.row.original.jobId?.type ?? "—"}
          </span>
        ),
      }),
      col.display({
        id: "deadline",
        header: "Deadline",
        cell: (i) => {
          const deadline = i.row.original.jobId?.deadline;
          const expired = isExpired(i.row.original);
          return expired ? (
            <StatusBadge status="expired" />
          ) : (
            <span
              className={`text-sm capitalize ${expired ? "text-slate-400" : "text-dark-text"}`}
            >
              {deadline ? new Date(deadline).toLocaleDateString("en-BD") : "—"}
            </span>
          );
        },
      }),

      col.accessor("appliedAt", {
        header: "Applied",
        cell: (i) => (
          <span
            className={`text-xs ${isExpired(i.row.original) ? "text-slate-400" : "text-primary-gray"}`}
          >
            {new Date(i.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
      col.accessor("status", {
        header: "Status",
        cell: (i) => <StatusBadge status={i.getValue()} />,
      }),
      col.display({
        id: "actions",
        header: "Actions",
        cell: (i) => {
          const application = i.row.original;
          const expired = isExpired(application);
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  toast(
                    (t) => (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium">
                          {expired
                            ? "Remove expired application?"
                            : "Withdraw application?"}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              mutate(application._id);
                              toast.dismiss(t.id);
                            }}
                            disabled={isPending}
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg"
                          >
                            {isPending ? "Removing..." : "Withdraw"}
                          </button>
                          <button
                            onClick={() => toast.dismiss(t.id)}
                            className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ),
                    { duration: Infinity },
                  );
                }}
                className="px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                Withdraw
              </button>
            </div>
          );
        },
      }),
    ],
    [isPending, mutate],
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
