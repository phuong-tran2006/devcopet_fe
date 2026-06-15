import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import Button from "../../../../components/ui/Button";
import EditText from "../../../../components/ui/EditText";
import Dropdown from "../../../../components/ui/Dropdown";
import CheckBox from "../../../../components/ui/CheckBox";
import EmailProviderIcon from "../../../../components/ui/EmailProviderIcon";
import MouseTrail from "../../../../components/ui/MouseTrail";
import { EmailIcon, LockIcon } from "../../../../components/ui/icons";
import { useAuthStore } from "../../store/auth.store";
import { authApi } from "../../api/auth.api";
import {
  googleIcon,
  githubIcon,
  facebookIcon,
  socialIconClassName,
} from "../../constants/authImages";
import mascotVideo from "../../../../assets/videos/7936438193787.mp4";
import TransparentVideo from "../../../../components/ui/TransparentVideo";
const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    dateOfBirth: "",
    codingExperience: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { setAuth, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Create account | Devcopet Learn";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/course" });
    }
  }, [isAuthenticated, navigate]);

  const codingExperienceLevels = useMemo(
    () => [
      { label: "Beginner - Just starting out", value: "beginner" },
      { label: "Intermediate - Some experience", value: "intermediate" },
      { label: "Advanced - Several years experience", value: "advanced" },
      { label: "Expert - Professional developer", value: "expert" },
    ],
    [],
  );

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: e?.target?.checked,
    }));
    if (errors.agreeToTerms) {
      setErrors((prev) => ({ ...prev, agreeToTerms: "" }));
    }
  };

  const handleSubmit = async (e: any) => {
    e?.preventDefault();
    const nextErrors: any = {};
    if (!formData?.fullName?.trim())
      nextErrors.fullName = "Full name is required.";
    if (!formData?.username?.trim())
      nextErrors.username = "Username is required.";
    if (formData?.username?.trim() && formData.username.length < 3) {
      nextErrors.username = "Username must be at least 3 characters.";
    }
    if (!formData?.dateOfBirth)
      nextErrors.dateOfBirth = "Date of birth is required.";
    if (!formData?.codingExperience)
      nextErrors.codingExperience = "Select your experience level.";
    if (!formData?.email?.trim()) nextErrors.email = "Email is required.";
    if (
      formData?.email?.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!formData?.password) nextErrors.password = "Password is required.";
    if (formData?.password && formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }
    if (formData?.confirmPassword !== formData?.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData?.agreeToTerms)
      nextErrors.agreeToTerms = "You must agree to continue.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await authApi.register({
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
      });

      setSuccessMessage("Account created successfully! Redirecting...");

      if (response.accessToken) {
        setAuth(response.accessToken, response.refreshToken, response.user);
        setTimeout(() => navigate({ to: "/course" }), 1500);
      } else {
        setTimeout(() => navigate({ to: "/login" }), 1500);
      }
    } catch (err: any) {
      setErrors({
        submit: err?.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    window.location.href = `http://localhost:3000/auth/${provider}`;
  };

  return (
    <>
      <MouseTrail />
      <main className="relative min-h-screen w-full flex items-center justify-center bg-surface">
        {/* Background Grid & Streaks */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-1 h-1 bg-white rounded-full top-[10%] left-[20%] opacity-100 blur-[1px]"></div>
            <div className="absolute w-1.5 h-1.5 bg-primary-fixed-dim rounded-full top-[30%] left-[80%] opacity-100 blur-[2px]"></div>
            <div className="absolute w-1 h-1 bg-[#D8BFD8] rounded-full top-[60%] left-[10%] opacity-100 blur-[1px]"></div>
            <div className="absolute w-2 h-2 bg-white rounded-full top-[80%] left-[70%] opacity-100 blur-[2px]"></div>

            <div className="absolute w-1 h-1 bg-primary-fixed-dim rounded-full top-[20%] left-[50%] opacity-100 blur-[1px]"></div>
            <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[45%] left-[30%] opacity-80"></div>
            <div className="absolute w-1.5 h-1.5 bg-primary-fixed-dim rounded-full top-[75%] left-[40%] opacity-90 blur-[1px]"></div>
            <div className="absolute w-1 h-1 bg-white rounded-full top-[90%] left-[85%] opacity-100 blur-[1px]"></div>

            <div className="absolute w-[2px] h-[100px] bg-gradient-to-b from-transparent via-primary/30 to-transparent top-[15%] left-[25%] opacity-40 rotate-[25deg]"></div>
            <div className="absolute w-[1px] h-[150px] bg-gradient-to-b from-transparent via-[#D8BFD8] to-transparent top-[55%] left-[75%] opacity-30 rotate-[-15deg]"></div>
          </div>
          <div className="absolute inset-0 digital-grid opacity-20"></div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
            {/* Left Section - Hero Content */}
            <section className="w-full lg:w-[26%] flex flex-col items-center lg:items-start gap-6 sm:gap-8 lg:gap-12">
              {/* Mascot & Welcome Message */}
              <div className="w-full flex flex-col items-center lg:items-start gap-6 sm:gap-8 lg:gap-12 px-4 sm:px-6 lg:px-0">
                <div className="relative w-full max-w-[352px] flex items-end justify-center lg:justify-start">
                  <TransparentVideo
                    src={mascotVideo}
                    className="h-auto w-48 object-contain sm:w-56 md:w-64 lg:w-72"
                    keyColor={[0, 200, 0]}
                    tolerance={80}
                  />
                </div>

                {/* Hero Text */}
                <div className="flex flex-col gap-3 text-center lg:text-left px-4 sm:px-6">
                  <h1 className="font-headline-lg text-headline-lg md:text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-fixed-dim to-secondary-fixed-dim">
                    Start Your
                    <br />
                    Adventure
                  </h1>
                  <p className="text-sm sm:text-base font-normal leading-6 text-on-surface-variant">
                    Begin your evolution from a fledgling script-kiddie to a
                    <br className="hidden sm:inline" />
                    legendary architect in the Devcopet ecosystem.
                  </p>
                </div>
              </div>
            </section>

            {/* Right Section - Registration Form */}
            <section className="w-full lg:w-[52%] flex items-center justify-center">
              <div className="w-full max-w-[570px] bg-on-surface/5 backdrop-blur-xl border border-on-surface/10 rounded-xl shadow-[0_0_20px_rgba(0,128,128,0.1)] overflow-hidden">
                {/* Form Content */}
                <div className="px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    {/* Form Fields Container */}
                    <div className="flex flex-col gap-4">
                      {/* Full Name & Username Row */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full flex flex-col gap-1">
                          <label className="text-sm font-normal text-on-surface pl-1">
                            Full Name
                          </label>
                          <EditText
                            name="fullName"
                            placeholder="John Doe"
                            value={formData?.fullName}
                            onChange={handleInputChange}
                            required
                            id="fullName"
                            error={errors?.fullName}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                          <label className="text-sm font-normal text-on-surface pl-1">
                            Username
                          </label>
                          <EditText
                            name="username"
                            placeholder="dev_hero_99"
                            value={formData?.username}
                            onChange={handleInputChange}
                            required
                            id="username"
                            error={errors?.username}
                          />
                        </div>
                      </div>

                      {/* Date of Birth & Coding Experience Row */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full flex flex-col gap-1">
                          <label className="text-sm font-normal text-on-surface pl-1">
                            Date of Birth
                          </label>
                          <EditText
                            name="dateOfBirth"
                            type="date"
                            value={formData?.dateOfBirth}
                            onChange={handleInputChange}
                            required
                            id="dateOfBirth"
                            error={errors?.dateOfBirth}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                          <label className="text-sm font-normal text-on-surface pl-1">
                            Experience Level
                          </label>
                          <Dropdown
                            name="codingExperience"
                            placeholder="Select level"
                            options={codingExperienceLevels}
                            value={formData?.codingExperience}
                            onChange={handleInputChange}
                            required
                            id="codingExperience"
                            error={errors?.codingExperience}
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-normal text-on-surface pl-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#76d6d5] pointer-events-none z-10">
                            <EmailIcon className="w-4 h-4" />
                          </span>
                          <EditText
                            name="email"
                            type="email"
                            placeholder="hello@developer.com"
                            value={formData?.email}
                            onChange={handleInputChange}
                            className="pl-11"
                            required
                            id="email"
                            error={errors?.email}
                          />
                        </div>
                      </div>

                      {/* Password & Confirm Password Row */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full flex flex-col gap-1">
                          <label className="text-sm font-normal text-on-surface pl-1 flex justify-between">
                            <span>Password</span>
                            <span className="text-xs text-on-surface-variant">
                              Min 6 chars
                            </span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#76d6d5] pointer-events-none z-10">
                              <LockIcon className="w-4 h-4" />
                            </span>
                            <EditText
                              name="password"
                              type="password"
                              placeholder="••••••••"
                              value={formData?.password}
                              onChange={handleInputChange}
                              className="pl-11"
                              required
                              id="password"
                              error={errors?.password}
                            />
                          </div>
                        </div>
                        <div className="w-full flex flex-col gap-1">
                          <label className="text-sm font-normal text-on-surface pl-1">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#76d6d5] pointer-events-none z-10">
                              <LockIcon className="w-4 h-4" />
                            </span>
                            <EditText
                              name="confirmPassword"
                              type="password"
                              placeholder="••••••••"
                              value={formData?.confirmPassword}
                              onChange={handleInputChange}
                              className="pl-11"
                              required
                              id="confirmPassword"
                              error={errors?.confirmPassword}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Terms Checkbox */}
                      <div className="mt-4">
                        <CheckBox
                          text="I agree to the Protocol Terms and Privacy Policy"
                          checked={formData?.agreeToTerms}
                          onChange={handleCheckboxChange}
                          required
                          name="agreeToTerms"
                          id="agreeToTerms"
                          error={errors?.agreeToTerms}
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="mt-8">
                        {successMessage && (
                          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center">
                            {successMessage}
                          </div>
                        )}
                        {errors.submit && (
                          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center">
                            {errors.submit}
                          </div>
                        )}
                        <Button
                          type="submit"
                          text={
                            loading
                              ? "Creating Account..."
                              : "Start Your Journey"
                          }
                          text_font_size="16"
                          className="w-full"
                          disabled={loading || !formData?.agreeToTerms}
                          layout_width=""
                          padding=""
                          position=""
                          layout_gap=""
                          margin=""
                          variant="primary"
                          size="medium"
                          leftIcon={null}
                          rightIcon={null}
                        />
                      </div>

                      {/* Social Login Section */}
                      <div className="flex flex-col gap-6 pt-6 border-t border-on-surface/10">
                        <p className="text-base font-normal leading-[19px] text-center text-on-surface-variant">
                          OR SYNC WITH IDENTITY PROVIDER
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-[26px]">
                          <button
                            type="button"
                            onClick={() => handleSocialLogin("google")}
                            disabled={loading}
                            className="flex h-12 w-12 items-center justify-center rounded-lg border border-on-surface/10 bg-transparent p-3 transition-all duration-200 hover:bg-on-surface/10 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Sign up with Google"
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
                            aria-label="Sign up with GitHub"
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
                            aria-label="Sign up with Facebook"
                          >
                            <img
                              src={facebookIcon}
                              alt=""
                              className={socialIconClassName}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate({ to: "/login" })}
                            disabled={loading}
                            className="flex h-12 w-12 items-center justify-center rounded-lg border border-on-surface/10 bg-transparent p-3 text-on-surface transition-all duration-200 hover:bg-on-surface/10 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Sign up with Email"
                          >
                            <EmailProviderIcon
                              className={socialIconClassName}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Login Link */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6 px-8 sm:px-14">
                        <span className="text-base font-normal leading-[22px] text-center text-on-surface-variant">
                          Already an explorer?
                        </span>
                        <Link
                          to="/login"
                          className="text-base font-bold leading-[22px] text-center text-primary-fixed-dim hover:underline focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim focus:ring-offset-2 rounded"
                        >
                          Log in here
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Help Button - Fixed Position */}
        <button
          className="fixed bottom-8 right-8 flex items-center gap-2 bg-[#0d1d2a] border border-[#d8bfd84c] rounded-3xl px-4 py-3 shadow-[0px 4px 12px #888888ff] hover:bg-[#0d1d2acc] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#d8bfd8] z-50"
          aria-label="Need assistance"
        >
          <svg
            className="w-5 h-5 text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
          <span className="text-base font-normal leading-[19px] text-on-surface-variant">
            Need assistance?
          </span>
        </button>
      </main>
    </>
  );
};

export default RegistrationPage;
