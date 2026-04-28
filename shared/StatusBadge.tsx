const statusConfig: Record<string, { label: string; cls: string }> = {
  pending: {
    label: "Pending",
    cls: "bg-amber-50   text-amber-600  border-amber-200",
  },
  reviewing: {
    label: "Reviewing",
    cls: "bg-blue-50    text-blue-600   border-blue-200",
  },
  shortlisted: {
    label: "Shortlisted",
    cls: "bg-indigo-50  text-indigoTags border-indigo-200",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-50     text-red-500    border-red-200",
  },
  hired: {
    label: "Hired",
    cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  approved: {
    label: "Approved",
    cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  active: {
    label: "Active",
    cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  closed: {
    label: "Closed",
    cls: "bg-slate-100  text-slate-500  border-slate-200",
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const badge = statusConfig[status.toLowerCase()] ?? {
    label: status,
    cls: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.cls}`}
    >
      {badge.label}
    </span>
  );
}
