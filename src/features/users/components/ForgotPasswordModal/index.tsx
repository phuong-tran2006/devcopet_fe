import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Button from "../../../../components/ui/Button";
import {
  changePassword,
  retryPassword,
  verifyResetCode,
} from "../../api/auth.api";

type ForgotPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devResetCode, setDevResetCode] = useState("");
  const closeTimerRef = useRef<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const resetState = useCallback(() => {
    setStep(1);
    setEmail("");
    setOtp(Array(6).fill(""));
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

  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

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

  const handleOtpChange = (value: string, index: number) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyCode = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const codeStr = otp.join("");
    if (!/^\d{6}$/.test(codeStr)) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyResetCode(email.trim(), codeStr);
      setMessage(
        response?.message ||
          "Code verified successfully. Please set your new password.",
      );
      setStep(3);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not verify code. Please check the code and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const codeStr = otp.join("");
    if (!/^\d{6}$/.test(codeStr)) {
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
        code: codeStr,
        newPassword: password,
        confirmPassword,
      });
      setMessage(
        "Password changed successfully. Returning you to the login form...",
      );
      setOtp(Array(6).fill(""));
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
                : step === 2
                  ? "Enter the 6-digit reset code sent to your email."
                  : "Enter your new password to reset your account."}
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

        <div className="mb-6 grid grid-cols-3 gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.18em] text-center">
          <div
            className={`rounded-lg border px-2 py-2 ${step === 1 ? "border-primary-fixed-dim text-primary-fixed-dim" : "border-on-surface/10 text-on-surface-variant"}`}
          >
            1. Email
          </div>
          <div
            className={`rounded-lg border px-2 py-2 ${step === 2 ? "border-primary-fixed-dim text-primary-fixed-dim" : "border-on-surface/10 text-on-surface-variant"}`}
          >
            2. Verify
          </div>
          <div
            className={`rounded-lg border px-2 py-2 ${step === 3 ? "border-primary-fixed-dim text-primary-fixed-dim" : "border-on-surface/10 text-on-surface-variant"}`}
          >
            3. Reset
          </div>
        </div>

        {step === 1 && (
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
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-on-surface">Reset code</span>
              <div
                className="flex justify-between gap-2 w-full"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="w-12 h-14 rounded-xl border border-on-surface/10 bg-surface/50 text-center text-xl font-bold text-on-surface outline-none transition focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/30 focus:bg-surface shadow-inner"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

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
                text={loading ? "Verifying..." : "Verify code"}
                className="w-full"
                layout_width="full"
                disabled={loading || !otp.every((digit) => digit !== "")}
              />
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
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
                onClick={() => setStep(2)}
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
