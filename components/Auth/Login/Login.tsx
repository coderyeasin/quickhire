"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle } from "react-icons/fa6";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { LoginInput, loginValidator } from "@/modules/user/UserValidators";
import { googleLoginAction } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import RegisterFields from "../Register/RegisterFields";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();
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

      router.push(`/${role}`);
    },
  });

  return (
    <section className="space-y-5">
      <div className="space-y-1 text-center">
        <p className="text-xs text-white/40 uppercase tracking-widest font-medium">
          Welcome back
        </p>
        <h2 className="text-xl font-bold text-white">
          Sign in to your account
        </h2>
      </div>
      <form onSubmit={handleSubmit((data) => mutate(data))}>
        <RegisterFields
          variant="login"
          register={register}
          errors={errors}
          isPending={isPending}
          errorMessage={mutationError?.message}
          submitLabel="Sign In"
          pendingLabel="Signing in..."
        />
      </form>

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
}
