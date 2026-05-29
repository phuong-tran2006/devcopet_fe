import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { EmailIcon, LockIcon, EyeIcon, EyeOffIcon } from '../../../../components/ui/icons';
import { mascotAxolotl } from '../../constants/authImages';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  useEffect(() => {
    document.title = 'Sign In | Devcopet';
  }, []);

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Signing in with:', { email, password });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#041521]">
      {/* Left side - Aside (513px) */}
      <aside
        className="hidden lg:flex flex-col items-center justify-center w-[513px] min-h-screen relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0d1d2a 0%, #041521 100%)',
        }}
      >
        {/* Background glow effects */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, #76d6d520 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #d8bfd8 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={mascotAxolotl}
              alt="Devcopet logo"
              className="w-10 h-10 rounded-full object-cover object-top"
            />
            <span
              className="text-2xl font-bold text-[#d8bfd8]"
              style={{ fontFamily: 'Montserrat' }}
            >
              Devcopet
            </span>
          </div>

          {/* Mascot */}
          <div
            className="w-64 h-64 rounded-full flex items-center justify-center text-8xl my-8"
            style={{
              background: 'radial-gradient(circle, #76d6d515 0%, transparent 70%)',
              boxShadow: '0px 0px 80px #76d6d540, 0px 0px 120px #d8bfd820',
            }}
          >
            🦎
          </div>

          {/* Tagline */}
          <div className="flex flex-col items-center gap-3 text-center">
            <h2
              className="text-2xl font-semibold text-[#d4e4f6]"
              style={{
                fontFamily: 'Montserrat',
                textShadow: '0px 0px 20px #76d6d530',
              }}
            >
              Your coding journey starts here
            </h2>
            <p
              className="text-base text-[#bdc9c8] max-w-[320px]"
              style={{ fontFamily: 'Roboto' }}
            >
              Join thousands of developers learning to code with their favorite mascot companion
            </p>
          </div>

          {/* Decorative elements */}
          <div className="flex items-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-[#76d6d5]" />
            <div className="w-2 h-2 rounded-full bg-[#76d6d5]/60" />
            <div className="w-2 h-2 rounded-full bg-[#76d6d5]/30" />
          </div>
        </div>

        {/* Bottom gradient line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #76d6d5 50%, transparent 100%)',
          }}
        />
      </aside>

      {/* Right side - Section (768px) */}
      <section className="flex-1 flex items-center justify-center w-full min-h-screen px-4 sm:px-6 lg:px-12 py-12">
        <div className="w-full max-w-[420px] flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#d4e4f6]"
              style={{
                fontFamily: 'Montserrat',
                textShadow: '0px 0px 8px #76d6d544',
              }}
            >
              Welcome back
            </h1>
            <p
              className="text-base text-[#bdc9c8]"
              style={{ fontFamily: 'Roboto' }}
            >
              Sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-[#bdc9c8]"
                style={{ fontFamily: 'Roboto' }}
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#76d6d5]">
                  <EmailIcon className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-3.5 bg-[#11212e] border rounded-lg text-[#bdc9c8] placeholder:text-[#3e4949] transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500/50'
                      : 'border-[#3e4949] focus:border-[#76d6d5] focus:ring-[#76d6d5]/20'
                  }`}
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: '16px',
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400 mt-1" style={{ fontFamily: 'Roboto' }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#bdc9c8]"
                  style={{ fontFamily: 'Roboto' }}
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#76d6d5] hover:text-[#65c5c4] transition-colors"
                  style={{ fontFamily: 'Roboto' }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#76d6d5]">
                  <LockIcon className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3.5 bg-[#11212e] border rounded-lg text-[#bdc9c8] placeholder:text-[#3e4949] transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500/50'
                      : 'border-[#3e4949] focus:border-[#76d6d5] focus:ring-[#76d6d5]/20'
                  }`}
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: '16px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#76d6d5] hover:text-[#65c5c4] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400 mt-1" style={{ fontFamily: 'Roboto' }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Sign In button */}
            <button
              type="submit"
              className="w-full py-4 rounded-lg text-[#041521] font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                fontFamily: 'Montserrat',
                backgroundColor: '#76d6d5',
                boxShadow: '0px 0px 20px #76d6d540',
              }}
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[#3e4949]" />
            <span className="text-sm text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
              or
            </span>
            <div className="flex-1 h-px bg-[#3e4949]" />
          </div>

          {/* Register link */}
          <div className="flex justify-center items-center gap-2">
            <span className="text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
              Don't have an account?
            </span>
            <Link
              to="/register"
              className="text-[#76d6d5] font-medium hover:text-[#65c5c4] transition-colors"
              style={{ fontFamily: 'Roboto' }}
            >
              Register
            </Link>
          </div>

          {/* Bottom decorative line */}
          <div
            className="h-0.5 rounded-full mt-4"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #76d6d5 50%, transparent 100%)',
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default SignInPage;
