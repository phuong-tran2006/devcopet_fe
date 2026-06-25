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
  textClass, // kept in signature for interface compatibility
  onClick,
  disabled = false,
  isSelected = false,
  state = "neutral",
}: OptionButtonProps) => {
  let btnClasses = "";
  let badgeClasses = "";
  let optionTextClasses = "";

  if (state === "correct") {
    btnClasses =
      "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-md";
    optionTextClasses = "text-emerald-900 dark:text-emerald-300 font-bold";
    badgeClasses = "bg-emerald-600 text-white shadow-inner";
  } else if (state === "wrong") {
    btnClasses = "border-red-500 bg-red-50 dark:bg-red-950/20 shadow-md";
    optionTextClasses = "text-red-900 dark:text-red-300 font-bold";
    badgeClasses = "bg-red-600 text-white shadow-inner";
  } else if (isSelected) {
    btnClasses =
      "border-2 border-teal-600 dark:border-2 dark:border-[#4dd0d0] bg-teal-50 dark:bg-[#4dd0d0]/20 shadow-md ring-2 ring-teal-500/20 dark:ring-[#4dd0d0]/20";
    optionTextClasses = "text-teal-950 dark:text-white font-extrabold";
    badgeClasses =
      "bg-teal-600 dark:bg-[#4dd0d0] text-white dark:text-[#0c1013] shadow-inner";
  } else {
    // Neutral state: White background in light theme for pure contrast, border-slate-300
    btnClasses =
      "bg-white hover:bg-slate-50 dark:bg-[#16202a] dark:hover:bg-[#1a2632] border-slate-300/80 dark:border-slate-800/80 shadow-sm hover:border-slate-400 dark:hover:border-slate-700";
    optionTextClasses = "text-slate-800 dark:text-[#e2e8f0]";
    badgeClasses = `${bgColorClass} text-white shadow-inner`;
  }

  const disabledClasses = disabled
    ? "cursor-not-allowed opacity-85"
    : "cursor-pointer active:scale-[0.99]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full border rounded-xl min-h-[62px] flex items-center px-3 overflow-hidden transition-all duration-200 text-left ${btnClasses} ${disabledClasses}`}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 opacity-90 transition-colors duration-300"
        style={{ backgroundColor: colorHex }}
      />

      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center ml-1.5 mr-3 font-bold text-[16px] transition-all duration-300 shrink-0 ${badgeClasses}`}
      >
        {letter}
      </div>

      <span
        className={`font-semibold text-[14px] text-left transition-colors duration-300 ${optionTextClasses}`}
      >
        {text}
      </span>
    </button>
  );
};

export default OptionButton;
