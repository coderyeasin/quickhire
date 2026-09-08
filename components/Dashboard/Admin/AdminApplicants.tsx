"use client";

import {
  useApplications,
  useUpdateApplicationStatus,
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

const applicantStatus: Record<string, string[]> = {
  pending: ["reviewing", "rejected"],
  reviewing: ["shortlisted", "rejected"],
  shortlisted: ["hired", "rejected"],
  rejected: [],
  hired: [],
};

const col = createColumnHelper<ApplicationsType>();

const AdminApplicants = () => {
  const [open, setOpen] = useState(false);
  const [applicantsId, setApplicantsId] = useState<string | null>(null);
  const [mode, setMode] = useState<ModalMode>("applicants");

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useApplications();
  const updateStatus = useUpdateApplicationStatus();

  const applicants: ApplicationsType[] = useMemo(
    () => data?.data ?? [],
    [data],
  );

  const columns = useMemo(
    () => [
      col.display({
        id: "candidate",
        header: "Candidate",
        cell: (i) => {
          const c = i.row.original.candidateId;
          const textClass = i.row.original.isExpired
            ? "text-slate-400"
            : "text-dark-text";
          return c ? (
            <div>
              <p className={`font-medium text-sm ${textClass}`}>{c.name}</p>
              <p className="text-xs text-primary-gray">{c.email}</p>
            </div>
          ) : (
            <span className="text-xs text-primary-gray">Deleted user</span>
          );
        },
      }),
      col.display({
        id: "job",
        header: "Position",
        cell: (i) => {
          const j = i.row.original.jobId;
          const textClass = i.row.original.isExpired
            ? "text-slate-400"
            : "text-indigoTags";
          return j ? (
            <div
              onClick={() => {
                setMode("applicants");
                setOpen(true);
                setApplicantsId(i.row.original._id);
              }}
              className="font-medium cursor-pointer transition-colors text-left flex gap-2"
            >
              <div>
                <p className={`font-medium text-sm ${textClass}`}>{j.title}</p>
                <p className={`text-xs ${textClass}`}>{j.company}</p>
              </div>
              <FiExternalLink className={`size-4 ${textClass}`} />
            </div>
          ) : (
            <span className="text-xs text-primary-gray">Job removed</span>
          );
        },
      }),
      col.display({
        id: "recruiter",
        header: "Recruiter",
        cell: (i) => (
          <span
            className={`text-sm ${i.row.original.isExpired ? "text-slate-400" : "text-dark-text"}`}
          >
            {i.row.original.recruiterId?.name ?? "—"}
          </span>
        ),
      }),
      col.accessor("status", {
        header: "Status",
        cell: (i) => (
          <StatusBadge
            status={i.row.original.isExpired ? "expired" : i.getValue()}
          />
        ),
      }),
      col.accessor("appliedAt", {
        header: "Applied",
        cell: (i) => (
          <span
            className={`text-xs ${i.row.original.isExpired ? "text-slate-400" : "text-primary-gray"}`}
          >
            {new Date(i.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
      col.display({
        id: "actions",
        header: "Move to",
        cell: (i) => {
          const app = i.row.original;
          if (app.isExpired) {
            return <span className="text-xs text-slate-400">Expired</span>;
          }
          const applicant = applicantStatus[app.status] ?? [];
          if (applicant.length === 0) {
            return <span className="text-xs text-primary-gray">—</span>;
          }
          return (
            <div className="flex items-center gap-1.5 flex-wrap">
              {applicant.map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    updateStatus.mutate({ id: app._id, status: status })
                  }
                  disabled={updateStatus.isPending}
                  className={`px-2.5 py-1 capitalize cursor-pointer text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ${
                    status === "rejected"
                      ? "bg-red-50 text-red-500 hover:bg-red-100"
                      : status === "hired"
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        : "bg-indigoTags/10 text-indigoTags hover:bg-indigoTags/20"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          );
        },
      }),
    ],
    [updateStatus],
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

export default AdminApplicants;
