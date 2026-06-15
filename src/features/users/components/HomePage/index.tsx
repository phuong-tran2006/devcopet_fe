// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import Logo from "../../../../components/layout/Logo";
import HeaderMenu from "../../../../components/layout/HeaderMenu";
import LinkComponent from "../../../../components/ui/Link";
import { mascotAxolotl } from "../../constants/authImages";

const TOTAL_QUESTIONS = 8;

const quizQuestions = [
  {
    id: 1,
    heading: "Meet your coding companion",
    options: [
      { id: 1, label: "Playful Puff", icon: "🐣" },
      { id: 2, label: "Curious Nibbles", icon: "🐹" },
      { id: 3, label: "Silent Scribe", icon: "🦉" },
      { id: 4, label: "Mischievous Glitch", icon: "👾" },
    ],
  },
  {
    id: 2,
    heading: "How do you approach a new bug?",
    options: [
      { id: 1, label: "Debug with friends", icon: "🔍" },
      { id: 2, label: "Read the docs first", icon: "📖" },
      { id: 3, label: "Add console.log everywhere", icon: "📝" },
      { id: 4, label: "Stack Overflow copy-paste", icon: "💻" },
    ],
  },
  {
    id: 3,
    heading: "Your favorite IDE theme?",
    options: [
      { id: 1, label: "Dark mode - always", icon: "🌙" },
      { id: 2, label: "Light mode - eyes matter", icon: "☀️" },
      { id: 3, label: "Whatever ships default", icon: "📦" },
      { id: 4, label: "Custom rainbow theme", icon: "🌈" },
    ],
  },
  {
    id: 4,
    heading: "Coffee or Tea while coding?",
    options: [
      { id: 1, label: "Coffee - pure caffeine", icon: "☕" },
      { id: 2, label: "Green tea - zen mode", icon: "🍵" },
      { id: 3, label: "Energy drinks - why not", icon: "⚡" },
      { id: 4, label: "Water - stay hydrated", icon: "💧" },
    ],
  },
  {
    id: 5,
    heading: "Git commit message style?",
    options: [
      { id: 1, label: '"fix stuff"', icon: "🔧" },
      { id: 2, label: "Epic saga of changes", icon: "📜" },
      { id: 3, label: "Just emoji commits", icon: "🎨" },
      { id: 4, label: "Conventional commits only", icon: "📋" },
    ],
  },
  {
    id: 6,
    heading: "Favorite coding music?",
    options: [
      { id: 1, label: "Lo-fi beats", icon: "🎵" },
      { id: 2, label: "Movie soundtracks", icon: "🎬" },
      { id: 3, label: "Nature sounds", icon: "🌿" },
      { id: 4, label: "Complete silence", icon: "🤫" },
    ],
  },
  {
    id: 7,
    heading: "How many browser tabs?",
    options: [
      { id: 1, label: "5-10 - organized chaos", icon: "📊" },
      { id: 2, label: "50+ - I know where they are", icon: "🔥" },
      { id: 3, label: "Just 1 - focus mode", icon: "🎯" },
      { id: 4, label: "Tabs? I use multiple windows", icon: "🪟" },
    ],
  },
  {
    id: 8,
    heading: "Dream tech stack?",
    options: [
      { id: 1, label: "React + Node.js", icon: "⚛️" },
      { id: 2, label: "Python + Django", icon: "🐍" },
      { id: 3, label: "Rust + WebAssembly", icon: "🦀" },
      { id: 4, label: "Whatever pays the bills", icon: "💰" },
    ],
  },
];

const HomePage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    document.title = "Pet Personality Survey | Devcopet";
  }, []);

  const question = quizQuestions[currentQuestion];
  const progress = `${currentQuestion + 1}/${TOTAL_QUESTIONS}`;

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: optionId,
    }));
  };

  const handleNext = () => {
    if (selectedOption !== null && currentQuestion < TOTAL_QUESTIONS - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(answers[currentQuestion + 1] ?? null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedOption(answers[currentQuestion - 1] ?? null);
    }
  };

  const isNextDisabled = selectedOption === null;
  const isPreviousDisabled = currentQuestion === 0;

  return (
    <>
      <main className="relative min-h-screen w-full bg-[#041521] overflow-hidden">
        {/* Background decorative elements */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top center, #76d6d510 0%, transparent 50%)",
          }}
        />

        {/* Header */}
        <header
          className="w-full bg-[#041521] border-b border-[#3e49496b]"
          style={{
            boxShadow: "0px 4px 20px #00808019",
          }}
        >
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
            <div className="flex flex-row justify-between items-center py-4 sm:py-5 md:py-6 gap-4">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <img
                  src={mascotAxolotl}
                  alt="Devcopet logo"
                  className="h-8 w-8 rounded-full object-cover object-top"
                  loading="eager"
                />
                <span
                  className="text-lg sm:text-xl md:text-2xl font-bold text-[#d8bfd8]"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Devcopet
                </span>
              </div>

              {/* Desktop Navigation Menu */}
              <div className="hidden lg:block">
                <nav className="flex flex-row gap-6 lg:gap-8">
                  {["Tutorial", "Roadmap", "Community", "About"].map((item) => (
                    <Link
                      key={item}
                      to="/"
                      className="text-sm sm:text-base font-medium text-[#bdc9c8] hover:text-[#76d6d5] transition-colors duration-200"
                      style={{ fontFamily: "Roboto" }}
                      onClick={(e) => e.preventDefault()}
                    >
                      {item}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Right side icons */}
              <div className="flex items-center gap-3">
                <LinkComponent
                  href="/notifications"
                  ariaLabel="Notifications"
                  className="p-1 sm:p-2"
                >
                  <svg
                    className="w-5 h-5 text-[#d8bfd8] hover:text-[#76d6d5] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                </LinkComponent>

                <LinkComponent
                  href="/messages"
                  ariaLabel="Messages"
                  className="p-1 sm:p-2"
                >
                  <svg
                    className="w-5 h-5 text-[#d8bfd8] hover:text-[#76d6d5] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </LinkComponent>

                <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#d8bfd8] text-[#041521] font-semibold text-sm sm:text-base">
                  Y
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Quiz Container */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 sm:py-12">
          <div
            className="w-full max-w-[720px] bg-[#0d1d2a] border border-[#76d6d519] rounded-2xl overflow-hidden"
            style={{
              boxShadow: "0px 25px 50px #0000003f, 0px 0px 40px #0080800c",
            }}
          >
            {/* Top gradient line */}
            <div
              className="w-full h-0.5"
              style={{
                background:
                  "linear-gradient(90deg, #008080 0%, #d8bfd8 50%, #008080 100%)",
              }}
            />

            {/* Quiz Content */}
            <div className="px-6 sm:px-10 md:px-16 py-10 sm:py-14 md:py-16 flex flex-col items-center gap-8 sm:gap-10">
              {/* Mascot */}
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center text-5xl sm:text-6xl md:text-7xl"
                style={{
                  background:
                    "linear-gradient(135deg, #76d6d520 0%, #d8bfd810 100%)",
                  boxShadow:
                    "0px 0px 30px #76d6d530, inset 0px 0px 20px #76d6d515",
                }}
              >
                🦎
              </div>

              {/* Progress Indicator */}
              <div className="flex flex-col items-center gap-3">
                <span
                  className="text-lg sm:text-xl font-semibold text-[#bdc9c8]"
                  style={{ fontFamily: "Roboto" }}
                >
                  {progress}
                </span>
                <div className="flex flex-row gap-2">
                  {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i < currentQuestion
                          ? "bg-[#d8bfd8]"
                          : i === currentQuestion
                            ? "bg-[#d8bfd8] ring-2 ring-[#d8bfd850]"
                            : "bg-[#3e4949]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Heading */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#d4e4f6] leading-tight max-w-[600px]"
                style={{
                  fontFamily: "Montserrat",
                  textShadow: "0px 0px 8px #76d6d544",
                }}
              >
                {question.heading}
              </h1>

              {/* Options */}
              <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-[622px]">
                {question.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className={`w-full h-[82px] flex items-center gap-4 px-4 sm:px-6 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? "border-[#76d6d5] bg-[#11212e]"
                          : "border-[#3e4949] bg-[#11212e] hover:border-[#76d6d5]"
                      }`}
                      style={{
                        boxShadow: isSelected
                          ? "0px 0px 15px #76d6d530, inset 0px 0px 10px #76d6d510"
                          : "none",
                      }}
                    >
                      {/* Icon Circle */}
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 ${
                          isSelected ? "bg-[#76d6d520]" : "bg-[#3e494930]"
                        }`}
                      >
                        {option.icon}
                      </div>

                      {/* Label */}
                      <span
                        className={`text-base sm:text-lg font-medium ${
                          isSelected ? "text-[#76d6d5]" : "text-[#bdc9c8]"
                        }`}
                        style={{ fontFamily: "Roboto" }}
                      >
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Arrows */}
              <div className="flex flex-row justify-between items-center w-full max-w-[622px] mt-4">
                {/* Previous Button */}
                <button
                  onClick={handlePrevious}
                  disabled={isPreviousDisabled}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isPreviousDisabled
                      ? "bg-[#11212e] border border-[#3e4949] text-[#3e4949] cursor-not-allowed"
                      : "bg-[#11212e] border border-[#3e4949] text-[#bdc9c8] hover:border-[#76d6d5] hover:text-[#76d6d5]"
                  }`}
                  aria-label="Previous question"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Question Counter */}
                <span
                  className="text-sm sm:text-base font-normal text-[#bdc9c8]"
                  style={{ fontFamily: "Open Sans" }}
                >
                  Question {currentQuestion + 1} of {TOTAL_QUESTIONS}
                </span>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isNextDisabled
                      ? "bg-[#11212e] border border-[#3e4949] text-[#3e4949] cursor-not-allowed"
                      : "bg-[#76d6d5] border border-[#76d6d5] text-[#041521] hover:bg-[#65c5c4]"
                  }`}
                  aria-label="Next question"
                  style={{
                    boxShadow: isNextDisabled
                      ? "none"
                      : "0px 0px 15px #76d6d540",
                  }}
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
