const QuestionBoard = () => {
  return (
    <div className="w-full max-w-4xl mx-auto dark:bg-[#101820] bg-surface-container border dark:border-white/5 border-outline/10 rounded-3xl p-8 pt-12 relative shadow-2xl mt-8 transition-colors duration-300">
      {/* Top Tag */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 dark:bg-[#2d3a35] bg-tertiary-container dark:text-[#8ab4a0] text-on-tertiary-container text-[11px] font-bold px-4 py-1.5 rounded-full tracking-wider border dark:border-[#40544c] border-tertiary/20 transition-colors duration-300">
        JavaScript • Level 4
      </div>

      {/* Question Text */}
      <h2 className="text-[28px] font-extrabold dark:text-[#e2e8f0] text-on-surface text-center leading-tight mb-8 transition-colors duration-300">
        What is the output of{" "}
        <code className="dark:bg-white/10 bg-surface-container-highest px-2 py-0.5 rounded dark:text-[#cbd5e1] text-on-surface font-mono text-[26px]">
          `typeof null`
        </code>{" "}
        in JavaScript?
      </h2>

      {/* Code Block */}
      <div className="w-full dark:bg-[#0b1116] bg-surface-container-highest rounded-xl p-6 border dark:border-white/5 border-outline/10 shadow-inner transition-colors duration-300">
        <pre className="font-mono text-[14px] leading-relaxed">
          <span className="dark:text-[#56b6c2] text-[#008080]">const</span>{" "}
          <span className="dark:text-[#e5c07b] text-[#0000ff]">result</span>{" "}
          <span className="dark:text-[#56b6c2] text-[#008080]">=</span>{" "}
          <span className="dark:text-[#c678dd] text-[#af00db]">typeof</span>{" "}
          <span className="dark:text-[#d19a66] text-[#098658]">null</span>;
          <br />
          <span className="dark:text-[#e06c75] text-[#001080]">console</span>.
          <span className="dark:text-[#61afef] text-[#795e26]">log</span>(
          <span className="dark:text-[#e5c07b] text-[#0000ff]">result</span>);
        </pre>
      </div>
    </div>
  );
};

export default QuestionBoard;
