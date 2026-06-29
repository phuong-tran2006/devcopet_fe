// @ts-nocheck
import LucideIcon from "../../../components/ui/LucideIcon";
import React, { useState } from "react";
import { useAuthStore } from "../../users/store/auth.store";

// --- MOCK DATA ---
const mockQuestions = [
  {
    id: 1,
    type: "multiple_choice",
    objective: "Which operator is used to check for equality?",
    time: "02:45",
    options: [
      { id: "A", text: "=" },
      { id: "B", text: "==" },
      { id: "C", text: "≠" },
      { id: "D", text: "<" },
    ],
    correctOption: "B",
    codeSnippet: {
      title: "Main.py",
      content: `# Comparison Logic\n\nuser_score = 100\npassing_score = 100\n\nif user_score ?? passing_score:\n    print("Mission accomplished!")`,
      replaceTarget: "??",
    },
    hint: "Don't give up! Try to check the space in line 3.",
  },
  {
    id: 2,
    type: "drag_and_drop",
    objective:
      "Create a loop that prints the names of all the pets in your inventory.",
    time: "02:45",
    blocks: [
      { id: "b1", text: "for pet in creatures:" },
      { id: "b2", text: "print(pet)" },
      { id: "b3", text: "while count < 3:" },
      { id: "b4", text: 'if pet == "Dragon":' },
      { id: "b5", text: "creatures.append\\n(new_pet)" },
    ],
    correctBlocks: ["b1", "b2"],
    hint: "Don't give up! Try to check the space in line 3.",
  },
  {
    id: 3,
    type: "review",
    objective: "Review Mission",
    challengeName: "Challenge #42: The Loop Paradox",
    accuracy: "100%",
    codeSnippet: `let count = 0;\nfor (let i = 0; i < 3; i++) {\n  count += i;\n}\nconsole.log(count);`,
    options: [
      { id: "A", text: "0", isCorrect: false },
      { id: "B", text: "3", isCorrect: true, selected: true },
      { id: "C", text: "6", isCorrect: false },
      { id: "D", text: "Error", isCorrect: false },
    ],
    explanation: {
      title: "Personal Explanation",
      quote:
        "As a Beta Novice, you might find it helpful to think of for-loops as a cosmic relay race.",
      text: "Each lap (iteration), the runner passes a baton (the value of i) to the next teammate. In this race, we had 3 laps:\n\n<span class='text-[#F687B3] font-mono'>Lap 1: i = 0 (Total: 0)</span>\n<span class='text-[#F687B3] font-mono'>Lap 2: i = 1 (Total: 1)</span>\n<span class='text-[#F687B3] font-mono'>Lap 3: i = 2 (Total: 3)</span>\n\nThe race stops before i hits 3 because the boundary is i < 3. Great job calculating the sum of lap values!",
      mastery: 85,
    },
  },
];

const QuizPage = () => {
  const currentUser = useAuthStore((state) => state.user);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [placedBlocks, setPlacedBlocks] = useState<(string | null)[]>([
    null,
    null,
  ]);

  const q = mockQuestions[currentIdx];
  const userLevel = currentUser?.level ?? 1;
  const userExp = Number(currentUser?.lifetimeXp ?? 0);
  const userStars = currentUser?.coins ?? 0;
  const nextLevelXp = Number(currentUser?.nextLevelXp ?? 1000);
  const levelProgress = nextLevelXp > 0 ? Math.min(100, Math.round((userExp / nextLevelXp) * 100)) : 0;

  const handleNext = () => {
    if (currentIdx < mockQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setPlacedBlocks([null, null]);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const renderSidebar = () => (
    <div className="w-[280px] bg-background border-r border-outline/20 flex flex-col h-full shrink-0 hidden md:flex">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-surface-container rounded-xl border border-outline/20 p-1 flex items-center justify-center overflow-hidden shadow-inner">
            <img
              src="/src/assets/images/axolot_smile.png"
              alt="Avatar"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.innerHTML = "🐉";
              }}
            />
          </div>
          <div>
            <div className="text-[13px] text-on-surface font-bold">
              Level {userLevel}
            </div>
            <div className="text-[11px] text-on-surface-variant">
              Data Novice
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-10">
          <div className="bg-surface-container/50 border border-outline/10 rounded-full px-4 py-2 flex items-center gap-2 w-max">
            <LucideIcon
              name="add_circle"
              className="text-[#4ade80] text-[16px]"
            />
            <span className="text-[13px] font-bold text-on-surface-variant">
              {userExp.toLocaleString()} XP
            </span>
          </div>
          <div className="bg-surface-container/50 border border-outline/10 rounded-full px-4 py-2 flex items-center gap-2 w-max">
            <LucideIcon name="star" className="text-[#38bdf8] text-[16px]" />
            <span className="text-[13px] font-bold text-on-surface-variant">
              {userStars.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
            Level {userLevel}
          </span>
          <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden border border-outline/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-fixed-dim to-[#D8BFD8] shadow-[0_0_10px_rgba(216,191,216,0.5)]"
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-6">
        <button className="w-full bg-surface-container/50 border border-outline/20 hover:border-primary-fixed-dim/50 hover:bg-primary-fixed-dim/10 text-on-surface-variant hover:text-primary-fixed-dim font-bold text-[13px] py-3 rounded-xl transition-all uppercase tracking-widest shadow-sm">
          UPGRADE TO PRO
        </button>
      </div>
    </div>
  );

  const renderMultipleChoice = () => {
    let codeStr =
      typeof q.codeSnippet === "string"
        ? q.codeSnippet
        : q.codeSnippet?.content || "";
    if (q.type === "multiple_choice" && selectedOption) {
      const opt = q.options?.find((o) => o.id === selectedOption);
      if (opt) {
        codeStr = codeStr.replace("??", opt.text);
      }
    }

    return (
      <div className="flex flex-col xl:flex-row gap-6 w-full h-full">
        {/* Left Pane - Options */}
        <div className="flex-1 flex flex-col w-full xl:max-w-[400px]">
          <div className="flex items-center gap-2 mb-6">
            <LucideIcon name="help" className="text-[#F687B3] text-[20px]" />
            <h3 className="text-[16px] font-bold text-on-surface">
              Knowledge Check
            </h3>
          </div>
          <div className="flex flex-col gap-4">
            {q.options?.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedOption(opt.id)}
                className={`w-full text-left rounded-xl p-4 border transition-all duration-300 flex items-center gap-4 group ${
                  selectedOption === opt.id
                    ? "bg-primary-fixed-dim/10 border-primary-fixed-dim shadow-[0_0_15px_rgba(0,128,128,0.2)]"
                    : "bg-surface-container/30 border-outline/10 hover:border-outline/30 hover:bg-surface-container/60"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-[13px] ${
                    selectedOption === opt.id
                      ? "bg-primary-fixed-dim text-[#002020]"
                      : "bg-surface-container border border-outline/20 text-on-surface-variant group-hover:text-on-surface"
                  }`}
                >
                  {opt.id}
                </div>
                <div className="font-mono text-[16px] font-bold text-on-surface tracking-wider">
                  {opt.text}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane - Editor */}
        <div className="flex-[2] flex flex-col bg-[#161B22] rounded-2xl border border-outline/20 overflow-hidden shadow-2xl relative min-h-[400px]">
          <div className="bg-[#0D1117] border-b border-outline/10 px-4 py-2 flex items-center gap-2">
            <LucideIcon name="code" className="text-[#8a8e94] text-[14px]" />
            <span className="text-[#8a8e94] text-[12px] font-mono font-bold">
              Main.py
            </span>
          </div>
          <div className="p-6 font-mono text-[15px] leading-loose">
            {codeStr.split("\\n").map((line, i) => {
              if (line.startsWith("#")) {
                return (
                  <div key={i} className="text-[#c084fc] mb-4">
                    {line}
                  </div>
                );
              }
              const renderedLine = line.split("??").map((part, idx, arr) => (
                <React.Fragment key={idx}>
                  <span
                    className={
                      line.includes("print")
                        ? "text-[#4ade80]"
                        : "text-[#d1d5db]"
                    }
                  >
                    {part}
                  </span>
                  {idx < arr.length - 1 && (
                    <span className="bg-surface-container border border-outline/20 px-2 py-0.5 rounded text-on-surface-variant animate-pulse">
                      ??
                    </span>
                  )}
                </React.Fragment>
              ));
              return (
                <div key={i} className="pl-4">
                  {renderedLine}
                </div>
              );
            })}
          </div>

          {/* Hint Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[500px] bg-surface-container-high border border-outline/20 rounded-2xl p-4 shadow-xl flex gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-container border border-outline/20 flex items-center justify-center shrink-0 overflow-hidden relative">
              <img
                src="/src/assets/images/axolot_smile.png"
                alt="Axolotl"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4ade80] rounded-full border-2 border-surface-container-high"></div>
            </div>
            <div>
              <div className="text-[13px] text-on-surface font-bold mb-1">
                Pet Hint
              </div>
              <div className="text-[12px] text-on-surface-variant italic">
                "Need a hand? Drag me up to see a hint!"
              </div>
            </div>

            {/* Floating chat bubble */}
            <div className="absolute -top-16 -right-10 bg-surface border border-primary-fixed-dim/40 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,128,128,0.2)] max-w-[200px]">
              <div className="flex items-start gap-2">
                <LucideIcon
                  name="chat"
                  className=" text-[16px] text-primary-fixed-dim shrink-0"
                />
                <span className="text-[12px] text-on-surface font-medium leading-relaxed">
                  {q.hint}
                </span>
              </div>
              {/* Arrow */}
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-surface border-b border-r border-primary-fixed-dim/40 rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDragAndDrop = () => {
    const handleBlockClick = (blockId: string) => {
      // Find first empty slot
      const emptyIdx = placedBlocks.findIndex((b) => b === null);
      if (emptyIdx !== -1) {
        const newBlocks = [...placedBlocks];
        newBlocks[emptyIdx] = blockId;
        setPlacedBlocks(newBlocks);
      }
    };

    const handleSlotClick = (idx: number) => {
      // Remove block from slot
      if (placedBlocks[idx]) {
        const newBlocks = [...placedBlocks];
        newBlocks[idx] = null;
        setPlacedBlocks(newBlocks);
      }
    };

    return (
      <div className="flex flex-col xl:flex-row gap-6 w-full h-full">
        {/* Left Pane - Blocks */}
        <div className="flex-1 flex flex-col w-full xl:max-w-[400px]">
          <div className="flex items-center gap-2 mb-6">
            <LucideIcon
              name="view_module"
              className=" text-on-surface-variant text-[20px]"
            />
            <h3 className="text-[14px] font-mono text-on-surface-variant uppercase tracking-widest">
              Available Blocks
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {q.blocks?.map((block) => {
              const isUsed = placedBlocks.includes(block.id);
              return (
                <button
                  key={block.id}
                  onClick={() => !isUsed && handleBlockClick(block.id)}
                  disabled={isUsed}
                  className={`w-full text-left rounded-xl p-4 border transition-all duration-300 flex items-center gap-3 font-mono text-[14px] ${
                    isUsed
                      ? "bg-surface-container/20 border-outline/5 text-on-surface-variant/30 cursor-not-allowed opacity-50"
                      : "bg-[#1E252E] border-[#F687B3]/30 hover:border-[#F687B3] text-[#F687B3] shadow-[0_0_10px_rgba(246,135,179,0.1)] hover:-translate-y-0.5"
                  }`}
                >
                  <LucideIcon
                    name="drag_indicator"
                    className="text-[16px] opacity-50"
                  />
                  {block.text.split("\\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane - Editor with Drop Zones */}
        <div className="flex-[2] flex flex-col bg-[#161B22] rounded-2xl border border-outline/20 overflow-hidden shadow-2xl relative min-h-[500px]">
          <div className="bg-[#0D1117] border-b border-outline/10 px-4 py-2 flex items-center gap-2">
            <LucideIcon name="code" className="text-[#8a8e94] text-[14px]" />
            <span className="text-[#8a8e94] text-[12px] font-mono font-bold">
              Main.py
            </span>
          </div>
          <div className="p-6 font-mono text-[15px] leading-loose text-[#d1d5db] flex flex-col gap-2">
            <div className="flex gap-4">
              <span className="text-[#8a8e94] w-4 text-right">1</span>
              <span>creatures = ["Axolotl", "Dragon", "Griffin"]</span>
            </div>

            {/* Slot 1 */}
            <div className="flex gap-4 items-center">
              <span className="text-[#8a8e94] w-4 text-right">2</span>
              <button
                onClick={() => handleSlotClick(0)}
                className={`flex-1 border-2 border-dashed rounded-xl p-3 text-left transition-all ${
                  placedBlocks[0]
                    ? "border-[#4FD1C5]/50 bg-[#4FD1C5]/10 text-[#4FD1C5] border-solid"
                    : "border-outline/20 bg-surface-container/30 text-on-surface-variant/50 hover:border-outline/40"
                }`}
              >
                {placedBlocks[0]
                  ? q.blocks?.find((b) => b.id === placedBlocks[0])?.text
                  : "Drop block here"}
              </button>
            </div>

            {/* Slot 2 */}
            <div className="flex gap-4 items-center">
              <span className="text-[#8a8e94] w-4 text-right">3</span>
              <button
                onClick={() => handleSlotClick(1)}
                className={`flex-1 ml-8 border-2 border-dashed rounded-xl p-3 text-left transition-all ${
                  placedBlocks[1]
                    ? "border-[#F687B3]/50 bg-[#F687B3]/10 text-[#F687B3] border-solid"
                    : "border-outline/20 bg-surface-container/30 text-on-surface-variant/50 hover:border-outline/40"
                }`}
              >
                {placedBlocks[1]
                  ? q.blocks?.find((b) => b.id === placedBlocks[1])?.text
                  : "Drop block here"}
              </button>
            </div>

            {/* Slot 3 */}
            <div className="flex gap-4 items-center mt-2">
              <span className="text-[#8a8e94] w-4 text-right">4</span>
              <div className="flex-1 border-2 border-dashed border-outline/10 bg-surface-container/10 rounded-xl p-3 text-center text-on-surface-variant/30 text-[12px]">
                Drop block here
              </div>
            </div>
          </div>

          {/* Hint Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[500px] bg-surface-container-high border border-outline/20 rounded-2xl p-4 shadow-xl flex gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-container border border-outline/20 flex items-center justify-center shrink-0 overflow-hidden relative">
              <img
                src="/src/assets/images/axolot_smile.png"
                alt="Axolotl"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4ade80] rounded-full border-2 border-surface-container-high"></div>
            </div>
            <div>
              <div className="text-[13px] text-on-surface font-bold mb-1">
                Pet Hint
              </div>
              <div className="text-[12px] text-on-surface-variant italic">
                "Need a hand? Drag me up to see a hint!"
              </div>
            </div>

            {/* Floating chat bubble */}
            <div className="absolute -top-16 -right-10 bg-surface border border-primary-fixed-dim/40 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,128,128,0.2)] max-w-[200px]">
              <div className="flex items-start gap-2">
                <LucideIcon
                  name="chat"
                  className="text-[16px] text-primary-fixed-dim shrink-0"
                />
                <span className="text-[12px] text-on-surface font-medium leading-relaxed">
                  {q.hint}
                </span>
              </div>
              {/* Arrow */}
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-surface border-b border-r border-primary-fixed-dim/40 rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReview = () => {
    const codeSnippet =
      typeof q.codeSnippet === "string"
        ? q.codeSnippet
        : q.codeSnippet?.content || "";

    return (
      <div className="flex flex-col xl:flex-row gap-6 w-full h-full">
        {/* Left Pane - Code & Options */}
        <div className="flex-[2] flex flex-col w-full">
          <div className="mb-4">
            <h1 className="text-[40px] font-extrabold text-on-surface mb-2 tracking-tight">
              {q.objective}
            </h1>
            <h2 className="text-[16px] text-on-surface-variant font-medium">
              {q.challengeName}
            </h2>
          </div>

          <div className="bg-surface-container-high border border-outline/20 rounded-2xl p-6 shadow-xl mt-6">
            <p className="text-[15px] text-on-surface mb-6">
              What will be the output of this code snippet?
            </p>
            <div className="bg-[#1b2028] rounded-xl p-5 font-mono text-[14px] leading-relaxed text-[#d1d5db] border border-outline/10 mb-8">
              {codeSnippet.split("\\n").map((line, i) => {
                if (line.includes("let") || line.includes("for")) {
                  const parts = line.split(" ");
                  return (
                    <div key={i}>
                      <span className="text-[#c084fc]">{parts[0]}</span>{" "}
                      {parts.slice(1).join(" ")}
                    </div>
                  );
                }
                if (line.includes("console.log")) {
                  return (
                    <div key={i}>
                      <span className="text-[#38bdf8]">console.log</span>
                      (count);
                    </div>
                  );
                }
                return <div key={i}>{line.replace(/ /g, "\u00A0")}</div>;
              })}
            </div>

            <div className="flex flex-col gap-3">
              {q.options?.map((opt) => (
                <div
                  key={opt.id}
                  className={`w-full text-left rounded-xl p-4 border flex items-center justify-between ${
                    opt.selected && opt.isCorrect
                      ? "bg-[#4ade80]/10 border-[#4ade80]/50 shadow-[0_0_15px_rgba(74,222,128,0.15)]"
                      : "bg-surface-container/30 border-outline/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-bold ${opt.selected && opt.isCorrect ? "text-[#4ade80]" : "text-on-surface-variant"}`}
                    >
                      {opt.id})
                    </span>
                    <span
                      className={`font-mono text-[15px] ${opt.selected && opt.isCorrect ? "text-[#4ade80]" : "text-on-surface-variant"}`}
                    >
                      {opt.text}
                    </span>
                    {opt.selected && opt.isCorrect && (
                      <span className="bg-[#4ade80]/20 text-[#4ade80] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ml-2">
                        Correct
                      </span>
                    )}
                  </div>
                  {opt.selected && opt.isCorrect ? (
                    <LucideIcon
                      name="check_circle"
                      className=" text-[#4ade80]"
                    />
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-outline/30"></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane - Pet Explanation */}
        <div className="flex-1 flex flex-col relative mt-10 xl:mt-0 xl:pt-20">
          {/* ACCURACY BADGE */}
          <div className="absolute top-0 right-0 flex flex-col items-end hidden xl:flex">
            <span className="text-[10px] font-bold tracking-widest text-[#4ade80] uppercase">
              Accuracy
            </span>
            <span className="text-[32px] font-bold text-on-surface">100%</span>
            <span className="bg-surface-container border border-outline/20 text-[#4ade80] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mt-2">
              Mission Accomplished
            </span>
          </div>

          <div className="bg-surface-container-high border-2 border-primary-fixed-dim/30 rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,128,128,0.1)] relative overflow-hidden flex-1 flex flex-col mt-4 xl:mt-16">
            {/* Top border glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D8BFD8] to-primary-fixed-dim"></div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-surface-container border-2 border-primary-fixed-dim/40 p-1 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,128,128,0.3)]">
                <img
                  src="/src/assets/images/axolot_smile.png"
                  alt="Axolotl"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="text-[14px] font-bold text-on-surface-variant">
                Personal Explanation
              </div>
            </div>

            <div className="text-[15px] font-bold text-primary-fixed-dim italic leading-relaxed mb-6">
              "{q.explanation?.quote}"
            </div>

            <div
              className="text-[14px] text-on-surface-variant leading-loose font-medium whitespace-pre-wrap flex-1"
              dangerouslySetInnerHTML={{ __html: q.explanation?.text || "" }}
            />

            <div className="mt-8 pt-6 border-t border-outline/10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[12px] text-on-surface-variant font-medium">
                  Mastery of Loops
                </span>
                <span className="text-[14px] font-bold text-on-surface">
                  {q.explanation?.mastery}%
                </span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-fixed-dim rounded-full"
                  style={{ width: `${q.explanation?.mastery}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <button className="w-full bg-primary-fixed-dim text-[#002020] font-extrabold text-[15px] py-4 rounded-xl hover:bg-[#009999] transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,128,128,0.3)] uppercase tracking-wider">
              Next Challenge
              <LucideIcon name="arrow_forward" className="text-[20px]" />
            </button>
            <button className="w-full bg-surface-container border border-outline/20 text-on-surface font-bold text-[13px] py-4 rounded-xl hover:bg-surface-container/80 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
              <LucideIcon name="grid_view" className="text-[18px]" />
              Back to Results
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans text-on-surface">
      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0D14] relative">
        {/* Header bar */}
        {q.type !== "review" && (
          <div className="px-8 py-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-container border border-outline/20 flex items-center justify-center">
                <LucideIcon name="verified" className="text-[#4FD1C5]" />
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-widest text-[#4FD1C5] uppercase mb-1">
                  Mission Objective
                </div>
                <h2 className="text-[20px] font-bold text-on-surface">
                  {q.objective}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-[13px]">
              <span className="text-on-surface-variant font-bold uppercase tracking-widest">
                Time Left
              </span>
              <span className="text-[#4ade80] font-bold">{q.time}</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
          {q.type === "multiple_choice" && renderMultipleChoice()}
          {q.type === "drag_and_drop" && renderDragAndDrop()}
          {q.type === "review" && renderReview()}
        </div>

        {/* Footer Actions */}
        {q.type !== "review" && (
          <div className="px-8 py-6 flex items-center shrink-0">
            <button
              onClick={handleNext}
              className="bg-[#6EE7B7] text-[#064E3B] font-extrabold text-[15px] px-10 py-4 rounded-xl hover:bg-[#34D399] transition-all shadow-[0_8px_30px_rgba(110,231,183,0.3)] uppercase tracking-wider disabled:opacity-50"
            >
              Submit Answer
            </button>
            <div className="ml-auto flex items-center gap-4">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="w-10 h-10 rounded-full border border-outline/20 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all disabled:opacity-50"
              >
                <LucideIcon name="chevron_left" className="" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIdx === mockQuestions.length - 1}
                className="w-10 h-10 rounded-full border border-outline/20 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all disabled:opacity-50"
              >
                <LucideIcon name="chevron_right" className="" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
