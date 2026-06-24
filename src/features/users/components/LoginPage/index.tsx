// @ts-nocheck
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import Button from "../../../../components/ui/Button";
import ForgotPasswordModal from "../ForgotPasswordModal";
import {
  EmailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
} from "../../../../components/ui/icons";
import { useAuthStore } from "../../store/auth.store";
import { authApi } from "../../api/auth.api";
import {
  googleIcon,
  githubIcon,
  facebookIcon,
  socialIconClassName,
} from "../../constants/authImages";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const { setAuth, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login - Devcopet";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect");
      if (!user?.onboardingCompleted) {
        navigate({ to: "/onboarding" });
      } else {
        navigate({ to: redirectUrl || "/course" });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: any) => {
    if (e) e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      setAuth(null, null, response.user);
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect");
      if (!response.user?.onboardingCompleted) {
        navigate({ to: "/onboarding" });
      } else {
        navigate({ to: redirectUrl || "/course" });
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.message)
          ? err?.response?.data?.message[0]
          : null) ||
        err?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam === "social_login_failed") {
      setError("Social login failed. Please try again.");
    }
  }, []);

  const handleSocialLogin = (provider: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

  const handleInputChange = (setter: any) => (e: any) => {
    setter(e?.target?.value);
    if (error) setError("");
  };

  return (
    <>
      <main className="relative w-full min-h-screen bg-surface">
        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col w-full h-full">
          {/* Main content area - centered */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-10 pt-8 pb-8">
            {/* Center - Login form wrapper */}
            <div className="w-full max-w-md flex flex-col items-center gap-8 sm:gap-10">
              {/* Title */}
              <h1 className="font-headline-lg text-headline-lg md:text-[48px] font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary-fixed-dim to-secondary-fixed-dim">
                Login
              </h1>

              {/* Login form card */}
              <div className="w-full bg-on-surface/5 backdrop-blur-xl border border-on-surface/10 rounded-xl p-6 sm:p-8 shadow-[0_0_20px_rgba(0,128,128,0.1)]">
                <form
                  onSubmit={handleLogin}
                  className="flex flex-col gap-6 sm:gap-7"
                >
                  {/* Email field */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm font-normal text-on-surface pl-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-fixed-dim pointer-events-none">
                        <EmailIcon className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleInputChange(setEmail)}
                        placeholder="admin@devcopet.io"
                        required
                        className="w-full pl-11 pr-3 py-2.5 bg-surface/50 border border-on-surface/10 rounded-lg text-base text-on-surface placeholder:text-on-surface/40 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim focus:border-primary-fixed-dim transition-colors"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-row justify-between items-center">
                      <label
                        htmlFor="password"
                        className="text-sm font-normal text-on-surface pl-1"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPasswordOpen(true)}
                        className="text-sm text-on-surface-variant hover:underline hover:text-primary-fixed-dim transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-fixed-dim pointer-events-none">
                        <LockIcon className="w-4 h-4" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleInputChange(setPassword)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-11 pr-11 py-2.5 bg-surface/50 border border-on-surface/10 rounded-lg text-base text-on-surface placeholder:text-on-surface/40 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim focus:border-primary-fixed-dim transition-colors"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-fixed-dim hover:text-on-surface focus:outline-none transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOffIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Login button */}
                  <Button
                    type="submit"
                    text={loading ? "Signing in..." : "Login"}
                    text_font_size="16"
                    className="w-full"
                    layout_width="full"
                    padding="default"
                    position="center"
                    layout_gap="default"
                    margin="none"
                    variant="primary"
                    size="medium"
                    leftIcon={null}
                    rightIcon={null}
                    disabled={loading}
                  />

                  {error ? (
                    <p className="text-sm text-red-400">{error}</p>
                  ) : null}

                  {/* Social login section */}
                  <div className="flex flex-col gap-3">
                    {/* Divider with text */}
                    <div className="flex flex-row items-center gap-4">
                      <div className="flex-1 h-px bg-[#3e49494c]" />
                      <span className="text-xs text-on-surface-variant">
                        or continue with
                      </span>
                      <div className="flex-1 h-px bg-[#3e49494c]" />
                    </div>

                    {/* Social login buttons */}
                    <div className="flex flex-row gap-4 sm:gap-6 justify-center">
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("google")}
                        disabled={loading}
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-on-surface/10 bg-transparent p-3 transition-all duration-200 hover:bg-on-surface/10 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Continue with Google"
                      >
                        <img
                          src={googleIcon}
                          alt=""
                          className={socialIconClassName}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("github")}
                        disabled={loading}
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-on-surface/10 bg-transparent p-3 transition-all duration-200 hover:bg-on-surface/10 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Continue with GitHub"
                      >
                        <img
                          src={githubIcon}
                          alt=""
                          className={`${socialIconClassName} dark:invert-0 invert`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("facebook")}
                        disabled={loading}
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-on-surface/10 bg-transparent p-3 transition-all duration-200 hover:bg-on-surface/10 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Continue with Facebook"
                      >
                        <img
                          src={facebookIcon}
                          alt=""
                          className={socialIconClassName}
                        />
                      </button>
                    </div>

                    {/* Create account link */}
                    <div className="flex flex-col items-center gap-3 mt-2">
                      <Link
                        to="/register"
                        className="flex flex-row items-center gap-1 hover:opacity-80 transition-opacity duration-200"
                        onClick={() => {}}
                      >
                        <span className="text-sm font-medium text-on-surface-variant hover:text-primary-fixed-dim transition-colors">
                          Create an Account
                        </span>
                        <ArrowRight
                          className="w-3 h-3 text-on-surface"
                          strokeWidth={2}
                        />
                      </Link>
                    </div>
                  </div>
                </form>
              </div>

              {/* Terms and privacy */}
              <p className="text-center text-sm text-on-surface-variant max-w-md px-4">
                <span>By continuing, you agree to Devcopet&apos;s </span>
                <a
                  href="/terms"
                  className="text-on-surface opacity-70 hover:underline"
                  onClick={() => {}}
                >
                  Terms of Service
                </a>
                <span> and </span>
                <a
                  href="/privacy"
                  className="text-on-surface opacity-70 hover:underline"
                  onClick={() => {}}
                >
                  Privacy Policy.
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </>
  );
};

export default Login;
