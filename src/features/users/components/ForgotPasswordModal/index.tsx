import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Button from "src/components/ui/Button";
import { changePassword, retryPassword } from "src/features/users/api/auth.api";

type ForgotPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devResetCode, setDevResetCode] = useState("");
  const closeTimerRef = useRef<number | null>(null);

  const resetState = useCallback(() => {
    setStep(1);
    setEmail("");
    setCode("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
    setError("");
    setDevResetCode("");
    setLoading(false);
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }

    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [isOpen, resetState]);

  if (!isOpen) return null;

  const handleSendCode = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setDevResetCode("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await retryPassword(email.trim());
      setMessage(
        response?.message ||
          "A reset code has been sent if the email exists. In development, check the backend terminal for the OTP code.",
      );
      if (response?.devResetCode) {
        setDevResetCode(response.devResetCode);
      }
      setStep(2);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not send reset code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(code.trim())) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        email: email.trim(),
        code: code.trim(),
        password,
        confirmPassword,
      });
      setMessage(
        "Password changed successfully. Returning you to the login form...",
      );
      setCode("");
      setPassword("");
      setConfirmPassword("");
      closeTimerRef.current = window.setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not change password. Please check the code and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-on-surface/10 bg-surface-container p-6 shadow-[0_0_40px_rgba(0,128,128,0.18)]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-primary-fixed-dim">
              Account Recovery
            </p>
            <h2 className="text-2xl font-bold text-on-surface">
              Forgot password
            </h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
              {step === 1
                ? "Enter your email address. We will send a 6-digit reset code."
                : "Enter the reset code and choose a new password."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg px-2 py-1 text-xl text-on-surface-variant hover:bg-on-surface/10 hover:text-on-surface"
            aria-label="Close forgot password modal"
          >
            ×
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 text-xs font-bold uppercase tracking-[0.18em]">
          <div
            className={`rounded-lg border px-3 py-2 ${step === 1 ? "border-primary-fixed-dim text-primary-fixed-dim" : "border-on-surface/10 text-on-surface-variant"}`}
          >
            1. Email
          </div>
          <div
            className={`rounded-lg border px-3 py-2 ${step === 2 ? "border-primary-fixed-dim text-primary-fixed-dim" : "border-on-surface/10 text-on-surface-variant"}`}
          >
            2. Reset
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm text-on-surface">
              Email address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-lg border border-on-surface/10 bg-surface/60 px-4 py-3 text-on-surface outline-none transition focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/40"
                disabled={loading}
              />
            </label>

            <Button
              type="submit"
              text={loading ? "Sending code..." : "Send reset code"}
              layout_width="full"
              className="w-full"
              disabled={loading}
            />
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm text-on-surface">
              Reset code
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6-digit code"
                autoComplete="one-time-code"
                className="w-full rounded-lg border border-on-surface/10 bg-surface/60 px-4 py-3 text-on-surface outline-none transition focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/40"
                disabled={loading}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-on-surface">
              New password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className="w-full rounded-lg border border-on-surface/10 bg-surface/60 px-4 py-3 text-on-surface outline-none transition focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/40"
                disabled={loading}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-on-surface">
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-on-surface/10 bg-surface/60 px-4 py-3 text-on-surface outline-none transition focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/40"
                disabled={loading}
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                text="Back"
                variant="secondary"
                className="w-full"
                layout_width="full"
                disabled={loading}
                onClick={() => setStep(1)}
              />
              <Button
                type="submit"
                text={loading ? "Changing..." : "Change password"}
                className="w-full"
                layout_width="full"
                disabled={loading}
              />
            </div>
          </form>
        )}

        {devResetCode ? (
          <div className="mt-4 rounded-lg border border-primary-fixed-dim/30 bg-primary-fixed-dim/10 px-4 py-3 text-sm text-on-surface">
            Dev reset code:{" "}
            <span className="font-mono font-bold text-primary-fixed-dim">
              {devResetCode}
            </span>
          </div>
        ) : null}

        {message ? (
          <p className="mt-4 text-sm text-primary-fixed-dim">{message}</p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
