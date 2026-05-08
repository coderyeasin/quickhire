"use client";

import LoginForm from "@/components/Auth/Login/Login";
import RegisterForm from "@/components/Auth/Register/Register";
import JobsInfo from "@/components/Dashboard/JobsInfo";
import WholeApplication from "@/components/Dashboard/WholeApplication";
import { Dialog, DialogContent } from "@/components/Shadcn/dialog";
import { ModalType } from "@/types/types";

export default function Modal({
  open,
  onOpenChange,
  mode,
  setMode,
  jobId,
  applicantsId,
}: ModalType) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {mode === "jobs" ? (
        <DialogContent className="sm:max-w-sm p-0 bg-white [&>button]:text-slate-700 [&>button]:hover:text-slate-700/70 [&>button]:right-4 [&>button]:top-3.5 [&>button]:cursor-pointer">
          <JobsInfo jobId={jobId} />
        </DialogContent>
      ) : mode === "applicants" ? (
        <DialogContent className="sm:max-w-sm p-0 bg-white [&>button]:text-slate-700 [&>button]:hover:text-slate-700/70 [&>button]:right-6 [&>button]:top-6 [&>button]:cursor-pointer">
          <WholeApplication applicantsId={applicantsId} />
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-sm p-0 bg-[#0f1117]/90 border-white/10 [&>button]:text-white/30 [&>button]:hover:text-white [&>button]:right-4 [&>button]:top-3.5 [&>button]:cursor-pointer">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                mode === "login"
                  ? "text-white border-b-2 border-indigoTags bg-indigoTags/10"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                mode === "register"
                  ? "text-white border-b-2 border-indigoTags bg-indigoTags/10"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-6">
            {mode === "login" ? (
              <LoginForm onSuccess={() => onOpenChange(false)} />
            ) : (
              <RegisterForm onSuccess={() => onOpenChange(false)} />
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
