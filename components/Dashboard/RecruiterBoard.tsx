"use client";

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FiBriefcase, FiUsers, FiClock } from "react-icons/fi";

import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { useMyJobs } from "@/Hooks/useJobs";
import StatusBadge from "@/shared/StatusBadge";
import PageHeader from "@/shared/PageHeader";
import StatsCard from "@/shared/StatusCard";
import DataTable from "@/shared/DataTable";
import { useMemo } from "react";

type PostedJobsType = {
  _id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
};
const col = createColumnHelper<PostedJobsType>();

export default function RecruiterBoard() {
  const { data, isLoading } = useMyJobs();
  const jobs: PostedJobsType[] = useMemo(() => data?.data ?? [], [data]);

  const jobsStatus = useMemo(() => {
    const pendingJobs = jobs.filter((j) => j.status === "pending");
    const approvedJobs = jobs.filter((j) => j.status === "approved");
    return { pendingJobs, approvedJobs };
  }, [jobs]);

  // const pending = jobs.filter((j) => j.status === "pending").length;
  // const approved = jobs.filter((j) => j.status === "approved").length;

  const columns = useMemo(
    () => [
      col.accessor("title", {
        header: "Job Title",
        cell: (i) => (
          <span className="font-medium text-dark-text">{i.getValue()}</span>
        ),
      }),
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
        header: "",
        cell: (i) => (
          <Link
            href={`/recruiter/jobs/${i.row.original._id}/applicants`}
            className="text-sm text-indigoTags hover:underline font-medium"
          >
            View applicants →
          </Link>
        ),
      }),
    ],
    [],
  );

  const jobsData = useMemo(() => jobs.slice(0, 5), [jobs]);

  const table = useReactTable({
    data: jobsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Recruiter Dashboard"
        sub="Manage your job posts and review applicants"
        action={
          <Link
            href="/recruiter/add"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigoTags text-white text-sm font-medium rounded-lg hover:bg-indigoTags/90 transition-colors"
          >
            <FiPlus /> Post a Job
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard
          label="My Jobs"
          value={isLoading ? "—" : jobs.length}
          color="indigo"
          icon={<FiBriefcase />}
        />
        <StatsCard
          label="Live Jobs"
          value={isLoading ? "—" : jobsStatus.approvedJobs.length}
          color="emerald"
          icon={<FiUsers />}
        />
        <StatsCard
          label="Pending Review"
          value={isLoading ? "—" : jobsStatus.pendingJobs.length}
          color="amber"
          icon={<FiClock />}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-dark-text">
            Recent Posts
          </h2>
          <Link
            href="/recruiter/jobs"
            className="text-sm text-indigoTags hover:underline font-medium"
          >
            View all →
          </Link>
        </div>
        <DataTable
          table={table}
          isLoading={isLoading}
          emptyMessage="You haven't posted any jobs yet"
        />
      </div>
    </div>
  );
}
