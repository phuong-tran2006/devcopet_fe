interface QuestionBoardProps {
  title?: string;
  question?: string;
  difficulty?: string;
  conceptTags?: string[];
  codeSnippet?: { language: string; code: string } | null;
  questionIndex?: number;
  totalQuestions?: number;
}

const QuestionBoard = ({
  title,
  question,
  difficulty,
  conceptTags = [],
  codeSnippet,
  questionIndex = 0,
  totalQuestions = 0,
}: QuestionBoardProps) => {
  const tagText = [
    totalQuestions ? `Question ${questionIndex + 1}/${totalQuestions}` : null,
    difficulty,
    ...conceptTags.slice(0, 2),
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <div className="w-full max-w-3xl mx-auto dark:bg-[#101820] bg-surface-container border dark:border-white/5 border-outline/10 rounded-2xl p-5 pt-8 relative shadow-xl mt-4 transition-colors duration-300">
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 dark:bg-[#2d3a35] bg-tertiary-container dark:text-[#8ab4a0] text-on-tertiary-container text-[10px] font-black px-3 py-1 rounded-full tracking-wider border dark:border-[#40544c] border-tertiary/20 transition-colors duration-300 max-w-[90%] truncate">
        {tagText || "Arena Question"}
      </div>

      {title && (
        <p className="text-center uppercase tracking-[0.12em] text-[11px] font-black dark:text-[#4dd0d0] text-primary mb-2">
          {title}
        </p>
      )}

      <h2 className="text-[22px] font-extrabold dark:text-[#e2e8f0] text-on-surface text-center leading-snug mb-4 transition-colors duration-300">
        {question || "Waiting for the next question..."}
      </h2>

      {codeSnippet?.code && (
        <div className="w-full dark:bg-[#0b1116] bg-surface-container-highest rounded-xl p-4 border dark:border-white/5 border-outline/10 shadow-inner transition-colors duration-300 overflow-x-auto">
          <div className="dark:text-gray-500 text-on-surface-variant text-[10px] uppercase font-black tracking-wider mb-2">
            {codeSnippet.language || "code"}
          </div>
          <pre className="font-mono text-[13px] leading-relaxed dark:text-[#d6deeb] text-on-surface whitespace-pre-wrap">
            {codeSnippet.code}
          </pre>
        </div>
      )}
    </div>
  );
};

export default QuestionBoard;
