import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import Header from '../../../../components/layout/Header';
import Button from '../../../../components/ui/Button';
import { EmailIcon, LockIcon, EyeIcon, EyeOffIcon } from '../../../../components/ui/icons';
import { useAuth } from '../../../../contexts/AuthContext';
import {
  googleIcon,
  githubIcon,
  facebookIcon,
  mascotAxolotl,
  socialIconClassName,
} from '../../constants/authImages';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login: authLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Login - Devcopet';
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/course');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { authAPI } = await import('../../../../services/api');
      const { token, user } = await authAPI.login({ email, password });
      authLogin(token, user);
      navigate('/course');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    const { googleAuth, githubAuth, facebookAuth } = require('../../../../services/api');
    switch (provider) {
      case 'google':
        googleAuth();
        break;
      case 'github':
        githubAuth();
        break;
      case 'facebook':
        facebookAuth();
        break;
      default:
        break;
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e?.target?.value);
    if (error) setError('');
  };

  return (
    <>
      <main className="relative h-screen w-full min-h-screen overflow-hidden bg-[#041521]">
        {/* Background gradient overlay */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, #00808010 0%, transparent 50%)',
          }}
        />

        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col w-full min-h-screen">
          {/* Header */}
          <Header />

          {/* Main content area - centered */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
            {/* Center - Login form wrapper */}
            <div className="w-full max-w-md flex flex-col items-center gap-8 sm:gap-10">
              {/* Title */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white"
                style={{
                  fontFamily: 'Montserrat',
                  lineHeight: '1.2',
                  textShadow: '0px 0px 8px #76d6d544',
                }}
              >
                Login
              </h1>

              {/* Login form card */}
              <div
                className="w-full bg-[#0d1d2a] border border-[#ffffff30] rounded-xl p-6 sm:p-8"
                style={{
                  boxShadow: '0px 25px 50px #0000003f, 0px 0px 20px #0080800c',
                }}
              >
                {/* Top gradient line */}
                <div
                  className="w-full h-0.5 mb-6 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #008080 0%, #d8bfd8 50%, #008080 100%)',
                  }}
                />

                <form onSubmit={handleLogin} className="flex flex-col gap-6 sm:gap-7">
                  {/* Email field */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm font-normal text-white pl-1"
                      style={{
                        fontFamily: 'Open Sans',
                        fontSize: '14px',
                        lineHeight: '20px',
                      }}
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#76d6d5] pointer-events-none">
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
                        className="w-full pl-11 pr-3 py-2.5 bg-[#0a1a24] border border-[#76d6d533] rounded-lg text-base text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-[#008080] transition-colors"
                        style={{
                          fontFamily: 'Open Sans',
                          fontSize: '16px',
                          lineHeight: '22px',
                        }}
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
                          fontFamily: 'Open Sans',
                          fontSize: '14px',
                          lineHeight: '20px',
                        }}
                      >
                        Password
                      </label>
                      <a
                        href="/forgot-password"
                        className="text-sm text-white hover:underline hover:text-[#d8bfd8] transition-colors"
                        style={{
                          fontFamily: 'Open Sans',
                          fontSize: '14px',
                          lineHeight: '20px',
                        }}
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#76d6d5] pointer-events-none">
                        <LockIcon className="w-4 h-4" />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleInputChange(setPassword)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-11 pr-11 py-2.5 bg-[#0a1a24] border border-[#76d6d533] rounded-lg text-base text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-[#008080] transition-colors"
                        style={{
                          fontFamily: 'Open Sans',
                          fontSize: '16px',
                          lineHeight: '22px',
                        }}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76d6d5] hover:text-[#d8bfd8] focus:outline-none transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Login button */}
                  <Button
                    type="submit"
                    text={loading ? 'Signing in...' : 'Login'}
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
                    <p className="text-sm text-red-400" style={{ fontFamily: 'Open Sans' }}>
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
                          fontFamily: 'Open Sans',
                          fontSize: '12px',
                          lineHeight: '17px',
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
                        onClick={() => handleSocialLogin('google')}
                        disabled={loading}
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#3e4949] bg-transparent p-3 transition-all duration-200 hover:bg-[#ffffff0c] focus:outline-none focus:ring-2 focus:ring-[#008080] disabled:opacity-50 disabled:cursor-not-allowed"
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
                        onClick={() => handleSocialLogin('github')}
                        disabled={loading}
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#3e4949] bg-transparent p-3 transition-all duration-200 hover:bg-[#ffffff0c] focus:outline-none focus:ring-2 focus:ring-[#008080] disabled:opacity-50 disabled:cursor-not-allowed"
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
                        onClick={() => handleSocialLogin('facebook')}
                        disabled={loading}
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#3e4949] bg-transparent p-3 transition-all duration-200 hover:bg-[#ffffff0c] focus:outline-none focus:ring-2 focus:ring-[#008080] disabled:opacity-50 disabled:cursor-not-allowed"
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
                            fontFamily: 'Roboto',
                            fontSize: '13px',
                            lineHeight: '16px',
                          }}
                        >
                          Create an Account
                        </span>
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
                  fontFamily: 'Open Sans',
                  fontSize: '14px',
                  lineHeight: '21px',
                }}
              >
                <span>By continuing, you agree to Devcopet&apos;s </span>
                <a href="/terms" className="text-white opacity-70 hover:underline"
                  onClick={() => {}}
                >
                  Terms of Service
                </a>
                <span> and </span>
                <a href="/privacy" className="text-white opacity-70 hover:underline"
                  onClick={() => {}}
                >
                  Privacy Policy.
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Decorative blur circle - bottom right */}
        <div
          className="hidden lg:block absolute bottom-0 right-0 w-[400px] h-[350px] lg:w-[576px] lg:h-[506px] rounded-full opacity-10 pointer-events-none"
          style={{
            background: '#76d6d5',
            filter: 'blur(60px)',
            boxShadow: '0px 4px 120px #888888ff',
          }}
        />
      </main>
    </>
  );
};

export default Login;
