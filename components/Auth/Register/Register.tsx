"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaFacebook, FaGoogle } from "react-icons/fa6";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerValidation } from "./RegisterValidators";

type RegisterFormData = z.infer<typeof registerValidation>;

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerValidation),
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    setSuccess(false);
    // const formData = new FormData();
    // formData.append("name", data.name);
    // formData.append("email", data.email);
    // formData.append("password", data.password);
    // formData.append("confirmPassword", data.confirmPassword);
    // formData.append("profileImg", data.profileImg[0]);
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
      console.log("data", data);

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
  const commonCls = "mt-3 w-full border-0 outline-0 bg-teal-500/30";
  return (
    <div className="min-h-screen flex items-start justify-center pt-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-teal-900 p-6 rounded-xl shadow"
      >
        <h3 className="text-2xl font-semibold text-center mb-6">
          Create an Account
        </h3>
        {serverError && (
          <p className="error text-red-400 text-center">{serverError}</p>
        )}
        {success && (
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
          {...register("profileImg")}
          className={commonCls}
        />
        {errors.profileImg && (
          <p className="error">{errors.profileImg.message as string}</p>
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
          disabled={isSubmitting}
          className="mt-5 w-full bg-teal-950 py-2 rounded-md cursor-pointer"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-center text-2xl font-bold">OR</p>

        <div className="flex flex-col lg:flex-row items-center gap-5">
          <button
            type="button"
            className="mt-4 w-full cursor-pointer bg-teal-600 py-2 rounded-md flex items-center justify-center gap-2"
            // onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FaGoogle />
            Google
          </button>
          <button
            type="button"
            className="mt-4 w-full cursor-pointer bg-teal-600 py-2 rounded-md flex items-center justify-center gap-2"
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
