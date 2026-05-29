import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import Logo from '../../../../components/layout/Logo';

// Color palette
const colors = {
  bgDark: '#041521',
  cardBg: '#0d1d2a',
  border: '#3e4949',
  textPrimary: '#d4e4f6',
  textSecondary: '#bdc9c8',
  accentTeal: '#76d6d5',
  accentPurple: '#d8bfd8',
};

// Lesson data
const lessonData = {
  id: 4,
  title: 'Loops in Python',
  description: 'Learn how to use for and while loops to repeat actions in your code.',
  breadcrumb: 'Python > Chapter > Module 2: Control Flow',
  duration: '18 min',
  difficulty: 'Beginner',
  xp: 25,
};

// Content sections
const theoryContent = `Loops allow you to execute a block of code multiple times. Python has two main types of loops:

**For Loop**: Used to iterate over a sequence (list, tuple, string, or range).

**While Loop**: Executes as long as a condition is true.

Loops help you avoid repetition and make your code more efficient.`;

const codeExample = `# For Loop - Iterate over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# For Loop with range
for i in range(5):
    print(f"Iteration: {i}")

# While Loop
count = 0
while count < 3:
    print(f"Count: {count}")
    count += 1`;

const exerciseContent = {
  instructions: `Write a for loop that prints numbers from 1 to 5 using the range() function.`,
  expectedOutput: `1\n2\n3\n4\n5`,
};

const keyTakeaways = [
  { icon: '🔄', text: 'For loops iterate over sequences like lists, strings, or ranges' },
  { icon: '⏸️', text: 'While loops continue as long as a condition remains true' },
  { icon: '🔢', text: 'The range() function generates a sequence of numbers' },
  { icon: '⏭️', text: 'Use "break" to exit a loop early, "continue" to skip to next iteration' },
];

const SyntaxHighlightedCode = ({ code }) => {
  const highlighted = code
    .replace(/(#.*)/g, '<span style="color: #6a737d">$1</span>')
    .replace(/\b(for|in|while|if|else|elif|range|print)\b/g, '<span style="color: #76d6d5">$1</span>')
    .replace(/(".*?"|'.*?')/g, '<span style="color: #d8bfd8">$1</span>')
    .replace(/\b(\d+)\b/g, '<span style="color: #98c379">$1</span>');

  return <code dangerouslySetInnerHTML={{ __html: highlighted }} />;
};

const LessonPage = () => {
  const navItems = ['Tutorial', 'Roadmap', 'Community', 'About'];
  const [codeOutput, setCodeOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [exerciseCode, setExerciseCode] = useState('# Write your for loop here\nfor i in range(1, 6):\n    print(i)');
  const [exerciseOutput, setExerciseOutput] = useState('');
  const [exerciseSubmitted, setExerciseSubmitted] = useState(false);
  const [exerciseSuccess, setExerciseSuccess] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setCodeOutput('apple\nbanana\ncherry\nIteration: 0\nIteration: 1\nIteration: 2\nIteration: 3\nIteration: 4\nCount: 0\nCount: 1\nCount: 2');
      setIsRunning(false);
    }, 800);
  };

  const submitExercise = () => {
    setExerciseSubmitted(true);
    const hasRange = exerciseCode.includes('range(') && exerciseCode.includes('print(');
    setExerciseSuccess(hasRange);
    if (hasRange) {
      setExerciseOutput('Correct! Your loop prints the numbers 1 through 5.\n\nExpected output:\n1\n2\n3\n4\n5');
    } else {
      setExerciseOutput('Hint: Use range(1, 6) to generate numbers 1-5 and print() to display them.');
    }
  };

  const resetExercise = () => {
    setExerciseCode('# Write your for loop here\nfor i in range(1, 6):\n    print(i)');
    setExerciseOutput('');
    setExerciseSubmitted(false);
    setExerciseSuccess(false);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#041521]">
      {/* Header (64px) */}
      <header
        className="shrink-0 w-full h-16 bg-[#041521] border-b border-[#3e4949] flex items-center px-6"
        style={{ boxShadow: '0px 4px 20px #00808019' }}
      >
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Logo + Back Button */}
          <div className="flex items-center gap-4">
            <Link
              to="/chapter"
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#bdc9c8] hover:text-[#76d6d5] transition-colors rounded-lg hover:bg-[#0d1d2a]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Chapter
            </Link>
            <div className="w-px h-6 bg-[#3e4949]" />
            <Logo />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item}
                to="/"
                className="text-sm font-medium text-[#bdc9c8] hover:text-[#76d6d5] transition-colors duration-200"
                style={{ fontFamily: 'Roboto' }}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Right: User */}
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#d8bfd8] text-[#041521] font-semibold flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              Y
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-6">
        <div className="max-w-[1024px] mx-auto space-y-6">
          {/* Lesson Header */}
          <div className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                {lessonData.breadcrumb}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-2xl font-bold text-[#d4e4f6] mb-2"
              style={{ fontFamily: 'Montserrat', textShadow: '0px 0px 15px #76d6d530' }}
            >
              {lessonData.title}
            </h1>

            {/* Description */}
            <p className="text-sm text-[#bdc9c8] mb-4" style={{ fontFamily: 'Roboto' }}>
              {lessonData.description}
            </p>

            {/* Metadata Row */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-[#bdc9c8]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ fontFamily: 'Roboto' }}>{lessonData.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#bdc9c8]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                <span style={{ fontFamily: 'Roboto' }}>{lessonData.difficulty}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#d8bfd8]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span style={{ fontFamily: 'Roboto' }}>+{lessonData.xp} XP</span>
              </div>
            </div>
          </div>

          {/* Theory Section */}
          <div className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-6">
            <h2
              className="text-lg font-semibold text-[#d4e4f6] mb-4 flex items-center gap-2"
              style={{ fontFamily: 'Montserrat' }}
            >
              <span>📚</span> Theory
            </h2>
            <div className="bg-[#0a1628] border border-[#3e4949] rounded-xl p-5">
              <pre className="text-sm text-[#bdc9c8] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Roboto' }}>
                {theoryContent}
              </pre>
            </div>
          </div>

          {/* Code Example Section */}
          <div className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-6">
            <h2
              className="text-lg font-semibold text-[#d4e4f6] mb-4 flex items-center gap-2"
              style={{ fontFamily: 'Montserrat' }}
            >
              <span>💻</span> Code Example
            </h2>
            <div className="bg-[#0a1628] border border-[#3e4949] rounded-xl overflow-hidden">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0d1d2a] border-b border-[#3e4949]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
                </div>
                <span className="text-xs text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>python</span>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#76d6d5] text-[#041521] rounded text-xs font-medium hover:bg-[#76d6d5cc] transition-colors disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Running...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Run
                    </>
                  )}
                </button>
              </div>

              {/* Code Content */}
              <div className="p-5 font-mono text-sm leading-relaxed overflow-x-auto">
                <pre className="text-[#bdc9c8]">
                  <SyntaxHighlightedCode code={codeExample} />
                </pre>
              </div>

              {/* Output */}
              {codeOutput && (
                <div className="border-t border-[#3e4949]">
                  <div className="px-4 py-2 bg-[#041521] text-xs text-[#bdc9c8] border-b border-[#3e4949]" style={{ fontFamily: 'Roboto' }}>
                    Output:
                  </div>
                  <div className="p-4 bg-[#041521] font-mono text-sm">
                    <pre className="text-[#98c379]">{codeOutput}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Exercise Section */}
          <div className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-6">
            <h2
              className="text-lg font-semibold text-[#d4e4f6] mb-4 flex items-center gap-2"
              style={{ fontFamily: 'Montserrat' }}
            >
              <span>✏️</span> Exercise
            </h2>

            {/* Instructions */}
            <div className="bg-[#11212e] border border-[#3e4949] rounded-xl p-4 mb-4">
              <h3 className="text-sm font-medium text-[#d4e4f6] mb-2" style={{ fontFamily: 'Roboto' }}>Task:</h3>
              <p className="text-sm text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                {exerciseContent.instructions}
              </p>
            </div>

            {/* Code Editor */}
            <div className="bg-[#0a1628] border border-[#3e4949] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-[#0d1d2a] border-b border-[#3e4949]">
                <span className="text-xs text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>Your Code</span>
              </div>
              <textarea
                value={exerciseCode}
                onChange={(e) => setExerciseCode(e.target.value)}
                className="w-full p-4 bg-[#0a1628] text-[#bdc9c8] font-mono text-sm leading-relaxed resize-none focus:outline-none"
                rows={6}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={submitExercise}
                className="flex items-center gap-2 px-4 py-2 bg-[#76d6d5] text-[#041521] rounded-lg font-medium hover:bg-[#76d6d5cc] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submit
              </button>
              <button
                onClick={resetExercise}
                className="flex items-center gap-2 px-4 py-2 border border-[#3e4949] text-[#bdc9c8] rounded-lg hover:border-[#76d6d5] hover:text-[#76d6d5] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
            </div>

            {/* Feedback */}
            {exerciseSubmitted && (
              <div className={`mt-4 p-4 rounded-xl border ${exerciseSuccess ? 'bg-[#76d6d510] border-[#76d6d5]' : 'bg-[#ff5f5610] border-[#ff5f56]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {exerciseSuccess ? (
                    <>
                      <svg className="w-5 h-5 text-[#76d6d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[#76d6d5] font-medium" style={{ fontFamily: 'Roboto' }}>Great job!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-[#ff5f56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[#ff5f56] font-medium" style={{ fontFamily: 'Roboto' }}>Try again!</span>
                    </>
                  )}
                </div>
                <pre className="text-sm text-[#bdc9c8] font-mono whitespace-pre-wrap" style={{ fontFamily: 'Roboto' }}>{exerciseOutput}</pre>
              </div>
            )}
          </div>

          {/* Key Takeaways Section */}
          <div className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-6">
            <h2
              className="text-lg font-semibold text-[#d4e4f6] mb-4 flex items-center gap-2"
              style={{ fontFamily: 'Montserrat' }}
            >
              <span>🎯</span> Key Takeaways
            </h2>
            <ul className="space-y-3">
              {keyTakeaways.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{point.icon}</span>
                  <span className="text-sm text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                    {point.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-4">
            <Link
              to="/chapter"
              className="flex items-center gap-2 px-4 py-2 text-[#bdc9c8] hover:text-[#d8bfd8] transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <div className="text-left">
                <span className="block text-xs text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>Previous</span>
                <span className="text-sm font-medium" style={{ fontFamily: 'Roboto' }}>If Statements</span>
              </div>
            </Link>
            <Link
              to="/chapter"
              className="flex items-center gap-2 px-4 py-2 bg-[#76d6d5] text-[#041521] rounded-lg font-medium hover:bg-[#76d6d5cc] transition-colors group"
            >
              <div className="text-right">
                <span className="block text-xs text-[#04152180]" style={{ fontFamily: 'Roboto' }}>Next</span>
                <span className="text-sm" style={{ fontFamily: 'Roboto' }}>Break & Continue</span>
              </div>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonPage;
