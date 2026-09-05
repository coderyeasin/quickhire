"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { FiCamera, FiUser } from "react-icons/fi";
import { useSession } from "next-auth/react";
import {
  UpdateProfileInput,
  updateProfileValidator,
} from "@/modules/user/UserValidators";
import CustomButton from "./CustomButton";
import Spinner from "./Spinner";
import { errorCls, inputCls, labelCls } from "./ApplyForm";

const ProfileForm = () => {
  const { data: session, status } = useSession();
  const user = session?.user;

  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saveState, setSaveState] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    defaultValues: {
      name: "",
      company: "",
      recruiterProfile: {},
    },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name ?? "",
      company: user.company ?? "",
      recruiterProfile: user.recruiterProfile ?? {},
    });
  }, [reset, user]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function onSubmit(data: UpdateProfileInput) {
    setSaveState("Saving...");
    const parsed = updateProfileValidator.safeParse(data);
    if (!parsed.success) {
      setSaveState(parsed.error.issues[0]?.message ?? "Check your profile details");
      return;
    }

    const response = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const result = await response.json();
    setSaveState(
      response.ok ? "Profile saved" : result.message ?? "Could not save profile",
    );
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
        <Spinner />
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
                    placeholder="Acme Corp"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          )}

          {user?.role === "recruiter" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-dark-text">
                    Recruiter Profile
                  </h3>
                  <p className="text-xs text-primary-gray mt-1">
                    Complete these details so candidates know who they are speaking with.
                  </p>
                </div>
                <span className="text-xs font-medium text-indigoTags whitespace-nowrap">
                  10 details
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileField label="Job title" register={register("recruiterProfile.jobTitle")} placeholder="Talent Acquisition Manager" />
                <ProfileField label="Industry" register={register("recruiterProfile.industry")} placeholder="Technology" />
                <ProfileField label="Company size" register={register("recruiterProfile.companySize")} placeholder="51-200 employees" />
                <ProfileField label="Office location" register={register("recruiterProfile.location")} placeholder="New York, NY" />
                <ProfileField label="Phone" register={register("recruiterProfile.phone")} placeholder="+1 555 123 4567" />
                <ProfileField label="Hiring focus" register={register("recruiterProfile.hiringFocus")} placeholder="Engineering and product" />
                <ProfileField label="Company website" register={register("recruiterProfile.companyWebsite")} placeholder="https://company.com" type="url" />
                <ProfileField label="LinkedIn profile" register={register("recruiterProfile.linkedinUrl")} placeholder="https://linkedin.com/in/name" type="url" />
                <div>
                  <label className={labelCls}>Years recruiting</label>
                  <input
                    {...register("recruiterProfile.yearsOfExperience", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="60"
                    placeholder="5"
                    className={inputCls}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Professional bio</label>
                  <textarea
                    {...register("recruiterProfile.bio")}
                    rows={4}
                    maxLength={600}
                    placeholder="Tell candidates about your recruiting experience and what makes your team a great place to work."
                    className={`${inputCls} resize-y`}
                  />
                </div>
              </div>
            </div>
          )}

          <CustomButton
            label={saveState ?? "Save Changes"}
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-indigoTags text-white font-semibold rounded-lg hover:bg-indigoTags/90 transition-all disabled:opacity-60"
          />
          {saveState && saveState !== "Saving..." && (
            <p className="text-sm text-primary-gray">{saveState}</p>
          )}
        </form>
      )}
    </div>
  );
};

function ProfileField({
  label,
  register,
  placeholder,
  type = "text",
}: {
  label: string;
  register: ReturnType<typeof useForm<UpdateProfileInput>>["register"] extends (...args: any[]) => infer R ? R : never;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input {...register} type={type} placeholder={placeholder} className={inputCls} />
    </div>
  );
}
export default ProfileForm;
