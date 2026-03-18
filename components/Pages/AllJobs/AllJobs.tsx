"use client";
import AuthModal from "@/components/Auth/AuthModal";
import React, { useState } from "react";

const AllJobs = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  return (
    <section className="container-layout h-screen w-full py-10">
      <div>AllJobs</div>
      <div className="text-3xl bg-amber-700 border-2 flex gap-9">
        <button
          onClick={() => {
            setMode("login");
            setOpen(true);
          }}
        >
          Login
        </button>

        <button
          onClick={() => {
            setMode("register");
            setOpen(true);
          }}
        >
          Sign Up
        </button>

        <AuthModal
          isOpen={open}
          onClose={() => setOpen(false)}
          defaultMode={mode}
        />
      </div>
    </section>
  );
};

export default AllJobs;
