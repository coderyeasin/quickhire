"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle } from "react-icons/fa6";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { LoginInput, loginValidator } from "@/modules/user/UserValidators";
import { googleLoginAction } from "@/actions/auth.actions";

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigoTags/70 transition-all";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginValidator),
  });

  const {
    mutate,
    isPending,
    error: mutationError,
  } = useMutation({
    mutationFn: async (data: LoginInput) => {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) throw new Error("Invalid email or password");
      return result;
    },
    onSuccess: async () => {
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      const role = session?.user?.role ?? "candidate";

      onSuccess();
      window.location.href = `/${role}`;
    },
  });

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <p className="text-xs text-white/40 uppercase tracking-widest font-medium">
          Welcome back
        </p>
        <h2 className="text-xl font-bold text-white">
          Sign in to your account
        </h2>
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

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigoTags hover:bg-indigoTags/90 text-white cursor-pointer font-semibold py-2.5 rounded-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
        >
          {isPending && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 border-t border-white/10" />
        <span className="text-xs text-white/30">OR</span>
        <div className="flex-1 border-t border-white/10" />
      </div>

      <button
        type="button"
        onClick={() => googleLoginAction()}
        className="w-full flex items-center justify-center gap-2.5 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium py-2.5 rounded-lg transition-all"
      >
        <FaGoogle />
        Continue with Google
      </button>
    </div>
  );
}
