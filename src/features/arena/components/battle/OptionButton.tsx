interface OptionButtonProps {
  letter: string;
  text: string;
  colorHex: string;
  bgColorClass: string;
  textClass: string;
  onClick?: () => void;
}

const OptionButton = ({
  letter,
  text,
  colorHex,
  bgColorClass,
  textClass,
  onClick,
}: OptionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="relative w-full dark:bg-[#16202a] bg-surface-container-high dark:hover:bg-[#1a2632] hover:bg-surface-container-highest border dark:border-white/5 border-outline/10 rounded-xl h-[80px] flex items-center px-4 overflow-hidden shadow-lg group transition-all duration-200"
    >
      {/* Left Edge Indicator */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 opacity-80 transition-colors duration-300"
        style={{ backgroundColor: colorHex }}
      />

      {/* Letter Box */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ml-2 mr-4 font-bold text-[18px] text-white shadow-inner transition-colors duration-300 ${bgColorClass}`}
      >
        {letter}
      </div>

      {/* Answer Text */}
      <span
        className={`font-semibold text-[16px] text-left transition-colors duration-300 ${textClass}`}
      >
        {text}
      </span>
    </button>
  );
};

export default OptionButton;
