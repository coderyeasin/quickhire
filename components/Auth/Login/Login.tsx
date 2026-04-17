"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaFacebook, FaGoogle } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { LoginInput, loginValidator } from "@/modules/user/UserValidators";
import { useMutation } from "@tanstack/react-query";
import { googleLoginAction } from "@/actions/auth.actions";

const LoginPage = ({ onSuccess }: { onSuccess: () => void }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginValidator),
  });
  // const [serverError, setServerError] = useState<string | null>(null);
  // const searchParams = useSearchParams();

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
      if (result?.error) {
        throw new Error(result.error || "Login failed");
      }
      return result;
    },
    onSuccess: () => {
      router.refresh();
      router.push("/");
    },
  });

  /** 
  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      //   const res = await signIn("credentials", {
      //     email: data.email,
      //     password: data.password,
      //     redirect: true,
      //     callbackUrl: callbackUrl,
      //   });
      //   if (res?.error) {
      //     setServerError(res.error || "Login failed");
      //     return;
      //   }
      console.log(data);
    } catch (error) {
      setServerError(error.message || "Something went wrong");
    }
  };
  
  */
  const commonCls =
    "mt-3 w-full border-0 outline-0 bg-indigoTags/30 rounded-md px-3 py-1 text-white";
  return (
    <div className="flex items-center justify-center ">
      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="w-full bg-indigoTags/10 p-6 rounded-xl shadow relative"
      >
        <h3 className="text-2xl font-semibold text-center mb-6 text-primary-gray">
          Login to your account
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

        <input
          {...register("email")}
          placeholder="Email"
          className={commonCls}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className={commonCls}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button
          disabled={isPending}
          className={
            "mt-5 w-full cursor-pointer bg-indigoTags text-white py-2 rounded-md flex items-center justify-center gap-2 " +
            (isPending ? "opacity-60 cursor-not-allowed" : "")
          }
        >
          {isPending && (
            <span className="loader border-2 border-t-2 border-t-white border-white/30 rounded-full w-4 h-4 mr-2 animate-spin"></span>
          )}
          {isPending ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-2xl font-bold">OR</p>

        <div className="flex flex-col lg:flex-row items-center gap-5">
          <button
            type="button"
            className="mt-4 w-full cursor-pointer bg-indigoTags text-white py-2 rounded-md flex items-center justify-center gap-2"
            onClick={() => googleLoginAction()}
          >
            <FaGoogle />
            Google
          </button>
          <button
            type="button"
            className="mt-4 w-full cursor-pointer bg-indigoTags text-white py-2 rounded-md flex items-center justify-center gap-2"
            // onClick={() => signIn("facebook", { callbackUrl })}
          >
            <FaFacebook />
            Facebook
          </button>
        </div>
        {/* <Link href="/register" className="mt-4 text-center text-sm block">
          Do not have an account?
          <span className="text-teal-300 font-semibold">Register</span>
        </Link> */}
      </form>
    </div>
  );
};

export default LoginPage;
