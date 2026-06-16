import { useEffect, useRef, useState } from "react";
import heroMascotVideo from "../../assets/videos/7936438193787.mp4";
import TransparentVideo from "../../components/ui/TransparentVideo";

interface NamePetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

const randomNames = [
  "Byte",
  "Pixel",
  "Glitch",
  "Cyber",
  "Neon",
  "Syntax",
  "Logic",
  "Nexus",
  "Spark",
  "Quantum",
  "Echo",
  "Atlas",
  "Cipher",
  "Nova",
  "Apollo",
];

const NamePetModal = ({ isOpen, onConfirm }: NamePetModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [petName, setPetName] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  const handleRandomName = () => {
    const random = randomNames[Math.floor(Math.random() * randomNames.length)];
    setPetName(random);
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
      setPetName("");
    } else {
      setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-white/90 dark:bg-[#0a1118]/95 backdrop-blur-md px-4 transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-[500px] flex flex-col items-center transition-all duration-500 transform ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        }`}
      >
        {/* Header Text */}
        <div className="text-center mb-8">
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-gray-900 dark:text-white leading-tight mb-3">
            A new friend has
            <br />
            arrived!
          </h1>
          <p className="text-gray-500 dark:text-[#94a3b8] text-[15px] md:text-[16px]">
            It's time to give your coding companion a name.
          </p>
        </div>

        {/* Mascot Area */}
        <div className="relative w-full max-w-[352px] flex items-center justify-center mb-8 shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed-dim/15 via-cyan-400/8 to-secondary-fixed-dim/15 blur-3xl scale-110 pointer-events-none rounded-full" />
          <TransparentVideo
            src={heroMascotVideo}
            className="h-auto w-48 object-contain sm:w-56 md:w-64"
            keyColor={[0, 200, 0]}
            tolerance={80}
          />
        </div>

        {/* Input Card */}
        <div className="w-full bg-white dark:bg-[#151e29] border border-gray-200 dark:border-[#1e293b] rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-[10px] font-extrabold tracking-[0.15em] text-gray-500 dark:text-[#94a3b8] uppercase pl-1">
              NAME YOUR AXOLOTL
            </label>
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={handleRandomName}
                title="Generate random name"
                className="absolute left-4 z-10 text-gray-400 dark:text-[#64748b] hover:text-purple-500 dark:hover:text-[#d4a8d4] material-symbols-outlined text-[18px] transition-colors"
              >
                edit
              </button>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="e.g. Byte, Pixel, Glitch..."
                className="w-full bg-gray-50 dark:bg-[#0d151c] border border-gray-200 dark:border-[#1e293b] text-gray-900 dark:text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-[#d4a8d4] focus:ring-1 focus:ring-[#d4a8d4] transition-all placeholder:text-gray-400 dark:placeholder:text-[#475569] text-[15px]"
                autoFocus
              />
            </div>
          </div>

          <button
            onClick={() => petName.trim() && onConfirm(petName.trim())}
            disabled={!petName.trim()}
            className={`w-full py-3.5 rounded-xl text-[15px] font-extrabold flex items-center justify-center gap-2 transition-all duration-300 ${
              petName.trim()
                ? "bg-[#e8bce1] text-[#4a2e4f] hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(232,188,225,0.3)]"
                : "bg-gray-200 dark:bg-[#1e293b] text-gray-400 dark:text-[#64748b] cursor-not-allowed"
            }`}
          >
            Confirm & Start Journey
          </button>
        </div>
      </div>

      {/* Pagination Dots (Step 3 Active) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div className="w-12 h-2 rounded-full bg-gray-300 dark:bg-[#1e293b] transition-all duration-300" />
        <div className="w-12 h-2 rounded-full bg-gray-300 dark:bg-[#1e293b] transition-all duration-300" />
        <div className="w-12 h-2 rounded-full bg-[#d4a8d4] transition-all duration-300" />
      </div>
    </div>
  );
};

export default NamePetModal;
