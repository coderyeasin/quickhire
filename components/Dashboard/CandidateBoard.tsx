"use client";

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FiFileText, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  useMyApplications,
  useWithdrawApplication,
} from "@/Hooks/useApplications";
import StatusBadge from "@/shared/StatusBadge";
import PageHeader from "@/shared/PageHeader";
import StatsCard from "@/shared/StatusCard";
import { FaCircleNotch } from "react-icons/fa6";
import { useMemo } from "react";
import { IApplication } from "@/modules/application/application.interface";
import ReusableTable from "@/shared/DataTable";

type CurrentJobsType = {
  _id: string;
  jobId: { _id: string; title: string; company: string; type: string };
  status: string;
  appliedAt: string;
};

const col = createColumnHelper<CurrentJobsType>();

const CandidateBoard = () => {
  const { mutate, isPending } = useWithdrawApplication();
  const { data, isLoading } = useMyApplications();

  const appliedJobs = useMemo(() => data?.data ?? [], [data]);

  const jobStatus = useMemo(() => {
    const pending = appliedJobs.filter(
      (a: IApplication) => a.status === "pending",
    ).length;
    const reviewing = appliedJobs.filter(
      (a: IApplication) => a.status === "reviewing",
    ).length;
    const shortlisted = appliedJobs.filter(
      (a: IApplication) => a.status === "shortlisted",
    ).length;
    const rejected = appliedJobs.filter(
      (a: IApplication) => a.status === "rejected",
    ).length;
    //   const hired = appliedJobs.filter((a) => a.status === "hired").length;

    return { pending, reviewing, shortlisted, rejected };
  }, [appliedJobs]);

  const columns = useMemo(
    () => [
      col.accessor("jobId", {
        header: "Position",
        cell: (i) => (
          <div>
            <p className="font-medium text-dark-text">{i.getValue()?.title}</p>
            <p className="text-xs text-primary-gray">{i.getValue()?.company}</p>
          </div>
        ),
      }),
      col.accessor((row) => row.jobId?.type, {
        id: "type",
        header: "Type",
      }),
      col.accessor("status", {
        header: "Status",
        cell: (i) => <StatusBadge status={i.getValue()} />,
      }),
      col.accessor("appliedAt", {
        header: "Applied",
        cell: (i) => new Date(i.getValue()).toLocaleDateString(),
      }),
      col.display({
        id: "actions",
        header: "",
        cell: (i) => {
          const app = i.row.original;
          const canWithdraw = ["pending", "reviewing"].includes(app.status);
          if (!canWithdraw)
            return <span className="text-xs text-primary-gray">—</span>;
          return (
            <button
              onClick={() => {
                toast(
                  (t) => (
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium">
                        Withdraw application?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            mutate(app._id);
                            toast.dismiss(t.id);
                          }}
                          disabled={isPending}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg"
                        >
                          {isPending ? "Withdrawing..." : "Withdraw"}
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
          );
        },
      }),
    ],
    [mutate, isPending],
  );

  const tableData = useMemo(() => appliedJobs.slice(0, 5) ?? [], [appliedJobs]);
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Activities"
        sub="Track your job applications and progress"
        action={
          <Link
            href="/candidate/jobs"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigoTags text-white text-sm font-medium rounded-lg hover:bg-indigoTags/90 transition-colors"
          >
            Browse Jobs
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-5">
        <StatsCard
          label="Applied"
          value={isLoading ? "—" : appliedJobs.length}
          color="indigo"
          icon={<FiFileText />}
        />

        <StatsCard
          label="Pending"
          value={isLoading ? "—" : jobStatus?.pending}
          color="amber"
          icon={<FiClock />}
        />
        <StatsCard
          label="Reviewing"
          value={isLoading ? "—" : jobStatus?.reviewing}
          color="amber"
          icon={<FaCircleNotch />}
        />
        <StatsCard
          label="Shortlisted"
          value={isLoading ? "—" : jobStatus?.shortlisted}
          color="emerald"
          icon={<FiCheckCircle />}
          sub="Looking good!"
        />
        <StatsCard
          label="Rejected"
          value={isLoading ? "—" : jobStatus?.rejected}
          color="red"
          icon={<FiXCircle />}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-dark-text">
            Recent Applications
          </h2>
          <Link
            href="/candidate/jobs"
            className="text-sm text-indigoTags hover:underline font-medium"
          >
            View all →
          </Link>
        </div>
        <ReusableTable
          table={table}
          isLoading={isLoading}
          emptyMessage="You haven't applied to any jobs yet"
        />
      </div>
    </div>
  );
};
export default CandidateBoard;
