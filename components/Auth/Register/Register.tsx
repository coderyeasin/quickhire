"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaGoogle,
  FaBriefcase,
  FaUser,
  FaArrowLeftLong,
} from "react-icons/fa6";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import {
  RegisterInput,
  registerValidator,
} from "@/modules/user/UserValidators";
import { registerAction, googleLoginAction } from "@/actions/auth.actions";

type RoleChoice = "candidate" | "recruiter" | null;

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigoTags/70 transition-all";

export default function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [roleChoice, setRoleChoice] = useState<RoleChoice>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerValidator),
    defaultValues: { role: "candidate" },
  });

  const {
    mutate,
    isPending,
    error: mutationError,
  } = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      if (data.role) formData.append("role", data.role);
      if (data.avatar instanceof FileList && data.avatar.length > 0) {
        formData.append("avatar", data.avatar[0]);
      }

      const res = await registerAction(formData);
      if (!res.success) {
        throw new Error(
          Object.values(res.errors ?? {})[0]?.[0] ?? "Registration failed",
        );
      }
      return { email: data.email, password: data.password, role: data.role };
    },
    onSuccess: async (data) => {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      onSuccess();

      window.location.href = `/${data.role}`;
    },
  });

  function handleRoleSelect(role: "candidate" | "recruiter") {
    setRoleChoice(role);
    setValue("role", role);
  }

  if (!roleChoice) {
    return (
      <div className="space-y-5">
        <div className="space-y-1">
          <p className="text-xs text-white/40 uppercase tracking-widest font-medium">
            Get started
          </p>
          <h2 className="text-xl font-bold text-white">Join as...</h2>
          <p className="text-sm text-white/50">
            Choose how you want to use the platform
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleRoleSelect("candidate")}
            className="group flex flex-col items-center gap-3 p-5 cursor-pointer bg-white/5 hover:bg-indigoTags/15 border border-white/10 hover:border-indigoTags/50 rounded-xl transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-full bg-indigoTags/20 group-hover:bg-indigoTags/30 flex items-center justify-center transition-all">
              <FaUser className="text-indigoTags text-lg" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-sm">Job Seeker</p>
              <p className="text-white/40 text-xs mt-0.5 leading-snug">
                Find your next role
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("recruiter")}
            className="group flex flex-col items-center gap-3 p-5 cursor-pointer bg-white/5 hover:bg-indigoTags/15 border border-white/10 hover:border-indigoTags/50 rounded-xl transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-full bg-indigoTags/20 group-hover:bg-indigoTags/30 flex items-center justify-center transition-all">
              <FaBriefcase className="text-indigoTags text-lg" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-sm">Recruiter</p>
              <p className="text-white/40 text-xs mt-0.5 leading-snug">
                Post jobs & hire
              </p>
            </div>
          </button>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 border-t border-white/10" />
          <span className="text-xs text-white/30">OR</span>
          <div className="flex-1 border-t border-white/10" />
        </div>

        <button
          type="button"
          onClick={() => googleLoginAction("candidate")}
          className="w-full flex items-center justify-center gap-2.5 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium py-2.5 rounded-lg transition-all"
        >
          <FaGoogle />
          Continue with Google
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest font-medium">
            Registering as
          </p>
          <h2 className="text-xl font-bold text-white">
            {roleChoice === "candidate" ? "Job Seeker" : "Recruiter"}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setRoleChoice(null)}
          className="text-md text-white flex justify-between items-center gap-1 cursor-pointer  hover:text-indigoTags transition-colors mt-1 font-medium"
        >
          <FaArrowLeftLong /> Back
        </button>
      </div>

      {mutationError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
          <p className="text-sm text-red-400">{mutationError.message}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="space-y-3"
      >
        <input type="hidden" {...register("role")} />

        <div>
          <input
            {...register("name")}
            placeholder="Full name"
            className={inputCls}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Email address"
            className={inputCls}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">
            Profile photo
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            {...register("avatar")}
            className="w-full text-xs text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-indigoTags/20 file:text-white/30 hover:file:text-white hover:file:bg-indigoTags/30 file:cursor-pointer cursor-pointer"
          />
          {errors.avatar && (
            <p className="text-red-400 text-xs mt-1">
              {errors.avatar.message as string}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className={inputCls}
          />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm password"
            className={inputCls}
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigoTags hover:bg-indigoTags/90 text-white font-semibold py-2.5 rounded-lg cursor-pointer transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
        >
          {isPending && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin " />
          )}
          {isPending ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
