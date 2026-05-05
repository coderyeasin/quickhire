"use client";

import {
  useApplications,
  useUpdateApplicationStatus,
} from "@/Hooks/useApplications";
import ReusableTable from "@/shared/DataTable";
import Spinner from "@/shared/Spinner";
import StatusBadge from "@/shared/StatusBadge";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type ApplicationType = {
  _id: string;
  jobId: { title: string; company: string } | null;
  candidateId: { name: string; email: string } | null;
  recruiterId: { name: string } | null;
  status: string;
  appliedAt: string;
};

const NEXT_STATUSES: Record<string, string[]> = {
  pending: ["reviewing", "rejected"],
  reviewing: ["shortlisted", "rejected"],
  shortlisted: ["hired", "rejected"],
  rejected: [],
  hired: [],
};

const col = createColumnHelper<ApplicationType>();

const Applications = () => {
  const { data, isLoading } = useApplications();
  const updateStatus = useUpdateApplicationStatus();

  const apps: ApplicationType[] = data?.data ?? [];

  const columns = [
    col.display({
      id: "candidate",
      header: "Candidate",
      cell: (i) => {
        const c = i.row.original.candidateId;
        return c ? (
          <div>
            <p className="font-medium text-dark-text text-sm">{c.name}</p>
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
        return j ? (
          <div>
            <p className="font-medium text-dark-text text-sm">{j.title}</p>
            <p className="text-xs text-primary-gray">{j.company}</p>
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
        <span className="text-sm text-dark-text">
          {i.row.original.recruiterId?.name ?? "—"}
        </span>
      ),
    }),
    col.accessor("status", {
      header: "Status",
      cell: (i) => <StatusBadge status={i.getValue()} />,
    }),
    col.accessor("appliedAt", {
      header: "Applied",
      cell: (i) => (
        <span className="text-xs text-primary-gray">
          {new Date(i.getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    col.display({
      id: "actions",
      header: "Move to",
      cell: (i) => {
        const app = i.row.original;
        const nexts = NEXT_STATUSES[app.status] ?? [];
        if (nexts.length === 0) {
          return <span className="text-xs text-primary-gray">—</span>;
        }
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            {nexts.map((s) => (
              <button
                key={s}
                onClick={() => updateStatus.mutate({ id: app._id, status: s })}
                disabled={updateStatus.isPending}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ${
                  s === "rejected"
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : s === "hired"
                      ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      : "bg-indigoTags/10 text-indigoTags hover:bg-indigoTags/20"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: apps,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-dark-text text-center ">
        Total Applications: {apps.length}
      </h3>
      <ReusableTable
        table={table}
        isLoading={isLoading}
        emptyMessage="No applications yet"
      />
    </div>
  );
};

export default Applications;
