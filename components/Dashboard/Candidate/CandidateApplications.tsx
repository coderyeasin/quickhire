"use client";
import { useMyApplications } from "@/Hooks/useApplications";
import ReusableTable from "@/shared/DataTable";
import Modal from "@/shared/Modal";
import Spinner from "@/shared/Spinner";
import StatusBadge from "@/shared/StatusBadge";
import { ApplicationsType } from "@/types/interfaces";
import { ModalMode } from "@/types/types";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FiExternalLink } from "react-icons/fi";

const col = createColumnHelper<ApplicationsType>();

const CandidateApplicationsPage = () => {
  const [open, setOpen] = useState(false);
  const [applicantsId, setApplicantsId] = useState<string | null>(null);
  const [mode, setMode] = useState<ModalMode>("applicants");
  const { data, isLoading } = useMyApplications();

  const applicants: ApplicationsType[] = useMemo(
    () => data?.data ?? [],
    [data],
  );

  const columns = useMemo(
    () => [
      col.display({
        id: "job",
        header: "Position",
        cell: (i) => {
          const j = i.row.original.jobId;
          return j ? (
            <div
              onClick={() => {
                setMode("applicants");
                setOpen(true);
                setApplicantsId(i.row.original._id);
              }}
              className="font-medium cursor-pointer transition-colors text-left flex items-start gap-3"
            >
              <div>
                <p className="font-medium hover:text-dark-text text-sm text-indigoTags">
                  {j.title}
                </p>
                <p className="text-xs hover:text-primary-gray text-indigoTags">
                  {j.company}
                </p>
              </div>
              <FiExternalLink className="size-4 hover:text-primary-gray text-indigoTags" />
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
        cell: (i) => (
          <span className="text-sm text-dark-text capitalize">
            {new Date(i.row.original.jobId?.deadline ?? "-").toLocaleDateString(
              "en-BD",
            )}
          </span>
        ),
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
    getCoreRowModel: getCoreRowModel(),
  });

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-dark-text text-center ">
        Total Applications: {applicants.length}
      </h3>
      <ReusableTable
        table={table}
        isLoading={isLoading}
        emptyMessage="No applications yet"
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
