"use client";

import { useState } from "react";
import LoginPage from "./Login/Login";
import RegisterPage from "./Register/Register";

type AuthMode = "login" | "register";

export default function AuthModal({
  isOpen,
  onClose,
  defaultMode = "login",
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
}) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-14 text-amber-600 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-[var(--color-dark-text)] mb-4">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        {/* Forms */}
        {mode === "login" ? <LoginPage /> : <RegisterPage />}

        {/* Toggle */}
        <div className="text-sm mt-4 text-center">
          {mode === "login" ? (
            <>
              Do not have an account?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-[var(--color-blue-text)] font-medium"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-[var(--color-blue-text)] font-medium"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
