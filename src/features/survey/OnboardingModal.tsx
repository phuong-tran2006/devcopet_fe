import { useEffect, useRef, useState } from "react";
import heroMascotVideo from "../../assets/videos/video.mp4";
import TransparentVideo from "../../components/ui/TransparentVideo";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBeginSurvey?: () => void;
}

const OnboardingModal = ({
  isOpen,
  onClose,
  onBeginSurvey,
}: OnboardingModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => setIsVisible(false), 300); // match transition duration
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-[#0a1118]/90 backdrop-blur-md px-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-[1280px] flex flex-col lg:flex-row gap-16 md:gap-24 lg:gap-32 items-center justify-between p-8 pb-20 md:p-12 md:pb-24 transition-all duration-300 transform ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        }`}
      >
        {/* Left Side: Mascot Video in Glow Box */}
        <div className="flex-1 w-full max-w-[540px] relative shrink-0">
          {/* Subtle background circular lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[100%] h-[100%] rounded-full border border-sky-400/20 dark:border-[#0ea5e9]/20 absolute animate-[spin_60s_linear_infinite]" />
            <div className="w-[85%] h-[85%] rounded-full border border-teal-400/20 dark:border-[#2dd4bf]/20 absolute animate-[spin_40s_linear_infinite_reverse]" />
          </div>

          {/* Main glowing container */}
          <div className="relative aspect-square w-full bg-gray-50 dark:bg-[#0d151c] rounded-full border border-gray-200 dark:border-[#1e293b] shadow-[0_0_50px_rgba(45,212,191,0.15)] flex items-center justify-center overflow-hidden group">
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0ea5e9]/10 to-transparent opacity-50 rounded-full" />

            <TransparentVideo
              src={heroMascotVideo}
              className="absolute w-[200%] h-[200%] flex items-center justify-center drop-shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-transform duration-700 group-hover:scale-105"
              keyColor={[0, 255, 0]}
              tolerance={190}
            />
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 w-full text-left space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-gradient-to-r from-pink-400 to-purple-400" />
              <span className="text-[12px] font-bold tracking-[0.2em] text-gray-500 dark:text-[#94a3b8] uppercase">
                ONBOARDING PHASE 01
              </span>
            </div>

            <h2 className="text-[32px] md:text-[40px] font-extrabold text-gray-900 dark:text-white leading-tight">
              Meet Your New <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2dd4bf] to-[#0ea5e9]">
                Coding Companion
              </span>
            </h2>

            <p className="text-gray-600 dark:text-[#94a3b8] text-[16px] leading-relaxed max-w-lg">
              Complete the Pet Personality Survey to synchronize Devcopet with
              your unique learning style. Your companion adapts its personality
              and guidance based on how you grow.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {/* Feature Card 1 */}
            <div className="bg-white dark:bg-[#151e29] border border-gray-200 dark:border-[#1e293b] rounded-xl p-4 flex gap-4 items-start hover:border-[#2dd4bf]/40 dark:hover:border-[#2dd4bf]/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-[#1a2b3c] flex items-center justify-center text-teal-600 dark:text-[#2dd4bf] shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  psychology
                </span>
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-white font-bold text-[15px] mb-1">
                  Personalized Guidance
                </h4>
                <p className="text-gray-500 dark:text-[#64748b] text-[13px] leading-snug">
                  Your Axolotl adjusts its technical explanations to match your
                  current proficiency level and goals.
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white dark:bg-[#151e29] border border-gray-200 dark:border-[#1e293b] rounded-xl p-4 flex gap-4 items-start hover:border-[#a78bfa]/40 dark:hover:border-[#a78bfa]/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-[#1a2336] flex items-center justify-center text-purple-600 dark:text-[#a78bfa] shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  forum
                </span>
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-white font-bold text-[15px] mb-1">
                  Tailored Feedback
                </h4>
                <p className="text-gray-500 dark:text-[#64748b] text-[13px] leading-snug">
                  Receive code reviews and mentorship in a style that motivates
                  you—from direct and strict to supportive.
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white dark:bg-[#151e29] border border-gray-200 dark:border-[#1e293b] rounded-xl p-4 flex gap-4 items-start hover:border-[#4ade80]/40 dark:hover:border-[#4ade80]/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-[#182a22] flex items-center justify-center text-green-600 dark:text-[#4ade80] shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  trending_up
                </span>
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-white font-bold text-[15px] mb-1">
                  Growth Together
                </h4>
                <p className="text-gray-500 dark:text-[#64748b] text-[13px] leading-snug">
                  As you master new Python concepts, your companion evolves its
                  visual form and unlocks advanced tools.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6">
            <button
              onClick={onBeginSurvey}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-[#e8bce1] to-[#d4a8d4] text-[#4a2e4f] font-extrabold text-[15px] py-3 px-8 rounded-lg hover:brightness-110 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(232,188,225,0.3)]"
            >
              Begin Survey{" "}
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 md:flex-none text-gray-600 dark:text-[#94a3b8] font-semibold text-[15px] py-3 px-8 rounded-lg border border-gray-200 dark:border-[#1e293b] bg-white dark:bg-[#151e29] hover:bg-gray-50 dark:hover:bg-[#1a2b3c] hover:text-gray-900 dark:hover:text-white active:scale-95 transition-all duration-300"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div className="w-10 h-1.5 rounded-full bg-[#d4a8d4]" />
        <div className="w-10 h-1.5 rounded-full bg-gray-300 dark:bg-[#1e293b]" />
        <div className="w-10 h-1.5 rounded-full bg-gray-300 dark:bg-[#1e293b]" />
      </div>
    </div>
  );
};

export default OnboardingModal;
