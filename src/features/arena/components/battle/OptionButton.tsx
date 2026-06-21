interface OptionButtonProps {
  letter: string;
  text: string;
  colorHex: string;
  bgColorClass: string;
  textClass: string;
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean;
  state?: "correct" | "wrong" | "neutral";
}

const OptionButton = ({
  letter,
  text,
  colorHex,
  bgColorClass,
  textClass,
  onClick,
  disabled = false,
  isSelected = false,
  state = "neutral",
}: OptionButtonProps) => {
  const stateClass =
    state === "correct"
      ? "border-[#4fd1c5] dark:bg-[#183133] bg-tertiary-container"
      : state === "wrong"
        ? "border-error dark:bg-[#3a2024] bg-error/15"
        : isSelected
          ? "border-primary dark:bg-[#18313a] bg-primary/10"
          : "dark:border-white/5 border-outline/10";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full dark:bg-[#16202a] bg-surface-container-high dark:hover:bg-[#1a2632] hover:bg-surface-container-highest border rounded-xl min-h-[62px] flex items-center px-3 overflow-hidden shadow-lg group transition-all duration-200 text-left disabled:cursor-not-allowed disabled:opacity-70 ${stateClass}`}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 opacity-80 transition-colors duration-300"
        style={{ backgroundColor: colorHex }}
      />

      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center ml-1.5 mr-3 font-bold text-[16px] text-white shadow-inner transition-colors duration-300 shrink-0 ${bgColorClass}`}
      >
        {letter}
      </div>

      <span
        className={`font-semibold text-[14px] text-left transition-colors duration-300 ${textClass}`}
      >
        {text}
      </span>
    </button>
  );
};

export default OptionButton;
