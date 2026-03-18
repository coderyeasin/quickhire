"use client";

import LoginPage from "./Login/Login";
import RegisterPage from "./Register/Register";

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
  setMode: (mode: AuthMode) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center ">
      <div
        className={`${mode === "login" ? "h-120" : "h-150"} w-full max-w-sm rounded-2xl p-6`}
      >
        {mode === "login" ? (
          <LoginPage onSuccess={onClose} />
        ) : (
          <RegisterPage onSuccess={onClose} />
        )}

        {/* Toggle */}
        <div className="text-sm text-center bg-amber-50 py-3 mt-3 rounded-md">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-blue-text font-medium cursor-pointer"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-text font-medium cursor-pointer"
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
