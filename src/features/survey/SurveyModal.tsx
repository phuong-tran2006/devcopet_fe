import { useEffect, useRef, useState } from "react";
import { mascotAxolotl } from "../users/constants/authImages";

interface SurveyModalProps {
  isOpen: boolean;
  embedded?: boolean;
  onClose?: () => void;
  onSkip?: () => void;
  onComplete?: (answers: Record<number, string>) => void;
}

export const surveyQuestions = [
  {
    id: 1,
    question: "What is the main reason you started using this platform?",
    options: [
      {
        id: "A",
        text: "I want to learn a new skill through a clear roadmap.",
        scores: { disciplined: 2, curious: 1 },
      },
      {
        id: "B",
        text: "I want to explore different topics and discover what truly suits me.",
        scores: { curious: 2, adaptable: 1 },
      },
      {
        id: "C",
        text: "I want to improve my academic or professional performance as quickly as possible.",
        scores: { competitive: 2, analytical: 1 },
      },
      {
        id: "D",
        text: "I want to connect, discuss, and learn with other people.",
        scores: { social: 2, empathetic: 1 },
      },
    ],
  },
  {
    id: 2,
    question:
      "When you decide to learn or pursue something new, what do you usually do first?",
    options: [
      {
        id: "A",
        text: "Create a detailed plan and divide the goal into smaller steps.",
        scores: { disciplined: 3, analytical: 1 },
      },
      {
        id: "B",
        text: "Start immediately and make adjustments along the way.",
        scores: { adaptable: 2, independent: 1 },
      },
      {
        id: "C",
        text: "Research the topic thoroughly before starting.",
        scores: { analytical: 3, curious: 1 },
      },
      {
        id: "D",
        text: "Find an experienced person to ask for advice or follow.",
        scores: { social: 2, curious: 1 },
      },
    ],
  },
  {
    id: 3,
    question:
      "Which learning method helps you understand new knowledge most effectively?",
    options: [
      {
        id: "A",
        text: "Reading theory and analyzing detailed examples.",
        scores: { analytical: 3 },
      },
      {
        id: "B",
        text: "Practicing immediately through exercises or projects.",
        scores: { independent: 2, adaptable: 1 },
      },
      {
        id: "C",
        text: "Using images, diagrams, videos, or simulations.",
        scores: { creative: 3 },
      },
      {
        id: "D",
        text: "Discussing, debating, or learning with others.",
        scores: { social: 2, leader: 1 },
      },
    ],
  },
  {
    id: 4,
    question:
      "When you cannot solve a difficult problem after several attempts, what do you usually do?",
    options: [
      {
        id: "A",
        text: "Break the problem into smaller parts and examine each one.",
        scores: { analytical: 3, disciplined: 1 },
      },
      {
        id: "B",
        text: "Look for a completely different approach.",
        scores: { creative: 3, adaptable: 1 },
      },
      {
        id: "C",
        text: "Ask someone else or join a discussion.",
        scores: { social: 2, curious: 1 },
      },
      {
        id: "D",
        text: "Take a break and return with a clearer mind.",
        scores: { adaptable: 2, independent: 1 },
      },
    ],
  },
  {
    id: 5,
    question:
      "What role would you like the AI assistant on this platform to play?",
    options: [
      {
        id: "A",
        text: "A teacher who explains everything from basic to advanced.",
        scores: { curious: 2, disciplined: 1 },
      },
      {
        id: "B",
        text: "An expert who provides precise and direct answers.",
        scores: { analytical: 2, competitive: 1 },
      },
      {
        id: "C",
        text: "A companion who asks questions and encourages independent thinking.",
        scores: { independent: 2, curious: 1 },
      },
      {
        id: "D",
        text: "A creative collaborator who helps develop my ideas.",
        scores: { creative: 3 },
      },
    ],
  },
  {
    id: 6,
    question:
      "Do you prefer working independently or collaborating with others?",
    options: [
      {
        id: "A",
        text: "I work most effectively when I am completely independent.",
        scores: { independent: 3 },
      },
      {
        id: "B",
        text: "I prefer working alone but still value feedback.",
        scores: { independent: 2, adaptable: 1 },
      },
      {
        id: "C",
        text: "I prefer working in a small team with clearly assigned responsibilities.",
        scores: { disciplined: 2, social: 1 },
      },
      {
        id: "D",
        text: "I enjoy active environments with frequent communication.",
        scores: { social: 3, leader: 1 },
      },
    ],
  },
  {
    id: 7,
    question: "Which role do you naturally take in a team?",
    options: [
      {
        id: "A",
        text: "The person who sets direction and assigns responsibilities.",
        scores: { leader: 3, disciplined: 1 },
      },
      {
        id: "B",
        text: "The person who analyzes problems and verifies accuracy.",
        scores: { analytical: 3 },
      },
      {
        id: "C",
        text: "The person who proposes new ideas and solutions.",
        scores: { creative: 3 },
      },
      {
        id: "D",
        text: "The person who connects members and resolves conflicts.",
        scores: { empathetic: 2, social: 2 },
      },
    ],
  },
  {
    id: 8,
    question: "What motivates you to work harder?",
    options: [
      {
        id: "A",
        text: "Achieving better scores or results than others.",
        scores: { competitive: 3 },
      },
      {
        id: "B",
        text: "Seeing myself improve every day.",
        scores: { disciplined: 2, curious: 1 },
      },
      {
        id: "C",
        text: "Creating something useful or original.",
        scores: { creative: 3 },
      },
      {
        id: "D",
        text: "Helping others and creating a positive impact.",
        scores: { empathetic: 3 },
      },
    ],
  },
  {
    id: 9,
    question: "How do you usually handle deadlines?",
    options: [
      {
        id: "A",
        text: "Finish early to leave time for review.",
        scores: { disciplined: 3, analytical: 1 },
      },
      {
        id: "B",
        text: "Divide the work and complete it through scheduled milestones.",
        scores: { disciplined: 2, leader: 1 },
      },
      {
        id: "C",
        text: "Work most effectively when the deadline is close.",
        scores: { adaptable: 2, competitive: 1 },
      },
      {
        id: "D",
        text: "The deadline is less important if the work has not reached the desired quality.",
        scores: { creative: 2, independent: 1 },
      },
    ],
  },
  {
    id: 10,
    question: "How do you usually respond to negative feedback?",
    options: [
      {
        id: "A",
        text: "Analyze the feedback to determine which parts are valid.",
        scores: { analytical: 3 },
      },
      {
        id: "B",
        text: "Immediately correct the issues mentioned.",
        scores: { disciplined: 2, adaptable: 1 },
      },
      {
        id: "C",
        text: "Discuss it further to understand the other person's perspective.",
        scores: { social: 2, empathetic: 1 },
      },
      {
        id: "D",
        text: "Only make changes when I genuinely agree with the feedback.",
        scores: { independent: 3 },
      },
    ],
  },
  {
    id: 11,
    question: "What do you mainly rely on when making an important decision?",
    options: [
      {
        id: "A",
        text: "Data, evidence, and logic.",
        scores: { analytical: 3 },
      },
      {
        id: "B",
        text: "Intuition and personal experience.",
        scores: { independent: 2, creative: 1 },
      },
      {
        id: "C",
        text: "The opinions of the people involved.",
        scores: { empathetic: 2, social: 1 },
      },
      {
        id: "D",
        text: "The option most likely to produce the best future outcome.",
        scores: { competitive: 2, leader: 1 },
      },
    ],
  },
  {
    id: 12,
    question: "How do you feel when a plan suddenly changes?",
    options: [
      {
        id: "A",
        text: "Uncomfortable because I prefer things to follow the original plan.",
        scores: { disciplined: 3 },
      },
      {
        id: "B",
        text: "I quickly adapt and find a new solution.",
        scores: { adaptable: 3 },
      },
      {
        id: "C",
        text: "I see it as an opportunity to try a better approach.",
        scores: { creative: 2, adaptable: 1 },
      },
      {
        id: "D",
        text: "I want to understand the reason for the change before acting.",
        scores: { analytical: 2, disciplined: 1 },
      },
    ],
  },
  {
    id: 13,
    question: "What do you usually do when you have a new idea?",
    options: [
      {
        id: "A",
        text: "Write it down and evaluate its feasibility.",
        scores: { analytical: 2, creative: 1 },
      },
      {
        id: "B",
        text: "Test it immediately on a small scale.",
        scores: { creative: 2, adaptable: 1 },
      },
      {
        id: "C",
        text: "Share it with others to receive feedback.",
        scores: { social: 2, creative: 1 },
      },
      {
        id: "D",
        text: "Keep it private and develop it independently until it is mature.",
        scores: { independent: 2, disciplined: 1 },
      },
    ],
  },
  {
    id: 14,
    question: "Which environment helps you perform at your best?",
    options: [
      {
        id: "A",
        text: "A quiet, stable environment with minimal interruptions.",
        scores: { independent: 2, disciplined: 1 },
      },
      {
        id: "B",
        text: "An environment with ambitious goals and clear competition.",
        scores: { competitive: 3 },
      },
      {
        id: "C",
        text: "A flexible environment that allows freedom and experimentation.",
        scores: { creative: 3, adaptable: 1 },
      },
      {
        id: "D",
        text: "A supportive environment with frequent interaction.",
        scores: { social: 3, empathetic: 1 },
      },
    ],
  },
  {
    id: 15,
    question: "Which quality would you most like to strengthen in the future?",
    options: [
      {
        id: "A",
        text: "Logical thinking and problem-solving ability.",
        scores: { analytical: 3 },
      },
      {
        id: "B",
        text: "Discipline and the ability to sustain long-term goals.",
        scores: { disciplined: 3 },
      },
      {
        id: "C",
        text: "Confidence in communication and leadership.",
        scores: { social: 2, leader: 2 },
      },
      {
        id: "D",
        text: "Creativity and the ability to produce original ideas.",
        scores: { creative: 3 },
      },
      {
        id: "E",
        text: "The ability to understand, connect with, and support others.",
        scores: { empathetic: 3 },
      },
      {
        id: "F",
        text: "Flexibility and the ability to adapt to change.",
        scores: { adaptable: 3 },
      },
    ],
  },
];

const SurveyModal = ({
  isOpen,
  embedded = false,
  onClose,
  onSkip,
  onComplete,
}: SurveyModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalQuestions = surveyQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (!embedded) {
        document.body.style.overflow = "hidden";
      }
      setCurrentQuestionIndex(0);
      setAnswers({});
    } else {
      setTimeout(() => setIsVisible(false), 300);
      if (!embedded) {
        document.body.style.overflow = "unset";
      }
    }
    return () => {
      if (!embedded) {
        document.body.style.overflow = "unset";
      }
    };
  }, [isOpen, embedded]);

  const handleNext = (currentAnswers = answers) => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
    } else {
      if (onComplete) onComplete(currentAnswers);
      else onClose?.();
    }
  };

  const handlePrevious = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleOptionClick = (id: string) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: id };
    setAnswers(newAnswers);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Auto-advance after a short delay
    timeoutRef.current = setTimeout(() => {
      handleNext(newAnswers);
    }, 350);
  };

  if (!isOpen && !isVisible) return null;

  const currentQuestion = surveyQuestions[currentQuestionIndex];
  if (!currentQuestion) return null;
  const selectedOption = answers[currentQuestionIndex];

  const surveyCard = (
    <div
      ref={modalRef}
      className={`relative w-full max-w-[560px] flex flex-col items-center transition-all duration-300 transform ${
        isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
      }`}
    >
      {/* Mascot avatar overlapping card top */}
      <div className="relative z-10 -mb-10 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-2 border-[#d4a8d4]/40 bg-[#0d151c] p-1 shadow-[0_0_30px_rgba(212,168,212,0.25)]">
          <img
            src={mascotAxolotl}
            alt="Devcopet mascot"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>

      <div className="w-full bg-white dark:bg-[#0d151c] rounded-2xl border border-gray-200 dark:border-[#1e293b] overflow-hidden shadow-2xl relative flex flex-col max-h-[calc(100vh-200px)]">
        <div className="w-full h-1 bg-gray-200 dark:bg-[#1e293b] shrink-0">
          <div
            className="h-full bg-[#d4a8d4] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="pt-12 px-6 pb-6 md:px-8 md:pb-8 flex-1 overflow-y-auto">
          <div className="text-center mb-8">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-gray-500 dark:text-[#64748b] uppercase block mb-4">
              QUESTION {currentQuestionIndex + 1} OF {totalQuestions}
            </span>
            <h2 className="text-[22px] md:text-[28px] font-extrabold text-gray-900 dark:text-white leading-snug">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 group ${
                  selectedOption === option.id
                    ? "border-[#d4a8d4] bg-[#d4a8d4]/10"
                    : "border-gray-200 dark:border-[#1e293b] bg-gray-50 dark:bg-[#151e29] hover:border-gray-400 dark:hover:border-[#475569] hover:bg-gray-100 dark:hover:bg-[#1a2b3c]"
                }`}
              >
                <div
                  className={`w-7 h-7 shrink-0 rounded-full border flex items-center justify-center text-[11px] font-bold transition-colors ${
                    selectedOption === option.id
                      ? "border-[#d4a8d4] text-[#d4a8d4] bg-[#d4a8d4]/20"
                      : "border-gray-400 dark:border-[#475569] text-gray-500 dark:text-[#94a3b8] group-hover:border-gray-600 dark:group-hover:border-[#94a3b8] group-hover:text-gray-800 dark:group-hover:text-white"
                  }`}
                >
                  {option.id}
                </div>
                <span
                  className={`text-[14px] md:text-[15px] transition-colors ${
                    selectedOption === option.id
                      ? "text-gray-900 dark:text-white font-medium"
                      : "text-gray-600 dark:text-[#cbd5e1] group-hover:text-gray-900 dark:group-hover:text-white"
                  }`}
                >
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 md:px-8 bg-gray-50 dark:bg-[#0d151c] border-t border-gray-200 dark:border-[#1e293b] flex items-center justify-between shrink-0">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider transition-colors ${
              currentQuestionIndex === 0
                ? "text-gray-300 dark:text-[#334155] cursor-not-allowed"
                : "text-gray-500 dark:text-[#64748b] hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Previous Question
          </button>

          {!embedded && (
            <button
              onClick={onSkip || onClose}
              className="text-[13px] font-bold text-gray-500 dark:text-[#64748b] hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Skip Survey
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <div className="w-12 h-2 rounded-full bg-gray-300 dark:bg-[#1e293b] transition-all duration-300" />
        <div className="w-12 h-2 rounded-full bg-[#d4a8d4] transition-all duration-300" />
        <div className="w-12 h-2 rounded-full bg-gray-300 dark:bg-[#1e293b] transition-all duration-300" />
      </div>
    </div>
  );

  if (embedded) {
    if (!isOpen && !isVisible) return null;
    return (
      <div className="w-full flex items-center justify-center py-4">
        {surveyCard}
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[110] flex items-center justify-center bg-white/80 dark:bg-[#0a1118]/90 backdrop-blur-md px-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {surveyCard}
    </div>
  );
};

export default SurveyModal;
