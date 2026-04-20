"use client";
import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import CustomModal from "@/shared/CustomModal";

type Job = {
  id: string;
  title: string;
  status: "Active" | "Closed";
  type: string;
};

const defaultData: Job[] = [
  { id: "1", title: "Frontend Engineer", status: "Active", type: "Full-time" },
  { id: "2", title: "UI Designer", status: "Active", type: "Contract" },
  { id: "3", title: "Backend Developer", status: "Closed", type: "Full-time" },
];

export default function AdminDashboard() {
  const [data, setData] = useState(defaultData);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const columnHelper = createColumnHelper<Job>();

  const columns = [
    columnHelper.accessor("title", { header: "Job Title" }),
    columnHelper.accessor("type", { header: "Type" }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            info.getValue() === "Active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <button
          onClick={() => {
            setSelectedJob(info.row.original);
            setModalOpen(true);
          }}
          className="text-blue-600 hover:underline font-medium cursor-pointer"
        >
          Edit
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section>
      <DemoStatus />

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-4 text-sm font-semibold text-slate-600"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 text-sm text-slate-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CustomModal
          title={selectedJob?.title}
          setModalOpen={setModalOpen}
          label="Job Title"
          primaryBtnTxt="Cancel"
          secondaryBtnTxt="Save Changes"
        />
      )}
    </section>
  );
}

const DemoStatus = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    {[
      { label: "Active Jobs", value: "12", color: "text-emerald-600" },
      { label: "Total Applications", value: "48", color: "text-blue-600" },
      { label: "Pending Reviews", value: "5", color: "text-amber-600" },
    ].map((stat) => (
      <div
        key={stat.label}
        className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm"
      >
        <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
        <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
      </div>
    ))}
  </div>
);
