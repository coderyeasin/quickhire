"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import {
  RegisterInput,
  registerValidator,
} from "@/modules/user/UserValidators";
import { registerAction } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import RoleSelector from "./RoleSelector";
import RegisterFields from "./RegisterFields";

type RoleChoice = "candidate" | "recruiter" | null;

export default function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();
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
      router.push(`/${data.role}`);
    },
  });

  function handleRoleSelect(role: "candidate" | "recruiter") {
    setRoleChoice(role);
    setValue("role", role);
  }

  if (!roleChoice) {
    return <RoleSelector onSelect={handleRoleSelect} />;
  }

  return (
    <section>
      <form onSubmit={handleSubmit((data) => mutate(data))}>
        <input type="hidden" {...register("role")} />

        <RegisterFields
          variant="register"
          register={register}
          errors={errors}
          isPending={isPending}
          errorMessage={mutationError?.message}
          role={roleChoice}
          onBack={() => setRoleChoice(null)}
          submitLabel="Create Account"
          pendingLabel="Creating account..."
        />
      </form>
    </section>
  );
}
