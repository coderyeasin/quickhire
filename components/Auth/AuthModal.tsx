"use client";

import { useEffect, useState } from "react";
import LoginForm from "./Login/Login";
import RegisterForm from "./Register/Register";

export type AuthMode = "login" | "register";

export default function AuthModal({
  isOpen,
  onClose,
  mode,
  setMode,
}: {
  isOpen: boolean;
  onClose: () => void;
  mode: AuthMode;
  setMode: (m: AuthMode) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";

      setVisible(true);
      const t = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(t);
    } else {
      setShow(false);
      const t = setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }, 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!visible) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        backdrop-blur-sm transition-all duration-[250ms] ease-in-out
        ${show ? "bg-black/55 pointer-events-auto" : "bg-black/0 pointer-events-none"}
      `}
    >
      <div
        className={`
          relative w-full max-w-sm transition-all duration-[250ms] ease-in-out
          ${show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2.5"}
        `}
      >
        <div className="bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                mode === "login"
                  ? "text-white border-b-2 border-indigoTags bg-indigoTags/10"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                mode === "register"
                  ? "text-white border-b-2 border-indigoTags bg-indigoTags/10"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-3.5 text-white/30 hover:text-white cursor-pointer transition-colors text-2xl leading-none z-10"
          >
            ✕
          </button>

          {/* Form */}
          <div className="p-6">
            {mode === "login" ? (
              <LoginForm onSuccess={onClose} />
            ) : (
              <RegisterForm onSuccess={onClose} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
import { useEffect } from "react";
import LoginForm from "./Login/Login";
import RegisterForm from "./Register/Register";

export type AuthMode = "login" | "register";

export default function AuthModal({
  isOpen,
  onClose,
  mode,
  setMode,
}: {
  isOpen: boolean;
  onClose: () => void;
  mode: AuthMode;
  setMode: (m: AuthMode) => void;
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-[#0f1117]/50 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                mode === "login"
                  ? "text-white border-b-2 border-indigoTags bg-indigoTags/10"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                mode === "register"
                  ? "text-white border-b-2 border-indigoTags bg-indigoTags/10"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Create Account
            </button>
          </div>

          <button
            onClick={onClose}
            className="absolute right-4 top-3.5 text-white/30 hover:text-white cursor-pointer transition-colors text-2xl leading-none"
          >
            ✕
          </button>

          <div className="p-6">
            {mode === "login" ? (
              <LoginForm onSuccess={onClose} />
            ) : (
              <RegisterForm onSuccess={onClose} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
*/
