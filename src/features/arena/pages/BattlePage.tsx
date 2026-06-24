import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import MiniPlayerCard from "../components/battle/MiniPlayerCard";
import TimerRing from "../components/battle/TimerRing";
import QuestionBoard from "../components/battle/QuestionBoard";
import OptionButton from "../components/battle/OptionButton";
import VictoryView from "../components/battle/VictoryView";
import { useAuthStore } from "../../users/store/auth.store";
import { useArenaStore } from "../store/arena.store";

const optionColors = ["#0d9488", "#4f46e5", "#059669", "#4b5563"];
const optionBgClasses = [
  "bg-teal-600 dark:bg-teal-500",
  "bg-indigo-600 dark:bg-indigo-500",
  "bg-emerald-600 dark:bg-emerald-500",
  "bg-slate-600 dark:bg-slate-500",
];

const getRemainingSeconds = (
  serverTime: string | null,
  timeLimitSeconds: number,
) => {
  if (!serverTime || !timeLimitSeconds) return timeLimitSeconds || 0;
  const start = new Date(serverTime).getTime();
  if (Number.isNaN(start)) return timeLimitSeconds;
  const end = start + timeLimitSeconds * 1000;
  return Math.max(0, Math.ceil((end - Date.now()) / 1000));
};

const BattlePage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const {
    status,
    players,
    scoreboard,
    opponentAnsweredUserIds,
    countdownValue,
    currentQuestion,
    questionIndex,
    totalQuestions,
    timeLimitSeconds,
    serverTime,
    selectedAnswer,
    answerResult,
    questionFinished,
    errorMessage,
    connectArenaSocket,
    leaveRoom,
    submitMultipleChoice,
    submitDragDrop,
  } = useArenaStore();
  const [timeLeft, setTimeLeft] = useState(() =>
    getRemainingSeconds(serverTime, timeLimitSeconds),
  );
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const statusRef = useRef(status);
  const leaveRoomRef = useRef(leaveRoom);

  useEffect(() => {
    statusRef.current = status;
    leaveRoomRef.current = leaveRoom;
  }, [leaveRoom, status]);

  useEffect(() => {
    const shouldForfeitOnExit = () =>
      ["found", "countdown", "playing", "question_result"].includes(
        statusRef.current,
      );

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!shouldForfeitOnExit()) return;
      leaveRoomRef.current();
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Chỉ gửi sự kiện rời phòng khi thực sự chuyển hướng sang trang khác (tránh StrictMode giả lập unmount)
      const isLeavingPage = window.location.pathname !== "/arena/active";
      if (shouldForfeitOnExit() && isLeavingPage) {
        leaveRoomRef.current();
      }
    };
  }, []);

  useEffect(() => {
    connectArenaSocket();
  }, [connectArenaSocket]);

  useEffect(() => {
    setTimeLeft(getRemainingSeconds(serverTime, timeLimitSeconds));
    const intervalId = window.setInterval(() => {
      setTimeLeft(getRemainingSeconds(serverTime, timeLimitSeconds));
    }, 500);

    return () => window.clearInterval(intervalId);
  }, [serverTime, timeLimitSeconds]);

  const currentUserId = useMemo(() => {
    const rawId = currentUser?.id || currentUser?._id;
    return rawId ? String(rawId) : undefined;
  }, [currentUser]);

  const me = useMemo(() => {
    return (
      players.find(
        (player) => currentUserId && player.userId === currentUserId,
      ) ||
      players.find((player) => !player.isBot) ||
      players[0]
    );
  }, [currentUserId, players]);

  const opponent = useMemo(() => {
    return (
      players.find((player) => me && player.userId !== me.userId) ||
      players.find((player) => player.isBot) ||
      players[1]
    );
  }, [me, players]);

  const handleForfeit = () => {
    setShowExitConfirm(true);
  };

  const getScore = (userId?: string) =>
    scoreboard.find((item) => item.userId === userId);
  const myScore = getScore(me?.userId);
  const opponentScore = getScore(opponent?.userId);
  const myAnswered = Boolean(selectedAnswer);
  const opponentAnswered = Boolean(
    opponent?.userId && opponentAnsweredUserIds.includes(opponent.userId),
  );
  const correctOptionId =
    questionFinished?.correctAnswer?.optionId ||
    answerResult?.correctAnswer?.optionId;

  if (status === "finished") {
    return <VictoryView />;
  }

  return (
    <div className="w-full min-h-full flex flex-col p-4 dark:bg-[#0a1014] bg-surface-container-lowest overflow-y-auto transition-colors duration-300 relative">
      {(status === "countdown" || countdownValue) && (
        <div className="absolute inset-0 z-40 flex items-center justify-center dark:bg-black/60 bg-black/30 backdrop-blur-sm">
          <div className="text-[76px] font-black dark:text-[#4dd0d0] text-primary drop-shadow-[0_0_24px_rgba(77,208,208,0.6)]">
            {countdownValue}
          </div>
        </div>
      )}

      {/* Exit/Forfeit Button - absolute positioned top right */}
      <button
        onClick={handleForfeit}
        className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl dark:bg-[#16202a] bg-surface-container-high dark:text-gray-300 text-on-surface hover:bg-error hover:text-white transition-all shadow-md text-[13px] font-black"
      >
        <span className="material-symbols-outlined text-[16px]">logout</span>
        <span>Exit</span>
      </button>

      <div className="flex justify-between items-start w-full max-w-5xl mx-auto relative gap-4">
        <MiniPlayerCard
          name={opponent?.username || "Opponent"}
          avatarUrl={
            opponent?.avatarUrl || "https://i.pravatar.cc/150?u=arena-opponent"
          }
          hpPercentage={Math.min(
            100,
            ((opponentScore?.score || 0) / Math.max(1, totalQuestions * 100)) *
              100,
          )}
          hpColor="#ff8a8a"
          icon="local_fire_department"
          iconColor="#ff8a8a"
          rank={opponent?.arenaRank}
          score={opponentScore?.score || 0}
          answered={opponentAnswered}
        />

        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 z-20 flex flex-col items-center gap-1">
          <TimerRing timeLeft={timeLeft} />
          <span className="text-[10px] uppercase tracking-wider font-black dark:text-gray-500 text-on-surface-variant">
            Timer
          </span>
        </div>

        <MiniPlayerCard
          name={me?.username || currentUser?.username || "You"}
          avatarUrl={
            me?.avatarUrl ||
            (currentUser?.avatarUrl as string) ||
            "/axolotl.png"
          }
          hpPercentage={Math.min(
            100,
            ((myScore?.score || 0) / Math.max(1, totalQuestions * 100)) * 100,
          )}
          hpColor="#4dd0d0"
          icon="star"
          iconColor="#4dd0d0"
          isRightAlign={true}
          rank={me?.arenaRank}
          score={myScore?.score || 0}
          answered={myAnswered}
        />
      </div>

      <div className="w-full max-w-5xl mx-auto mt-4 grid grid-cols-2 gap-3">
        <AnswerStateCard
          label="Opponent"
          score={opponentScore?.score || 0}
          correct={opponentScore?.correctCount || 0}
          streak={opponentScore?.streak || 0}
          answered={opponentAnswered}
        />
        <AnswerStateCard
          label="You"
          score={myScore?.score || 0}
          correct={myScore?.correctCount || 0}
          streak={myScore?.streak || 0}
          answered={myAnswered}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start w-full max-w-3xl mx-auto mt-2 gap-4 pb-4">
        {errorMessage && (
          <div className="w-full rounded-xl border border-error/20 bg-error/10 text-error px-4 py-3 font-semibold">
            {errorMessage}
          </div>
        )}

        {!currentQuestion ? (
          <div className="w-full dark:bg-[#101820] bg-surface-container border dark:border-white/5 border-outline/10 rounded-2xl p-8 text-center shadow-xl mt-6">
            <h2 className="text-[24px] font-extrabold dark:text-[#e2e8f0] text-on-surface mb-2">
              Waiting for question
            </h2>
            <p className="dark:text-gray-400 text-on-surface-variant text-[14px]">
              Accept a matched room, then Arena will stream questions here.
            </p>
          </div>
        ) : (
          <>
            <QuestionBoard
              title={currentQuestion.title}
              question={currentQuestion.question}
              difficulty={currentQuestion.difficulty}
              conceptTags={currentQuestion.conceptTags}
              codeSnippet={currentQuestion.codeSnippet}
              questionIndex={questionIndex}
              totalQuestions={totalQuestions}
            />

            {currentQuestion.type === "multiple_choice" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                {(currentQuestion.options || []).map((option, index) => {
                  const letter = option.id || String.fromCharCode(65 + index);
                  const isSelected = selectedAnswer?.optionId === option.id;
                  const state =
                    correctOptionId === option.id
                      ? "correct"
                      : isSelected && answerResult && !answerResult.isCorrect
                        ? "wrong"
                        : "neutral";

                  return (
                    <OptionButton
                      key={option.id}
                      letter={letter}
                      text={option.text}
                      colorHex={optionColors[index % optionColors.length]}
                      bgColorClass={
                        optionBgClasses[index % optionBgClasses.length]
                      }
                      textClass="dark:text-[#e2e8f0] text-on-surface"
                      onClick={() => submitMultipleChoice(option.id)}
                      disabled={myAnswered || status === "question_result"}
                      isSelected={isSelected}
                      state={state}
                    />
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "drag_drop" && (
              <DragDropAnswer
                poolItems={currentQuestion.poolItems || []}
                dropZones={currentQuestion.dropZones || []}
                submittedMap={selectedAnswer?.dropZoneMap || null}
                correctMap={
                  questionFinished?.correctAnswer?.dropZoneMap ||
                  answerResult?.correctAnswer?.dropZoneMap
                }
                disabled={myAnswered || status === "question_result"}
                onSubmit={submitDragDrop}
              />
            )}
          </>
        )}
      </div>

      {(answerResult || questionFinished) && (
        <RoundResultNotice
          answerResult={answerResult}
          explanation={
            questionFinished?.explanation || answerResult?.explanation
          }
        />
      )}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-[360px] rounded-2xl border border-on-surface/10 dark:border-white/5 bg-surface-container dark:bg-[#121c27] p-5 flex flex-col items-center gap-4 text-center shadow-2xl transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-red-500 text-[24px]">
                warning
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-black text-on-surface dark:text-white">
                Exit Match?
              </h3>
              <p className="text-[13px] text-on-surface-variant dark:text-gray-400 font-semibold leading-relaxed">
                Are you sure you want to exit? You may lose points for
                forfeiting.
              </p>
            </div>
            <div className="flex gap-2.5 w-full mt-1">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 bg-on-surface/5 dark:bg-white/5 border border-on-surface/10 dark:border-white/10 text-on-surface dark:text-white py-2 rounded-xl text-[13px] font-black hover:bg-on-surface/10 dark:hover:bg-white/10 transition-all cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  leaveRoom();
                  navigate({ to: "/arena" });
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-[13px] font-black transition-all cursor-pointer shadow-md hover:scale-[1.01]"
              >
                EXIT MATCH
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface AnswerStateCardProps {
  label: string;
  score: number;
  correct: number;
  streak: number;
  answered: boolean;
}

const AnswerStateCard = ({
  label,
  score,
  correct,
  streak,
  answered,
}: AnswerStateCardProps) => {
  return (
    <div className="dark:bg-[#111a22] bg-surface rounded-xl border dark:border-white/5 border-outline/10 px-4 py-3 flex items-center justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-wider dark:text-gray-500 text-on-surface-variant font-black">
          {label}
        </p>
        <p className="font-black text-[20px] dark:text-white text-on-surface">
          {score}
        </p>
      </div>
      <div className="text-right text-[11px] dark:text-gray-400 text-on-surface-variant font-bold">
        <div>{answered ? "Answered" : "Thinking"}</div>
        <div>
          Correct {correct} - Streak {streak}
        </div>
      </div>
    </div>
  );
};

interface RoundResultNoticeProps {
  answerResult: ReturnType<typeof useArenaStore.getState>["answerResult"];
  explanation?: string;
}

const RoundResultNotice = ({
  answerResult,
  explanation,
}: RoundResultNoticeProps) => {
  const { scoreboard, players } = useArenaStore();
  const { user: currentUser } = useAuthStore();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [answerResult?.questionId]);

  const currentUserId = useMemo(() => {
    const rawId = currentUser?.id || currentUser?._id;
    return rawId ? String(rawId) : undefined;
  }, [currentUser]);

  const me = useMemo(() => {
    return (
      players.find(
        (player) => currentUserId && player.userId === currentUserId,
      ) ||
      players.find((player) => !player.isBot) ||
      players[0]
    );
  }, [currentUserId, players]);

  const myScore = useMemo(() => {
    return scoreboard.find((item) => item.userId === me?.userId);
  }, [scoreboard, me]);

  const isCorrect = answerResult?.isCorrect;

  let headerText = "INCORRECT!";
  let pointsText = "+0 PTS";
  let headerBgClass = "bg-[#9f3f4a]";
  let headerIcon = "cancel";

  if (answerResult) {
    if (isCorrect) {
      headerText = "CORRECT!";
      pointsText = `+${answerResult.earnedScore} PTS`;
      headerBgClass = "bg-[#206f6c]";
      headerIcon = "check_circle";
    } else {
      headerText = "INCORRECT!";
      pointsText = "+0 PTS";
      headerBgClass = "bg-[#9f3f4a]";
      headerIcon = "cancel";
    }
  } else {
    headerText = "TIME'S UP!";
    pointsText = "+0 PTS";
    headerBgClass = "bg-[#9f3f4a]";
    headerIcon = "timer_off";
  }

  const totalScore = answerResult?.totalScore ?? myScore?.score ?? 0;
  const streak = answerResult?.streak ?? myScore?.streak ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-[400px] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.15)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-on-surface/10 dark:border-white/5 bg-surface-container">
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between ${headerBgClass}`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white text-[24px]">
              {headerIcon}
            </span>
            <span className="text-white text-base font-extrabold tracking-wider">
              {headerText} {pointsText}
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-high dark:bg-[#121c27] border border-on-surface/5 dark:border-white/5 rounded-xl py-3 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-on-surface-variant dark:text-gray-400 tracking-[0.2em] mb-1">
                TOTAL
              </span>
              <span className="text-2xl font-black text-on-surface dark:text-white">
                {totalScore}
              </span>
            </div>
            <div className="bg-surface-container-high dark:bg-[#121c27] border border-on-surface/5 dark:border-white/5 rounded-xl py-3 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-on-surface-variant dark:text-gray-400 tracking-[0.2em] mb-1">
                STREAK
              </span>
              <span className="text-2xl font-black text-on-surface dark:text-white">
                {streak}
              </span>
            </div>
          </div>

          {/* Explanation */}
          {explanation && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-on-surface-variant dark:text-gray-400 tracking-[0.2em]">
                EXPLANATION
              </span>
              <div className="bg-surface-container-high dark:bg-[#121c27] border border-on-surface/5 dark:border-white/5 rounded-xl p-4 text-sm text-on-surface-variant dark:text-gray-300 leading-relaxed font-semibold">
                {explanation}
              </div>
            </div>
          )}

          {/* Countdown */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-on-surface-variant dark:text-gray-400 font-semibold">
              Next question in{" "}
              <strong className="text-on-surface dark:text-white font-bold">
                {countdown}s
              </strong>
            </span>
            <div className="w-24 h-1.5 rounded-full bg-on-surface/10 dark:bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${isCorrect ? "bg-[#206f6c]" : "bg-[#9f3f4a]"}`}
                style={{ width: `${(countdown / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DragDropAnswerProps {
  poolItems: { id: string; text: string }[];
  dropZones: { id: string; label: string }[];
  submittedMap: Record<string, string> | null;
  correctMap?: Record<string, string>;
  disabled: boolean;
  onSubmit: (dropZoneMap: Record<string, string>) => void;
}

const DragDropAnswer = ({
  poolItems,
  dropZones,
  submittedMap,
  correctMap,
  disabled,
  onSubmit,
}: DragDropAnswerProps) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [dropZoneMap, setDropZoneMap] = useState<Record<string, string>>({});
  const [dragOverZoneId, setDragOverZoneId] = useState<string | null>(null);
  const [dragOverItems, setDragOverItems] = useState(false);

  useEffect(() => {
    setSelectedItemId(null);
    setDropZoneMap({});
    setDragOverZoneId(null);
    setDragOverItems(false);
  }, [poolItems, dropZones]);

  const activeMap = submittedMap || dropZoneMap;
  const assignedItemIds = new Set(Object.values(activeMap));
  const canSubmit =
    dropZones.length > 0 && dropZones.every((zone) => activeMap[zone.id]);

  const handleDrop = (zoneId: string, itemId: string) => {
    if (disabled || correctMap || !itemId) return;
    setDropZoneMap((current) => {
      const next = { ...current };
      // Remove this item from any other zone it was assigned to
      for (const [zId, itId] of Object.entries(next)) {
        if (itId === itemId) {
          delete next[zId];
        }
      }
      next[zoneId] = itemId;
      return next;
    });
    setSelectedItemId(null);
  };

  const handleZoneClick = (zoneId: string) => {
    if (disabled || correctMap) return;
    if (selectedItemId) {
      handleDrop(zoneId, selectedItemId);
    } else if (dropZoneMap[zoneId]) {
      setDropZoneMap((current) => {
        const copy = { ...current };
        delete copy[zoneId];
        return copy;
      });
    }
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_1.15fr] gap-4">
      {/* Items Section */}
      <div
        onDragOver={(e) => {
          if (disabled || correctMap) return;
          e.preventDefault();
        }}
        onDragEnter={() => {
          if (disabled || correctMap) return;
          setDragOverItems(true);
        }}
        onDragLeave={() => {
          setDragOverItems(false);
        }}
        onDrop={(e) => {
          if (disabled || correctMap) return;
          const itemId = e.dataTransfer.getData("text/plain");
          if (itemId) {
            setDropZoneMap((current) => {
              const next = { ...current };
              for (const [zId, itId] of Object.entries(next)) {
                if (itId === itemId) {
                  delete next[zId];
                }
              }
              return next;
            });
          }
          setSelectedItemId(null);
          setDragOverItems(false);
        }}
        className={`rounded-xl border p-4 transition-all duration-300 ${
          dragOverItems
            ? "bg-red-50/60 dark:bg-red-950/10 border-dashed border-red-500 scale-[0.99]"
            : "bg-slate-100/90 dark:bg-[#121c27] dark:border-white/5 border-slate-200"
        }`}
      >
        <p className="text-[11px] uppercase tracking-wider dark:text-gray-500 text-on-surface-variant font-black mb-3">
          Items
        </p>
        <div className="flex flex-col gap-2.5">
          {poolItems.map((item) => {
            const isAssigned = assignedItemIds.has(item.id);
            const isSelected = selectedItemId === item.id;

            let itemClass = "";
            if (isAssigned) {
              itemClass =
                "border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-200/50 dark:bg-black/20 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50";
            } else if (isSelected) {
              itemClass =
                "border-2 border-teal-600 dark:border-[#4dd0d0] bg-teal-50 dark:bg-[#4dd0d0]/10 text-teal-800 dark:text-[#4dd0d0] cursor-grab shadow-md scale-[0.98] ring-2 ring-teal-500/20 dark:ring-[#4dd0d0]/20";
            } else {
              itemClass =
                "border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#16202a] text-slate-800 dark:text-[#e2e8f0] hover:border-slate-500 dark:hover:border-white/20 cursor-grab hover:shadow-sm";
            }

            return (
              <button
                key={item.id}
                type="button"
                disabled={disabled || isAssigned}
                draggable={!disabled && !isAssigned}
                onDragStart={(e) => {
                  if (disabled) return;
                  e.dataTransfer.setData("text/plain", item.id);
                  setSelectedItemId(item.id);
                }}
                onDragEnd={() => {
                  setSelectedItemId(null);
                }}
                onClick={() => setSelectedItemId(item.id)}
                className={`rounded-xl px-3 py-2.5 text-left text-[14px] font-semibold transition-all ${itemClass}`}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drop Zones Section */}
      <div className="bg-slate-100/90 dark:bg-[#121c27] rounded-xl border dark:border-white/5 border-slate-200 p-4 transition-colors duration-300">
        <p className="text-[11px] uppercase tracking-wider dark:text-gray-500 text-on-surface-variant font-black mb-3">
          Drop zones
        </p>
        <div className="flex flex-col gap-2.5">
          {dropZones.map((zone) => {
            const assigned = poolItems.find(
              (item) => item.id === activeMap[zone.id],
            );
            const isCorrect = correctMap
              ? correctMap[zone.id] === activeMap[zone.id]
              : false;

            const isTargetHighlight = Boolean(
              selectedItemId && !assigned && !disabled && !correctMap,
            );

            const isDragOver = dragOverZoneId === zone.id;

            let borderBgClass = "";
            let textClass = "";
            let labelClass = "";

            if (correctMap) {
              borderBgClass = isCorrect
                ? "border-2 border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                : "border-2 border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-950/20";
              textClass = isCorrect
                ? "text-emerald-900 dark:text-emerald-300"
                : "text-red-900 dark:text-red-300";
              labelClass = isCorrect
                ? "text-emerald-700/80 dark:text-emerald-500/80"
                : "text-red-700/80 dark:text-red-500/80";
            } else if (isDragOver) {
              borderBgClass =
                "border-2 border-solid border-teal-600 dark:border-[#4dd0d0] bg-teal-50 dark:bg-[#4dd0d0]/20 scale-[1.02] shadow-md ring-2 ring-teal-500/20 dark:ring-[#4dd0d0]/20";
              textClass = "text-teal-900 dark:text-teal-200 font-extrabold";
              labelClass = "text-teal-700 dark:text-[#4dd0d0]";
            } else if (assigned) {
              borderBgClass =
                "border-2 border-solid border-teal-500 dark:border-[#4dd0d0]/80 bg-teal-50 dark:bg-[#4dd0d0]/10 hover:border-teal-600 dark:hover:border-[#4dd0d0] hover:bg-teal-100/50 hover:shadow-sm";
              textClass = "text-teal-900 dark:text-teal-200 font-extrabold";
              labelClass = "text-teal-700 dark:text-gray-400";
            } else if (isTargetHighlight) {
              borderBgClass =
                "border-2 border-dashed border-teal-500 dark:border-[#4dd0d0] bg-teal-50/20 dark:bg-[#4dd0d0]/5 animate-pulse";
              textClass = "text-teal-600/60 dark:text-[#4dd0d0]/50 italic";
              labelClass = "text-teal-700/80 dark:text-[#4dd0d0]/80";
            } else {
              borderBgClass =
                "border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#16202a]/50 hover:border-slate-400 hover:bg-slate-50 dark:hover:border-slate-600 dark:hover:bg-[#16202a]/80";
              textClass =
                "text-slate-400 dark:text-slate-500 italic font-normal";
              labelClass = "text-slate-400 dark:text-slate-500";
            }

            return (
              <button
                key={zone.id}
                type="button"
                disabled={disabled && !correctMap}
                draggable={!disabled && !correctMap && !!assigned}
                onDragStart={(e) => {
                  if (disabled || correctMap || !assigned) return;
                  e.dataTransfer.setData("text/plain", assigned.id);
                  setSelectedItemId(assigned.id);
                }}
                onDragEnd={() => {
                  setSelectedItemId(null);
                  setDragOverZoneId(null);
                }}
                onDragOver={(e) => {
                  if (disabled || correctMap) return;
                  e.preventDefault();
                }}
                onDragEnter={() => {
                  if (disabled || correctMap) return;
                  setDragOverZoneId(zone.id);
                }}
                onDragLeave={() => {
                  setDragOverZoneId(null);
                }}
                onDrop={(e) => {
                  if (disabled || correctMap) return;
                  const itemId = e.dataTransfer.getData("text/plain");
                  if (itemId) {
                    handleDrop(zone.id, itemId);
                  }
                  setDragOverZoneId(null);
                }}
                onClick={() => handleZoneClick(zone.id)}
                className={`min-h-[58px] rounded-xl px-3 py-2 text-left transition-all duration-200 cursor-pointer ${borderBgClass}`}
              >
                <div
                  className={`text-[10px] uppercase tracking-wider font-black mb-1 transition-colors ${labelClass}`}
                >
                  {zone.label}
                </div>
                <div
                  className={`font-semibold text-[14px] transition-colors ${textClass}`}
                >
                  {assigned?.text || "Drag item here or select/click"}
                </div>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          disabled={disabled || !canSubmit}
          onClick={() => onSubmit(activeMap)}
          className="mt-4 w-full rounded-xl dark:bg-[#29b6f6] bg-primary dark:text-[#081015] text-on-primary font-black py-2.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:scale-[1.01] active:scale-100 transition-all"
        >
          SUBMIT ANSWER
        </button>
      </div>
    </div>
  );
};

export default BattlePage;
