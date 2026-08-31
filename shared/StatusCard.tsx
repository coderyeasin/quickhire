interface IStatusCard {
  label: string;
  value: string | number;
  sub?: string;
  color?: "indigo" | "emerald" | "amber" | "red";
  icon?: React.ReactNode;
}

const colorMap = {
  indigo: "text-indigoTags  bg-indigoTags/10",
  emerald: "text-emerald-600 bg-emerald-50",
  amber: "text-amber-600   bg-amber-50",
  red: "text-red-500     bg-red-50",
};

const StatusCard = ({
  label,
  value,
  sub,
  color = "indigo",
  icon,
}: IStatusCard) => {
  const commonCls = colorMap[color];
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-primary-gray font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${commonCls.split(" ")[0]}`}>
            {value}
          </p>
          {sub && <p className="text-xs text-primary-gray mt-1">{sub}</p>}
        </div>
        {icon && (
          <div className={`p-2.5 rounded-lg text-xl ${commonCls}`}>{icon}</div>
        )}
      </div>
    </div>
  );
};
export default StatusCard;
