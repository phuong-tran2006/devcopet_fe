import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import Header from '../../../../components/layout/Header';
import Button from '../../../../components/ui/Button';
import {
  facebookIcon,
  githubIcon,
  googleIcon,
  mascotAxolotl,
  socialIconClassName,
} from '../../constants/authImages';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Login | Devcopet Learn';
  }, []);

  const handleLogin = (e) => {
    e?.preventDefault();
    setError('');
    // TODO: wire to users/api once backend is ready
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
  };

  const handleSocialLogin = (provider) => {
    // Social login logic would go here
  };

  return (
    <>
      <main className="relative w-full min-h-screen overflow-hidden">
        {/* Background gradient overlay */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(90deg, #00808026 0%, #00808000 100%)',
          }}
        />

        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col w-full min-h-screen">
          {/* Header */}
          <Header />

          {/* Main content area */}
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-0 -mt-8 lg:-mt-16">
            {/* Left side - Mascot image */}
            <div className="hidden lg:block w-full lg:w-1/4 mb-8 lg:mb-0">
              <img
                src={mascotAxolotl}
                alt="Devcopet mascot character"
                className="w-full max-w-[200px] lg:max-w-[316px] h-auto mx-auto object-contain"
              />
            </div>

            {/* Center - Login form */}
            <div className="w-full max-w-md lg:max-w-lg flex flex-col items-center gap-8 sm:gap-10 lg:gap-12 lg:ml-8">
              {/* Title */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold text-center text-text-bright"
                style={{
                  fontFamily: 'Montserrat',
                  lineHeight: '1.2',
                }}
              >
                Log in to Devcopet Learn
              </h1>

              {/* Login form card */}
              <div
                className="w-full bg-background-input bg-opacity-70 border border-border-accent-medium rounded-lg sm:rounded-xl p-6 sm:p-8"
                style={{
                  boxShadow: '0px 0px 20px #0080800c',
                }}
              >
                <form onSubmit={handleLogin} className="flex flex-col gap-6 sm:gap-7">
                  {/* Email field */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm text-text-primary"
                      style={{
                        fontFamily: 'Open Sans',
                        fontSize: '14px',
                        lineHeight: '20px',
                      }}
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <img
                        src="/images/img_container_gray_400.svg"
                        alt=""
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                      />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e?.target?.value)}
                        placeholder="admin@devcopet.io"
                        required
                        className="w-full pl-10 pr-3 py-2.5 bg-background-input border border-border-white rounded-lg text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-teal-light focus:border-primary-teal-light"
                        style={{
                          fontFamily: 'Open Sans',
                          fontSize: '16px',
                          lineHeight: '22px',
                        }}
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-row justify-between items-center">
                      <label
                        htmlFor="password"
                        className="text-sm text-text-primary"
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
                        className="text-sm text-text-accent hover:underline"
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
                      <img
                        src="/images/img_container_gray_400_20x16.svg"
                        alt=""
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-5"
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e?.target?.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-9 pr-10 py-2.5 bg-background-input border border-border-white rounded-lg text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-teal-light focus:border-primary-teal-light"
                        style={{
                          fontFamily: 'Open Sans',
                          fontSize: '16px',
                          lineHeight: '22px',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <img
                          src="/images/img_icon_gray_400.svg"
                          alt=""
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Login button */}
                  <Button
                    type="submit"
                    text="Login"
                    className="w-full"
                    layout_width="full"
                    padding="default"
                    position="center"
                    layout_gap="default"
                    margin="none"
                    variant="primary"
                    size="medium"
                    onClick={handleLogin}
                    leftIcon={null}
                    rightIcon={null}
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
                      <div className="flex-1 h-px bg-background-transparent-light" />
                      <span
                        className="text-xs font-bold uppercase text-text-primary"
                        style={{
                          fontFamily: 'Open Sans',
                          fontSize: '12px',
                          lineHeight: '17px',
                          letterSpacing: '0.5px',
                        }}
                      >
                        OR CONTINUE WITH
                      </span>
                      <div className="flex-1 h-px bg-background-transparent-light" />
                    </div>

                    {/* Social login buttons */}
                    <div className="flex flex-row gap-4 sm:gap-6 justify-center">
                      <button
                        type="button"
                        onClick={() => handleSocialLogin('google')}
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-border-primary p-3 transition-colors duration-200 hover:bg-background-secondary focus:outline-none focus:ring-2 focus:ring-primary-teal-light"
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
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-border-primary p-3 transition-colors duration-200 hover:bg-background-secondary focus:outline-none focus:ring-2 focus:ring-primary-teal-light"
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
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-border-primary p-3 transition-colors duration-200 hover:bg-background-secondary focus:outline-none focus:ring-2 focus:ring-primary-teal-light"
                        aria-label="Continue with Facebook"
                      >
                        <img
                          src={facebookIcon}
                          alt=""
                          className={socialIconClassName}
                        />
                      </button>
                    </div>

                    {/* New user section */}
                    <div className="flex flex-col gap-4 sm:gap-[18px] items-center mt-2">
                      {/* Divider with background */}
                      <div className="relative w-full flex items-center justify-center py-2">
                        <div
                          className="absolute inset-0 bg-center bg-no-repeat bg-contain"
                          style={{
                            backgroundImage: "url('/images/img_container_blue_gray_800.svg')",
                          }}
                        />
                        <div className="relative px-6 py-2 bg-background-tertiary">
                          <span
                            className="text-xs font-bold uppercase text-text-secondary"
                            style={{
                              fontFamily: 'Nimbus Sans',
                              fontSize: '12px',
                              lineHeight: '15px',
                            }}
                          >
                            NEW HERE?
                          </span>
                        </div>
                      </div>

                      {/* Create account link */}
                      <Link
                        to="/register"
                        className="flex flex-row items-center gap-1 hover:opacity-80 transition-opacity duration-200"
                        onClick={() => {}}
                      >
                        <span
                          className="text-sm font-medium text-text-accent"
                          style={{
                            fontFamily: 'Roboto',
                            fontSize: '13px',
                            lineHeight: '16px',
                          }}
                        >
                          Create an Account
                        </span>
                        <img
                          src="/images/img_arrow_right.svg"
                          alt=""
                          className="w-3 h-3"
                        />
                      </Link>
                    </div>
                  </div>
                </form>
              </div>

              {/* Terms and privacy */}
              <p
                className="text-center text-sm text-text-secondary opacity-60 max-w-md px-4"
                style={{
                  fontFamily: 'Open Sans',
                  fontSize: '14px',
                  lineHeight: '21px',
                }}
              >
                <span>By continuing, you agree to Devcopet&apos;s </span>
                <a href="/terms" className="text-text-accent opacity-70 hover:underline"
                  onClick={() => {}}
                >
                  Terms of Service
                </a>
                <span> and </span>
                <a href="/privacy" className="text-text-accent opacity-70 hover:underline"
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
            background: '#76d6d519',
            filter: 'blur(60px)',
            boxShadow: '0px 4px 120px #888888ff',
          }}
        />
      </main>
    </>
  );
};

export default Login;
