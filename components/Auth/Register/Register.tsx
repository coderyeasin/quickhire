"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaFacebook, FaGoogle } from "react-icons/fa6";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  RegisterInput,
  registerValidator,
} from "@/modules/user/UserValidators";
import { useMutation } from "@tanstack/react-query";
import { registerAction } from "@/actions/auth.actions";

const RegisterPage = ({ onSuccess }: { onSuccess: () => void }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerValidator),
    defaultValues: {
      role: "candidate",
    },
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
          Object.values(res.errors ?? {})[0]?.[0] || "Registration failed",
        );
      }
      return {
        ...res,
        email: data.email,
        password: data.password,
        role: data.role,
        avatar: data.avatar,
      };
      // Object.entries(data).forEach(([key, value]) => {
      //   if (value !== undefined) formData.append(key, value as string);
      // });

      // const result = await registerAction(formData);
      // if (!result.success) {
      //   throw new Error(Object.values(result.errors ?? {})[0]?.[0]);
      // }
      // return result;
    },

    onSuccess: async (_, data) => {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: ` /${data.role}`,
      });
    },
  });

  /*
  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    setSuccess(false);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("avatar", data.avatar[0]);
    try {
      // const res = await fetch("/api/auth/register", {
      //   method: "POST",
      //   body: formData,
      // });
      // const result = await res.json();
      // if (!res.ok) {
      //   setServerError(result.error || "Registration failed");
      //   return;
      // }
      // setSuccess(true);
      console.log("reg-data", data);

      // await signIn("credentials", {
      //   email: data.email,
      //   password: data.password,
      //   redirect: false,
      // });
      // router.push("/");
    } catch (e) {
      console.log(setServerError(e));
    }
  };
 */
  const commonCls =
    "mt-3 w-full border-0 outline-0 bg-indigoTags/30 rounded-md px-3 py-1 text-white";
  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="w-full bg-indigoTags/10 p-6 rounded-xl shadow relative"
      >
        <h3 className="text-2xl font-semibold text-center mb-6 text-primary-gray">
          Create an Account
        </h3>
        <button
          onClick={onSuccess}
          className="absolute right-6 top-4 text-3xl text-second-gray hover:text-third-gray cursor-pointer"
        >
          ✕
        </button>
        {mutationError && (
          <p className="error text-red-400 text-center">
            {mutationError.message}
          </p>
        )}
        {isPending && (
          <p className="text-green-400 text-center">
            Registration successful! Redirecting...
          </p>
        )}

        {/* Name */}
        <input {...register("name")} placeholder="Name" className={commonCls} />
        {errors.name && <p className="error">{errors.name.message}</p>}

        {/* Email */}
        <input
          {...register("email")}
          placeholder="Email"
          className={commonCls}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        {/* profileImg */}
        <input
          type="file"
          accept="image/*"
          {...register("avatar")}
          className={commonCls}
        />
        {errors.avatar && (
          <p className="error">{errors.avatar.message as string}</p>
        )}

        {/* Password */}
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className={commonCls}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        {/* Confirm Password */}
        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm Password"
          className={commonCls}
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message}</p>
        )}

        <button
          disabled={isPending}
          className="mt-5 w-full bg-indigoTags text-white py-2 rounded-md cursor-pointer"
        >
          {isPending ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-center text-2xl font-bold">OR</p>

        <div className="flex flex-col lg:flex-row items-center gap-5">
          <button
            type="button"
            className="mt-4 w-full cursor-pointer bg-indigoTags text-white py-2 rounded-md flex items-center justify-center gap-2"
            // onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FaGoogle />
            Google
          </button>
          <button
            type="button"
            className="mt-4 w-full cursor-pointer bg-indigoTags text-white py-2 rounded-md flex items-center justify-center gap-2"
            // onClick={() => signIn("facebook", { callbackUrl: "/" })}
          >
            <FaFacebook />
            Facebook
          </button>
        </div>
        {/* <Link href="/login" className="mt-4 text-center text-sm block">
          Already have an account?{" "}
          <span className="text-teal-300 font-semibold">Login</span>
        </Link> */}
      </form>
    </div>
  );
};

export default RegisterPage;
