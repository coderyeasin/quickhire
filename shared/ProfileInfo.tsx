"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import { useMe, useUpdateMe } from "@/hooks/useProfile";
import Image from "next/image";
import { FiCamera, FiUser } from "react-icons/fi";
import PageHeader from "./PageHeader";
import { useSession } from "next-auth/react";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  bio: z.string().max(300).optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  // candidate
  skills: z.string().optional(),
  // recruiter / admin
  company: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

const inputCls =
  "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-dark-text placeholder:text-slate-400 focus:outline-none focus:border-indigoTags/50 focus:ring-2 focus:ring-indigoTags/10 transition-all bg-white";
const labelCls =
  "block text-xs font-semibold text-primary-gray uppercase tracking-wide mb-1.5";
const errorCls = "text-red-500 text-xs mt-1";

export default function ProfileForm() {
  //   const { data: user, isLoading } = useMe();
  //   const updateMe  = useUpdateMe();
  const { data: session } = useSession();
  const user = session?.user;
  //   console.log("User from session:", session);
  //   console.log("User from session:", user);

  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Populate form when user loads
  //   useEffect(() => {
  //     if (!user) return;
  //     reset({
  //       name:     user.name     ?? "",
  //       bio:      user.bio      ?? "",
  //       location: user.location ?? "",
  //       phone:    user.phone    ?? "",
  //       skills:   (user.skills ?? []).join(", "),
  //       company:  user.company  ?? "",
  //       website:  user.website  ?? "",
  //     });
  //   }, [user, reset]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function onSubmit(data: FormData) {
    // const fd = new FormData();
    // fd.append("name",     data.name);
    // if (data.bio)      fd.append("bio",      data.bio);
    // if (data.location) fd.append("location", data.location);
    // if (data.phone)    fd.append("phone",    data.phone);
    // if (data.skills)   fd.append("skills",   data.skills);
    // if (data.company)  fd.append("company",  data.company);
    // if (data.website)  fd.append("website",  data.website);
    // if (avatarFile)    fd.append("avatar",   avatarFile);
    // updateMe.mutate(fd);
    console.log("Form submitted with data:", data);
  }

  const role = user?.role ?? "candidate";
  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";
  const avatarSrc = preview ?? user?.avatar ?? null;

  //   if (isLoading) {
  //     return (
  //       <div className="space-y-4 max-w-2xl">
  //         {Array.from({ length: 6 }).map((_, i) => (
  //           <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
  //         ))}
  //       </div>
  //     );
  //   }

  return (
    <div className="max-w-2xl">
      <PageHeader title="My Profile" sub="Keep your information up to date" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Avatar card */}
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
              {/* Hover overlay */}
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

        {/* Basic info */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-dark-text border-b border-slate-100 pb-3">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full Name</label>
              <input {...register("name")} className={inputCls} />
              {errors.name && <p className={errorCls}>{errors.name.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input
                {...register("location")}
                placeholder="City, Country"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Phone</label>
            <input
              {...register("phone")}
              placeholder="+880 ..."
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Bio</label>
            <textarea
              {...register("bio")}
              rows={3}
              placeholder="Tell us a bit about yourself..."
              className={`${inputCls} resize-none`}
            />
            {errors.bio && <p className={errorCls}>{errors.bio.message}</p>}
          </div>
        </div>

        {/* Role-specific fields */}
        {role === "candidate" && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-dark-text border-b border-slate-100 pb-3">
              Skills
            </h3>
            <div>
              <label className={labelCls}>Your Skills</label>
              <input
                {...register("skills")}
                placeholder="React, TypeScript, Node.js, MongoDB..."
                className={inputCls}
              />
              <p className="text-xs text-primary-gray mt-1">
                Comma separated — these are matched against job requirements
              </p>
            </div>
            {/* Skills preview chips */}
            {user?.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-indigoTags/10 text-indigoTags text-xs font-medium rounded-full border border-indigoTags/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {(role === "recruiter" || role === "admin") && (
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
              <div>
                <label className={labelCls}>Website</label>
                <input
                  {...register("website")}
                  placeholder="https://..."
                  className={inputCls}
                />
                {errors.website && (
                  <p className={errorCls}>{errors.website.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Read-only info */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-dark-text border-b border-slate-100 pb-3">
            Account Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <button
          type="submit"
          //   disabled={updateMe.isPending}
          className="flex items-center gap-2 px-6 py-3 bg-indigoTags text-white font-semibold rounded-lg hover:bg-indigoTags/90 transition-all disabled:opacity-60"
        >
          {/* {updateMe.isPending && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {updateMe.isPending ? "Saving..." : "Save Changes"} */}
          Save Changes
        </button>
      </form>
    </div>
  );
}
