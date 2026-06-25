import { useState, useRef, useEffect } from "react";
import Button from "../../../../components/ui/Button";
import { authApi } from "../../api/auth.api";
import EmailIcon from "../../../../components/ui/icons/EmailIcon";

type VerifyEmailModalProps = {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onSuccess?: (message: string) => void;
};

const VerifyEmailModal = ({
  isOpen,
  email,
  onClose,
  onSuccess,
}: VerifyEmailModalProps) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setOtp(Array(6).fill(""));
      setMessage("");
      setError("");
      // Autofocus first box
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Focus previous input and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await authApi.verifyEmail(email, code);
      if (onSuccess) {
        onSuccess("Email verified successfully. You can now log in.");
      }
      onClose();
    } catch (err: any) {
      const errMsg = err?.message || "";
      if (errMsg.includes("Invalid or expired verification code")) {
        setError(
          "The code is invalid or expired. Please try again or resend a new code.",
        );
      } else {
        setError(
          errMsg || "Verification failed. Please check the code and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setMessage("");
    setOtp(Array(6).fill(""));
    setLoading(true);

    try {
      const response = await authApi.resendVerificationEmail(email);
      setMessage(response?.message || "Verification code resent successfully!");
      // Auto-focus first input after resending
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setError(
        err?.message ||
          "Failed to resend verification code. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-md transition-opacity duration-300">
      <div className="w-full max-w-md rounded-2xl border border-outline/20 bg-surface-container p-8 shadow-[0_0_40px_rgba(0,186,186,0.18)] transform scale-100 transition-all duration-300 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors text-2xl font-semibold leading-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Email Icon/Visual */}
          <div className="w-16 h-16 rounded-full bg-primary-fixed-dim/10 border border-primary-fixed-dim/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(0,218,248,0.25)]">
            <span className="text-primary-fixed-dim">
              <EmailIcon className="w-8 h-8" />
            </span>
          </div>

          <h2 className="text-2xl font-black text-on-surface mb-2 tracking-wide">
            Verify your email
          </h2>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-fixed-dim mb-4">
            Check your inbox
          </p>

          <p className="text-sm leading-relaxed text-on-surface-variant mb-6">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-on-surface">{email}</span>.
            Enter this code to finish signing up.
          </p>

          {/* 6-Digit OTP Inputs */}
          <div
            className="flex justify-between gap-2 w-full mb-8"
            onPaste={handlePaste}
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
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 rounded-xl border border-outline/30 bg-surface/50 text-center text-xl font-bold text-on-surface outline-none transition focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/30 focus:bg-surface shadow-inner"
                disabled={loading}
              />
            ))}
          </div>

          <div className="w-full flex flex-col gap-4">
            <Button
              type="button"
              onClick={handleVerify}
              disabled={loading || !isOtpComplete}
              text={loading ? "Verifying..." : "Verify Code"}
              layout_width="full"
              className="w-full"
            />

            <button
              type="button"
              onClick={handleResendCode}
              className="text-xs font-semibold text-primary-fixed-dim hover:text-primary transition-colors hover:underline"
              disabled={loading}
            >
              Resend Code
            </button>
          </div>

          {message && (
            <div className="mt-5 w-full p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm font-semibold">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 w-full p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-semibold leading-relaxed">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailModal;
