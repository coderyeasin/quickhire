import { googleLoginAction } from "@/actions/auth.actions";
import { FaGoogle, FaBriefcase, FaUser } from "react-icons/fa6";

type RoleChoice = "candidate" | "recruiter";

const roleCards = [
  {
    role: "candidate" as RoleChoice,
    label: "Job Seeker",
    sub: "Find your next role",
    icon: FaUser,
  },
  {
    role: "recruiter" as RoleChoice,
    label: "Recruiter",
    sub: "Post jobs & hire",
    icon: FaBriefcase,
  },
];
const RoleSelector = ({
  onSelect,
}: {
  onSelect: (role: RoleChoice) => void;
}) => {
  return (
    <section className="space-y-5">
      <div className="space-y-1 text-center">
        <p className="text-xs text-white/40 uppercase tracking-widest font-medium">
          Get started
        </p>
        <h2 className="text-xl font-bold text-white">Join as...</h2>
        <p className="text-sm text-white/50">
          Choose how you want to use the platform
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {roleCards.map(({ role, label, sub, icon: Icon }) => (
          <button
            key={role}
            type="button"
            onClick={() => onSelect(role)}
            className="group flex flex-col items-center gap-3 p-5 cursor-pointer bg-white/5 hover:bg-indigoTags/15 border border-white/10 hover:border-indigoTags/50 rounded-xl transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-full bg-indigoTags/20 group-hover:bg-indigoTags/30 flex items-center justify-center transition-all">
              <Icon className="text-indigoTags text-lg" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-sm">{label}</p>
              <p className="text-white/40 text-xs mt-0.5 leading-snug">{sub}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="relative flex items-center gap-3">
        <div className="flex-1 border-t border-white/10" />
        <span className="text-xs text-white/30">OR</span>
        <div className="flex-1 border-t border-white/10" />
      </div>

      <button
        type="button"
        disabled
        onClick={() => googleLoginAction("candidate")}
        className="w-full flex items-center justify-center gap-2.5 cursor-not-allowed bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium py-2.5 rounded-lg transition-all"
      >
        <FaGoogle />
        Continue with Google
      </button>
    </section>
  );
};

export default RoleSelector;
