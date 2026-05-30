import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import Button from '../../../../components/ui/Button';
import EditText from '../../../../components/ui/EditText';
import Dropdown from '../../../../components/ui/Dropdown';
import CheckBox from '../../../../components/ui/CheckBox';
import EmailProviderIcon from '../../../../components/ui/EmailProviderIcon';
import { EmailIcon, LockIcon } from '../../../../components/ui/icons';
import { useAuthStore } from '../../store/auth.store';
import { authApi } from '../../api/auth.api';
import {
  googleIcon,
  githubIcon,
  facebookIcon,
  mascotAxolotl,
  socialIconClassName,
} from '../../constants/authImages';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    dateOfBirth: '',
    codingExperience: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { setAuth, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Create account | Devcopet Learn';
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/course' });
    }
  }, [isAuthenticated, navigate]);

  const codingExperienceLevels = useMemo(
    () => [
      { label: 'Beginner - Just starting out', value: 'beginner' },
      { label: 'Intermediate - Some experience', value: 'intermediate' },
      { label: 'Advanced - Several years experience', value: 'advanced' },
      { label: 'Expert - Professional developer', value: 'expert' },
    ],
    []
  );

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({
      ...prev,
      agreeToTerms: e?.target?.checked
    }));
    if (errors.agreeToTerms) {
      setErrors(prev => ({ ...prev, agreeToTerms: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const nextErrors = {};
    if (!formData?.fullName?.trim()) nextErrors.fullName = 'Full name is required.';
    if (!formData?.username?.trim()) nextErrors.username = 'Username is required.';
    if (formData?.username?.trim() && formData.username.length < 3) {
      nextErrors.username = 'Username must be at least 3 characters.';
    }
    if (!formData?.dateOfBirth) nextErrors.dateOfBirth = 'Date of birth is required.';
    if (!formData?.codingExperience) nextErrors.codingExperience = 'Select your experience level.';
    if (!formData?.email?.trim()) nextErrors.email = 'Email is required.';
    if (formData?.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!formData?.password) nextErrors.password = 'Password is required.';
    if (formData?.password && formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }
    if (formData?.confirmPassword !== formData?.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!formData?.agreeToTerms) nextErrors.agreeToTerms = 'You must agree to continue.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await authApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        codingExperience: formData.codingExperience,
        dateOfBirth: formData.dateOfBirth,
      });
      
      setSuccessMessage('Account created successfully! Redirecting...');
      
      if (response.accessToken) {
        setAuth(response.accessToken, response.refreshToken, response.user);
        setTimeout(() => navigate({ to: '/course' }), 1500);
      } else {
        setTimeout(() => navigate({ to: '/login' }), 1500);
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:3000/auth/${provider}`;
  };

  return (
    <>
      <main className="relative min-h-screen w-full flex items-center justify-center bg-[#041521] overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#041521] via-[#0a1a24] to-[#041521] pointer-events-none" />

        {/* Decorative blur elements */}
        <div
          className="hidden lg:block absolute top-0 right-0 w-[30%] max-w-[444px] h-auto opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top right, #76d6d520 0%, transparent 70%)',
          }}
        />

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
            
            {/* Left Section - Hero Content */}
            <section className="w-full lg:w-[26%] flex flex-col items-center lg:items-start gap-6 sm:gap-8 lg:gap-12">
              {/* Logo */}
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <img
                  src={mascotAxolotl}
                  alt="Devcopet logo"
                  className="h-8 w-8 rounded-full object-cover object-top"
                  loading="eager"
                />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-['Montserrat'] text-[#d8bfd8]">
                  Devcopet
                </h2>
              </div>

              {/* Mascot & Welcome Message */}
              <div className="w-full flex flex-col items-center lg:items-start gap-6 sm:gap-8 lg:gap-12 px-4 sm:px-6 lg:px-0">
                <div className="relative w-full max-w-[352px] flex items-end justify-center lg:justify-start">
                  <img
                    src={mascotAxolotl}
                    alt="Devcopet mascot welcoming you to sign up"
                    className="h-auto w-48 object-contain sm:w-56 md:w-64 lg:w-72"
                    loading="eager"
                  />
                </div>

                {/* Hero Text */}
                <div className="flex flex-col gap-3 text-center lg:text-left px-4 sm:px-6">
                  <h1 
                    className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Montserrat'] leading-tight text-[#d4e4f6]"
                    style={{ textShadow: '0px 0px 8px #76d6d599' }}
                  >
                    Start Your<br />Adventure
                  </h1>
                  <p className="text-sm sm:text-base font-normal font-['Open_Sans'] leading-6 text-[#bdc9c8]">
                    Begin your evolution from a fledgling script-kiddie to a<br className="hidden sm:inline" />
                    legendary architect in the Devcopet ecosystem.
                  </p>
                </div>
              </div>

            </section>

            {/* Right Section - Registration Form */}
            <section className="w-full lg:w-[52%] flex items-center justify-center">
              <div 
                className="w-full max-w-[570px] bg-[#0d1d2a] border border-[#76d6d519] rounded-xl shadow-[0px 25px 50px #0000003f] overflow-hidden"
              >
                {/* Top gradient line */}
                <div 
                  className="w-full h-0.5 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #008080 0%, #d8bfd8 50%, #008080 100%)'
                  }}
                />

                {/* Form Content */}
                <div className="px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    
                    {/* Form Fields Container */}
                    <div className="flex flex-col gap-4">
                      
                      {/* Full Name & Username Row */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full flex flex-col gap-1">
                          <label className="text-sm font-normal font-['Roboto'] text-[#bdc9c8] pl-1">
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
                          <label className="text-sm font-normal font-['Roboto'] text-[#bdc9c8] pl-1">
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
                          <label className="text-sm font-normal font-['Roboto'] text-[#bdc9c8] pl-1">
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
                          <label className="text-sm font-normal font-['Roboto'] text-[#bdc9c8] pl-1">
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
                        <label className="text-sm font-normal font-['Roboto'] text-[#bdc9c8] pl-1">
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
                          <label className="text-sm font-normal font-['Roboto'] text-[#bdc9c8] pl-1 flex justify-between">
                            <span>Password</span>
                            <span className="text-xs text-[#bdc9c87f]">Min 6 chars</span>
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
                          <label className="text-sm font-normal font-['Roboto'] text-[#bdc9c8] pl-1">
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
                          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center" style={{ fontFamily: 'Roboto' }}>
                            {successMessage}
                          </div>
                        )}
                        {errors.submit && (
                          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center" style={{ fontFamily: 'Roboto' }}>
                            {errors.submit}
                          </div>
                        )}
                        <Button
                          type="submit"
                          text={loading ? 'Creating Account...' : 'Start Your Journey'}
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
                      <div className="flex flex-col gap-6 pt-6 border-t border-[#3e49494c]">
                        <p className="text-base font-normal font-['Roboto'] leading-[19px] text-center text-[#bdc9c8b2]">
                          OR SYNC WITH IDENTITY PROVIDER
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-[26px]">
                          <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            disabled={loading}
                            className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#3e4949] bg-transparent p-3 transition-all duration-200 hover:bg-[#ffffff0c] focus:outline-none focus:ring-2 focus:ring-[#008080] disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Sign up with Google"
                          >
                            <img src={googleIcon} alt="" className={socialIconClassName} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSocialLogin('github')}
                            disabled={loading}
                            className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#3e4949] bg-transparent p-3 transition-all duration-200 hover:bg-[#ffffff0c] focus:outline-none focus:ring-2 focus:ring-[#008080] disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Sign up with GitHub"
                          >
                            <img src={githubIcon} alt="" className={socialIconClassName} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSocialLogin('facebook')}
                            disabled={loading}
                            className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#3e4949] bg-transparent p-3 transition-all duration-200 hover:bg-[#ffffff0c] focus:outline-none focus:ring-2 focus:ring-[#008080] disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Sign up with Facebook"
                          >
                            <img src={facebookIcon} alt="" className={socialIconClassName} />
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate({ to: '/login' })}
                            disabled={loading}
                            className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#3e4949] bg-transparent p-3 text-[#d8bfd8] transition-all duration-200 hover:bg-[#ffffff0c] focus:outline-none focus:ring-2 focus:ring-[#008080] disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Sign up with Email"
                          >
                            <EmailProviderIcon className={socialIconClassName} />
                          </button>
                        </div>
                      </div>

                      {/* Login Link */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6 px-8 sm:px-14">
                        <span className="text-base font-normal font-['Open_Sans'] leading-[22px] text-center text-[#bdc9c8]">
                          Already an explorer?
                        </span>
                        <Link 
                          to="/login"
                          className="text-base font-bold font-['Open_Sans'] leading-[22px] text-center text-[#008080] hover:underline focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2 rounded"
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
          <svg className="w-5 h-5 text-[#d8bfd8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          <span className="text-base font-normal font-['Roboto'] leading-[19px] text-[#d8bfd8]">
            Need assistance?
          </span>
        </button>
      </main>
    </>
  );
};

export default RegistrationPage;
