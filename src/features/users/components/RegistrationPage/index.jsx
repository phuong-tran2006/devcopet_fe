import React, { useEffect, useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import Button from '../../../../components/ui/Button';
import EditText from '../../../../components/ui/EditText';
import Dropdown from '../../../../components/ui/Dropdown';
import CheckBox from '../../../../components/ui/CheckBox';
import EmailProviderIcon from '../../../../components/ui/EmailProviderIcon';
import {
  facebookIcon,
  githubIcon,
  googleIcon,
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

  useEffect(() => {
    document.title = 'Create account | Devcopet Learn';
  }, []);

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
  };

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({
      ...prev,
      agreeToTerms: e?.target?.checked
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const nextErrors = {};
    if (!formData?.fullName?.trim()) nextErrors.fullName = 'Full name is required.';
    if (!formData?.username?.trim()) nextErrors.username = 'Username is required.';
    if (!formData?.dateOfBirth) nextErrors.dateOfBirth = 'Date of birth is required.';
    if (!formData?.codingExperience) nextErrors.codingExperience = 'Select your experience level.';
    if (!formData?.email?.trim()) nextErrors.email = 'Email is required.';
    if (!formData?.password) nextErrors.password = 'Password is required.';
    if (formData?.password && formData.password.length < 12) nextErrors.password = 'Password must be at least 12 characters.';
    if (formData?.confirmPassword !== formData?.password) nextErrors.confirmPassword = 'Passwords do not match.';
    if (!formData?.agreeToTerms) nextErrors.agreeToTerms = 'You must agree to continue.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // TODO: wire to users/api once backend is ready
  };

  return (
    <>
      <main className="relative min-h-screen w-full flex items-center justify-center bg-[#041521] overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/images/img_image.png"
            alt=""
            className="absolute top-0 left-0 w-full h-auto max-h-[956px] object-cover opacity-30"
            loading="lazy"
          />
          <img
            src="/images/img_overlay_blur.png"
            alt=""
            className="hidden lg:block absolute top-0 right-0 w-[30%] max-w-[444px] h-auto opacity-50"
            loading="lazy"
          />
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
            
            {/* Left Section - Hero Content */}
            <section className="w-full lg:w-[26%] flex flex-col items-center lg:items-start gap-6 sm:gap-8 lg:gap-12">
              {/* Background Blur Image */}
              <img
                src="/images/img_overlay_blur_374x448.png"
                alt=""
                className="hidden lg:block w-[86%] max-w-[448px] h-auto opacity-40"
                loading="lazy"
              />

              {/* Logo */}
              <div className="flex items-center justify-center gap-2 -mt-8 lg:-mt-[326px]">
                <img
                  src={mascotAxolotl}
                  alt="Devcopet logo"
                  className="h-6 w-6 rounded-full object-cover object-top sm:h-8 sm:w-8"
                  loading="eager"
                />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-['Montserrat'] text-[#d8bfd8]">
                  Devcopet
                </h2>
              </div>

              {/* Mascot & Welcome Message */}
              <div className="w-full flex flex-col items-center gap-6 sm:gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8">
                <div className="relative w-full max-w-[352px] flex items-end justify-end">
                  <img
                    src={mascotAxolotl}
                    alt="Devcopet mascot welcoming you to sign up"
                    className="h-auto w-32 object-contain sm:w-48 md:w-64"
                    loading="eager"
                  />
                  <div 
                    className="absolute bottom-0 right-0 bg-[#0d1d2a99] border-2 border-[#d8bfd866] rounded-xl p-4 sm:p-5 md:p-6 shadow-[0px_4px_12px_#888888ff] flex flex-col gap-4 sm:gap-5 md:gap-6"
                    style={{ marginTop: '26px' }}
                  >
                    <p className="text-sm sm:text-base font-bold font-['Open_Sans'] leading-5 text-center text-[#d8bfd8]">
                      Join me to start<br />coding!
                    </p>
                    <div 
                      className="w-5 h-2.5 border-t-[10px] border-l-[10px] border-r-[10px]"
                      style={{
                        borderImage: 'linear-gradient(90deg, #d8bfd8 0%, #00000000 100%)',
                        borderImageSlice: 1
                      }}
                    />
                  </div>
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

              {/* System Version */}
              <p className="hidden lg:block text-base font-normal font-['Roboto'] leading-[19px] text-[#bdc9c899] mt-auto">
                SYSTEM VERSION: 2.4.0-STABLE
              </p>
            </section>

            {/* Right Section - Registration Form */}
            <section className="w-full lg:w-[52%] flex items-center justify-center">
              <div 
                className="w-full max-w-[570px] bg-[#0d1d2a99] border border-[#76d6d519] rounded-xl shadow-[0px_25px_50px_#0000003f] overflow-hidden"
              >
                {/* Top Gradient Line */}
                <div 
                  className="w-full h-1"
                  style={{
                    background: 'linear-gradient(90deg, #008080 0%, #d8bfd8 50%, #008080 100%)'
                  }}
                />

                {/* Form Content */}
                <div className="px-6 sm:px-8 md:px-11 lg:px-12 py-8 sm:py-10 md:py-12 lg:py-[50px]">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-10 sm:gap-12">
                    
                    {/* Form Fields Container */}
                    <div className="flex flex-col gap-6">
                      
                      {/* Full Name & Username Row */}
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="w-full flex flex-col gap-1">
                          <label className="text-base font-normal font-['Roboto'] leading-[19px] text-[#bdc9c8] pl-1">
                            Full Name
                          </label>
                          <EditText
                            name="fullName"
                            placeholder="John Doe"
                            value={formData?.fullName}
                            onChange={handleInputChange}
                            required
                            layout_gap=""
                            layout_width=""
                            padding=""
                            position=""
                            margin=""
                            variant=""
                            size=""
                            defaultValue=""
                            onFocus={() => {}}
                            onBlur={() => {}}
                            id="fullName"
                            label=""
                            error={errors?.fullName}
                            helperText=""
                            className=""
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                          <label className="text-base font-normal font-['Roboto'] leading-[19px] text-[#bdc9c8] pl-1">
                            Username
                          </label>
                          <EditText
                            name="username"
                            placeholder="dev_hero_99"
                            value={formData?.username}
                            onChange={handleInputChange}
                            required
                            layout_gap=""
                            layout_width=""
                            padding=""
                            position=""
                            margin=""
                            variant=""
                            size=""
                            defaultValue=""
                            onFocus={() => {}}
                            onBlur={() => {}}
                            id="username"
                            label=""
                            error={errors?.username}
                            helperText=""
                            className=""
                          />
                        </div>
                      </div>

                      {/* Date of Birth & Coding Experience Row */}
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="w-full flex flex-col gap-1">
                          <label className="text-base font-normal font-['Roboto'] leading-[19px] text-[#bdc9c8] pl-1">
                            Date of Birth
                          </label>
                          <EditText
                            name="dateOfBirth"
                            type="date"
                            value={formData?.dateOfBirth}
                            onChange={handleInputChange}
                            required
                            id="dateOfBirth"
                            label=""
                            error={errors?.dateOfBirth}
                            helperText=""
                            className=""
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                          <label className="text-base font-normal font-['Roboto'] leading-[19px] text-[#bdc9c8] pl-1">
                            Coding Experience
                          </label>
                          <Dropdown
                            name="codingExperience"
                            placeholder="Select level"
                            options={codingExperienceLevels}
                            value={formData?.codingExperience}
                            onChange={handleInputChange}
                            required
                            layout_gap=""
                            layout_width=""
                            padding=""
                            position=""
                            variant=""
                            size=""
                            defaultValue=""
                            onFocus={() => {}}
                            onBlur={() => {}}
                            id="codingExperience"
                            label=""
                            error={errors?.codingExperience}
                            helperText=""
                            className=""
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="flex flex-col gap-1 mt-6">
                        <label className="text-base font-normal font-['Roboto'] leading-[19px] text-[#bdc9c8] pl-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <img
                            src="/images/img_container.svg"
                            alt=""
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-[14px]"
                          />
                          <EditText
                            name="email"
                            type="email"
                            placeholder="hello@developer.com"
                            value={formData?.email}
                            onChange={handleInputChange}
                            className="pl-12"
                            required
                            layout_gap=""
                            layout_width=""
                            padding=""
                            position=""
                            margin=""
                            variant=""
                            size=""
                            defaultValue=""
                            onFocus={() => {}}
                            onBlur={() => {}}
                            id="email"
                            label=""
                            error={errors?.email}
                            helperText=""
                          />
                        </div>
                      </div>

                      {/* Master Password */}
                      <div className="flex flex-col gap-2 mt-6">
                        <div className="flex flex-col gap-1">
                          <label className="text-base font-normal font-['Roboto'] leading-[19px] text-[#bdc9c8] pl-1">
                            Master Password
                          </label>
                          <div className="relative">
                            <img
                              src="/images/img_container_blue_gray_400.svg"
                              alt=""
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-[14px]"
                            />
                            <EditText
                              name="password"
                              type="password"
                              placeholder="••••••••••••"
                              value={formData?.password}
                              onChange={handleInputChange}
                              className="pl-11"
                              required
                              layout_gap=""
                              layout_width=""
                              padding=""
                              position=""
                              margin=""
                              variant=""
                              size=""
                              defaultValue=""
                              onFocus={() => {}}
                              onBlur={() => {}}
                              id="password"
                              label=""
                              error={errors?.password}
                              helperText=""
                            />
                          </div>
                        </div>
                        <p className="text-base font-normal font-['Roboto'] leading-[19px] text-[#bdc9c87f] pl-1">
                          MINIMUM 12 CHARACTERS WITH SYMBOLS
                        </p>
                      </div>

                      {/* Confirm Password */}
                      <div className="flex flex-col gap-1 mt-6">
                        <label className="text-base font-normal font-['Roboto'] leading-[19px] text-[#bdc9c8] pl-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <img
                            src="/images/img_container_blue_gray_400_14x16.svg"
                            alt=""
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-[14px]"
                          />
                          <EditText
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••••••"
                            value={formData?.confirmPassword}
                            onChange={handleInputChange}
                            className="pl-12"
                            required
                            layout_gap=""
                            layout_width=""
                            padding=""
                            position=""
                            margin=""
                            variant=""
                            size=""
                            defaultValue=""
                            onFocus={() => {}}
                            onBlur={() => {}}
                            id="confirmPassword"
                            label=""
                            error={errors?.confirmPassword}
                            helperText=""
                          />
                        </div>
                      </div>

                      {/* Terms Checkbox */}
                      <div className="mt-9">
                        <CheckBox
                          text="I agree to the Protocol Terms and Privacy Policy"
                          checked={formData?.agreeToTerms}
                          onChange={handleCheckboxChange}
                          required
                          layout_gap=""
                          layout_width=""
                          margin=""
                          position=""
                          variant=""
                          size=""
                          name="agreeToTerms"
                          id="agreeToTerms"
                          value=""
                          error={errors?.agreeToTerms}
                          className=""
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="mt-12 relative">
                        <img
                          src="/images/img_overlay.png"
                          alt=""
                          className="absolute left-0 top-0 w-[6px] h-full object-cover rounded-l-lg"
                        />
                        <Button
                          type="submit"
                          text="Start Your Journey"
                          className="w-full pl-10"
                          disabled={!formData?.agreeToTerms}
                          layout_width=""
                          padding=""
                          position=""
                          layout_gap=""
                          margin=""
                          variant=""
                          size=""
                          onClick={() => {}}
                          leftIcon={null}
                          rightIcon={null}
                        />
                      </div>

                      {/* Social Login Section */}
                      <div className="flex flex-col gap-6 mt-6 pt-6 border-t border-[#3e49494c]">
                        <p className="text-base font-normal font-['Roboto'] leading-[19px] text-center text-[#bdc9c8b2]">
                          OR SYNC WITH IDENTITY PROVIDER
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-[26px]">
                          <button
                            type="button"
                            className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#3e4949] bg-transparent p-3 transition-colors duration-200 hover:bg-[#ffffff0c]"
                            aria-label="Sign up with Google"
                          >
                            <img src={googleIcon} alt="" className={socialIconClassName} />
                          </button>
                          <button
                            type="button"
                            className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#3e4949] bg-transparent p-3 transition-colors duration-200 hover:bg-[#ffffff0c]"
                            aria-label="Sign up with GitHub"
                          >
                            <img src={githubIcon} alt="" className={socialIconClassName} />
                          </button>
                          <button
                            type="button"
                            className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#3e4949] bg-transparent p-3 transition-colors duration-200 hover:bg-[#ffffff0c]"
                            aria-label="Sign up with Facebook"
                          >
                            <img src={facebookIcon} alt="" className={socialIconClassName} />
                          </button>
                          <button
                            type="button"
                            className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#3e4949] bg-transparent p-3 text-[#d8bfd8] transition-colors duration-200 hover:bg-[#ffffff0c]"
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
          className="fixed bottom-8 right-8 flex items-center gap-2 bg-[#0d1d2a99] border border-[#d8bfd84c] rounded-3xl px-3 py-3 shadow-[0px_4px_12px_#888888ff] hover:bg-[#0d1d2acc] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#d8bfd8] z-50"
          aria-label="Need assistance"
        >
          <img
            src="/images/img_icon.svg"
            alt=""
            className="w-5 h-5"
          />
          <span className="text-base font-normal font-['Roboto'] leading-[19px] text-[#d8bfd8]">
            Need assistance?
          </span>
        </button>

        {/* System Version - Mobile */}
        <p className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 text-sm sm:text-base font-normal font-['Roboto'] leading-[19px] text-[#bdc9c899] z-10">
          SYSTEM VERSION: 2.4.0-STABLE
        </p>
      </main>
    </>
  );
};

export default RegistrationPage;
