import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import Button from "../../../../components/ui/Button";
import MouseTrail from "../../../../components/ui/MouseTrail";
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
  mascotAxolotl,
  socialIconClassName,
} from "../../constants/authImages";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAuth, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login - Devcopet";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/course" });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      setAuth(response.accessToken, response.refreshToken, response.user);
      navigate({ to: "/course" });
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:3000/auth/${provider}`;
  };

  const handleInputChange = (setter) => (e) => {
    setter(e?.target?.value);
    if (error) setError("");
  };

  return (
    <>
      <MouseTrail />
      <main className="relative w-full min-h-screen bg-surface">
        {/* Background Grid & Streaks */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-1 h-1 bg-white rounded-full top-[10%] left-[20%] opacity-100 blur-[1px]"></div>
            <div className="absolute w-1.5 h-1.5 bg-[#00daf8] rounded-full top-[30%] left-[80%] opacity-100 blur-[2px]"></div>
            <div className="absolute w-1 h-1 bg-[#feb700] rounded-full top-[60%] left-[10%] opacity-100 blur-[1px]"></div>
            <div className="absolute w-2 h-2 bg-white rounded-full top-[80%] left-[70%] opacity-100 blur-[2px]"></div>

            <div className="absolute w-1 h-1 bg-[#00daf8] rounded-full top-[20%] left-[50%] opacity-100 blur-[1px]"></div>
            <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[45%] left-[30%] opacity-80"></div>
            <div className="absolute w-1.5 h-1.5 bg-[#00daf8] rounded-full top-[75%] left-[40%] opacity-90 blur-[1px]"></div>
            <div className="absolute w-1 h-1 bg-white rounded-full top-[90%] left-[85%] opacity-100 blur-[1px]"></div>

            <div className="absolute w-[2px] h-[100px] bg-gradient-to-b from-transparent via-[#00daf8] to-transparent top-[15%] left-[25%] opacity-40 rotate-[25deg]"></div>
            <div className="absolute w-[1px] h-[150px] bg-gradient-to-b from-transparent via-[#feb700] to-transparent top-[55%] left-[75%] opacity-30 rotate-[-15deg]"></div>
          </div>
          <div className="absolute inset-0 digital-grid opacity-20"></div>
        </div>

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
              <div className="w-full bg-surface/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 sm:p-8 shadow-[0_0_20px_rgba(0,218,248,0.1)]">
                <form
                  onSubmit={handleLogin}
                  className="flex flex-col gap-6 sm:gap-7"
                >
                  {/* Email field */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm font-normal text-white pl-1"
                      style={{
                        fontFamily: "Open Sans",
                        fontSize: "14px",
                        lineHeight: "20px",
                      }}
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
                        className="w-full pl-11 pr-3 py-2.5 bg-surface/50 border border-white/10 rounded-lg text-base text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim focus:border-primary-fixed-dim transition-colors"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-row justify-between items-center">
                      <label
                        htmlFor="password"
                        className="text-sm font-normal text-white pl-1"
                        style={{
                          fontFamily: "Open Sans",
                          fontSize: "14px",
                          lineHeight: "20px",
                        }}
                      >
                        Password
                      </label>
                      <a
                        href="/forgot-password"
                        className="text-sm text-white hover:underline hover:text-[#d8bfd8] transition-colors"
                        style={{
                          fontFamily: "Open Sans",
                          fontSize: "14px",
                          lineHeight: "20px",
                        }}
                      >
                        Forgot Password?
                      </a>
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
                        className="w-full pl-11 pr-11 py-2.5 bg-surface/50 border border-white/10 rounded-lg text-base text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim focus:border-primary-fixed-dim transition-colors"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-fixed-dim hover:text-white focus:outline-none transition-colors"
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
                    <p
                      className="text-sm text-red-400"
                      style={{ fontFamily: "Open Sans" }}
                    >
                      {error}
                    </p>
                  ) : null}

                  {/* Social login section */}
                  <div className="flex flex-col gap-3">
                    {/* Divider with text */}
                    <div className="flex flex-row items-center gap-4">
                      <div className="flex-1 h-px bg-[#3e49494c]" />
                      <span
                        className="text-xs text-white"
                        style={{
                          fontFamily: "Open Sans",
                          fontSize: "12px",
                          lineHeight: "17px",
                        }}
                      >
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
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-transparent p-3 transition-all duration-200 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-transparent p-3 transition-all duration-200 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Continue with GitHub"
                      >
                        <img
                          src={githubIcon}
                          alt=""
                          className={socialIconClassName}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("facebook")}
                        disabled={loading}
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-transparent p-3 transition-all duration-200 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span
                          className="text-sm font-medium text-white hover:text-[#d8bfd8] transition-colors"
                          style={{
                            fontFamily: "Roboto",
                            fontSize: "13px",
                            lineHeight: "16px",
                          }}
                        >
                          Create an Account
                        </span>
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </form>
              </div>

              {/* Terms and privacy */}
              <p
                className="text-center text-sm text-white opacity-60 max-w-md px-4"
                style={{
                  fontFamily: "Open Sans",
                  fontSize: "14px",
                  lineHeight: "21px",
                }}
              >
                <span>By continuing, you agree to Devcopet&apos;s </span>
                <a
                  href="/terms"
                  className="text-white opacity-70 hover:underline"
                  onClick={() => {}}
                >
                  Terms of Service
                </a>
                <span> and </span>
                <a
                  href="/privacy"
                  className="text-white opacity-70 hover:underline"
                  onClick={() => {}}
                >
                  Privacy Policy.
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
