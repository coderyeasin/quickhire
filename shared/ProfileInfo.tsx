"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { FiCamera, FiUser } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { RegisterInput } from "@/modules/user/UserValidators";
import CustomButton from "./CustomButton";

const inputCls =
  "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-dark-text placeholder:text-slate-400 focus:outline-none focus:border-indigoTags/50 focus:ring-2 focus:ring-indigoTags/10 transition-all bg-white";
const labelCls =
  "block text-xs font-semibold text-primary-gray uppercase tracking-wide mb-1.5";
const errorCls = "text-red-500 text-xs mt-1";

const ProfileForm = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  console.log("User from session:", user);

  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterInput>();

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function onSubmit(data: RegisterInput) {
    console.log("Form submitted with data:", data);
  }

  // const role = user?.role ?? "candidate";
  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "Y";
  const avatarSrc = preview ?? user?.avatar ?? null;

  return (
    <div className="max-w-2xl">
      {status === "loading" ? (
        <p className="animate-pulse">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-dark-text border-b border-slate-100 pb-3 mb-5">
              Profile Photo
            </h3>
            <div className="flex items-center gap-5">
              <div
                className="relative w-20 h-20 rounded-full overflow-hidden bg-indigoTags flex items-center justify-center text-white text-xl font-bold shrink-0 cursor-pointer group"
                onClick={() => fileRef.current?.click()}
              >
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt="avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  initials
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiCamera className="text-white text-lg" />
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-dark-text"
                >
                  Change photo
                </button>
                <p className="text-xs text-primary-gray mt-1.5">
                  JPG, PNG or WebP. Max 5MB.
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-dark-text border-b border-slate-100 pb-3">
              Account Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full Name</label>
                <input
                  {...register("name")}
                  className={inputCls}
                  defaultValue={user?.name}
                  readOnly
                />
                {errors.name && (
                  <p className={errorCls}>{errors.name.message}</p>
                )}
              </div>
              <div>
                <p className={labelCls}>Email</p>
                <p className="text-sm text-dark-text">{user?.email}</p>
              </div>
              <div>
                <p className={labelCls}>Role</p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigoTags/10 text-indigoTags text-xs font-semibold rounded-full capitalize">
                  <FiUser className="text-xs" />
                  {user?.role}
                </span>
              </div>
              <div>
                <p className={labelCls}>Member since</p>
                <p className="text-sm text-dark-text">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {(user?.role === "recruiter" || user?.role === "admin") && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-dark-text border-b border-slate-100 pb-3">
                Company Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Company Name</label>
                  <input
                    {...register("company")}
                    defaultValue={user?.company}
                    placeholder="Acme Corp"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          )}

          <CustomButton
            label=" Save Changes"
            className="flex items-center gap-2 px-6 py-3 bg-indigoTags text-white font-semibold rounded-lg hover:bg-indigoTags/90 transition-all disabled:opacity-60"
          />
        </form>
      )}
    </div>
  );
};
export default ProfileForm;
