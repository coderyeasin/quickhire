"use client";

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  FiBriefcase,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import Link from "next/link";
import { useJobs } from "@/Hooks/useJobs";
import { useApplications } from "@/Hooks/useApplications";
import StatusBadge from "@/shared/StatusBadge";
import { useMemo } from "react";
import StatusCard from "@/shared/StatusCard";
import CustomTable from "@/shared/CustomTable";

type upComingJobsType = {
  _id: string;
  title: string;
  company: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const col = createColumnHelper<upComingJobsType>();

const AdminBoard = () => {
  const { data: jobsData, isLoading: jobsLoading } = useJobs();
  const { data: applicantsData, isLoading: applicantsLoading } =
    useApplications();
  // const updateStatus = useUpdateJobStatus();

  const jobs: upComingJobsType[] = useMemo(
    () => jobsData?.data ?? [],
    [jobsData],
  );
  const applicants = useMemo(
    () => applicantsData?.data ?? [],
    [applicantsData],
  );

  const jobsStatus = useMemo(() => {
    const pendingJobs = jobs.filter((j) => j.status === "pending");
    const approvedJobs = jobs.filter((j) => j.status === "approved");
    const rejectedJobs = jobs.filter((j) => j.status === "rejected");
    return { pendingJobs, approvedJobs, rejectedJobs };
  }, [jobs]);

  const columns = useMemo(
    () => [
      col.accessor("title", {
        header: "Job Title",
        cell: (i) => (
          <span className="font-medium text-dark-text">{i.getValue()}</span>
        ),
      }),
      col.accessor("company", { header: "Company" }),
      col.accessor("type", {
        header: "Type",
        cell: (i) => <span className="capitalize">{i.getValue()}</span>,
      }),
      col.accessor("status", {
        header: "Status",
        cell: (i) => <StatusBadge status={i.getValue()} />,
      }),
      col.accessor("updatedAt", {
        header: "Updated At",
        cell: (i) => new Date(i.getValue()).toLocaleDateString(),
      }),
      // col.display({
      //   id: "actions",
      //   header: "Actions",
      //   cell: (i) => {
      //     const job = i.row.original;
      //     return (
      //       <div className="flex items-center gap-2">
      //         {job.status === "pending" && (
      //           <>
      //             <button
      //               onClick={() =>
      //                 updateStatus.mutate({ id: job._id, status: "approved" })
      //               }
      //               className="px-3 py-1 text-xs font-medium cursor-pointer bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
      //             >
      //               Approve
      //             </button>
      //             <button
      //               onClick={() =>
      //                 updateStatus.mutate({ id: job._id, status: "rejected" })
      //               }
      //               className="px-3 py-1 text-xs font-medium cursor-pointer bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
      //             >
      //               Reject
      //             </button>
      //           </>
      //         )}
      //         {job.status !== "pending" && (
      //           <span className="text-xs text-primary-gray">—</span>
      //         )}
      //       </div>
      //     );
      //   },
      // }),
    ],
    [],
  );

  const tableData = useMemo(() => jobs.slice(0, 5), [jobs]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatusCard
          label="Total Jobs"
          value={jobsLoading ? "—" : jobs.length}
          color="indigo"
          sub="All posted jobs"
          icon={<FiBriefcase />}
        />
        <StatusCard
          label="Approved Jobs"
          value={jobsLoading ? "—" : jobsStatus.approvedJobs.length}
          color="emerald"
          sub="Published jobs"
          icon={<FiCheckCircle />}
        />
        <StatusCard
          label="Pending Review"
          value={jobsLoading ? "—" : jobsStatus.pendingJobs.length}
          sub="Needs your action"
          color="amber"
          icon={<FiClock />}
        />
        <StatusCard
          label="Rejected Jobs"
          value={jobsLoading ? "—" : jobsStatus.rejectedJobs.length}
          sub="No longer active"
          color="red"
          icon={<FiXCircle />}
        />
        <StatusCard
          label="Candidate Applied"
          value={applicantsLoading ? "—" : applicants.length}
          color="indigo"
          sub="Total applications received "
          icon={<FiUsers />}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-dark-text">
            Recent Jobs
          </h2>
          <Link
            href="/admin/jobs"
            className="text-sm text-indigoTags hover:underline font-medium"
          >
            View all →
          </Link>
        </div>
        <CustomTable
          table={table}
          isLoading={jobsLoading}
          emptyMessage="No jobs found"
        />
      </div>
    </div>
  );
};
export default AdminBoard;
