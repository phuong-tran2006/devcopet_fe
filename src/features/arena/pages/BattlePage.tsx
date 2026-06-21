import { useEffect, useMemo, useRef, useState } from "react";
import MiniPlayerCard from "../components/battle/MiniPlayerCard";
import TimerRing from "../components/battle/TimerRing";
import QuestionBoard from "../components/battle/QuestionBoard";
import OptionButton from "../components/battle/OptionButton";
import VictoryView from "../components/battle/VictoryView";
import { useAuthStore } from "../../users/store/auth.store";
import { useArenaStore } from "../store/arena.store";

const optionColors = ["#00bfa5", "#9f7aea", "#84cc16", "#475569"];
const optionBgClasses = [
  "bg-[#00bfa5]",
  "bg-[#7a5c88]",
  "bg-[#5a7638]",
  "bg-[#334155]",
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
      if (shouldForfeitOnExit()) {
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
  const isCorrect = answerResult?.isCorrect;

  return (
    <div className="absolute inset-x-0 bottom-5 z-30 flex justify-center px-4 pointer-events-none">
      <div
        className={`w-full max-w-xl rounded-2xl border p-5 shadow-2xl backdrop-blur-md pointer-events-auto ${isCorrect ? "dark:bg-[#102b2d]/95 bg-tertiary-container border-[#4fd1c5]/50" : "dark:bg-[#32161b]/95 bg-error/10 border-error/40"}`}
      >
        <div className="flex items-center justify-between gap-4 mb-2">
          <div
            className={`text-[22px] font-black ${isCorrect ? "dark:text-[#4dd0d0] text-primary" : "text-error"}`}
          >
            {isCorrect ? "Correct answer" : "Wrong answer"}
          </div>
          {answerResult && (
            <div className="text-right text-[12px] font-black dark:text-gray-300 text-on-surface-variant">
              +{answerResult.earnedScore} score
              <br />
              Total {answerResult.totalScore} - Streak {answerResult.streak}
            </div>
          )}
        </div>
        <p className="dark:text-gray-200 text-on-surface-variant text-[14px] leading-relaxed">
          {explanation ||
            "Waiting for the round explanation before the next question..."}
        </p>
        <div className="mt-4 h-1.5 rounded-full dark:bg-white/10 bg-outline/20 overflow-hidden">
          <div className="h-full w-2/3 rounded-full dark:bg-[#4dd0d0] bg-primary animate-pulse" />
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

  useEffect(() => {
    setSelectedItemId(null);
    setDropZoneMap({});
  }, [poolItems, dropZones]);

  const activeMap = submittedMap || dropZoneMap;
  const assignedItemIds = new Set(Object.values(activeMap));
  const canSubmit =
    dropZones.length > 0 && dropZones.every((zone) => activeMap[zone.id]);

  const handleZoneClick = (zoneId: string) => {
    if (disabled || !selectedItemId) return;
    setDropZoneMap((current) => ({ ...current, [zoneId]: selectedItemId }));
    setSelectedItemId(null);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_1.15fr] gap-3">
      <div className="dark:bg-[#111a22] bg-surface rounded-xl border dark:border-white/5 border-outline/10 p-4">
        <p className="text-[11px] uppercase tracking-wider dark:text-gray-500 text-on-surface-variant font-black mb-3">
          Items
        </p>
        <div className="flex flex-col gap-2">
          {poolItems.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={disabled || assignedItemIds.has(item.id)}
              onClick={() => setSelectedItemId(item.id)}
              className={`rounded-xl border px-3 py-2.5 text-left text-[14px] font-semibold transition-colors disabled:opacity-50 ${selectedItemId === item.id ? "border-primary bg-primary/10 dark:text-[#4dd0d0] text-primary" : "dark:border-white/10 border-outline/20 dark:bg-[#16202a] bg-surface-container-high dark:text-[#e2e8f0] text-on-surface"}`}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>

      <div className="dark:bg-[#111a22] bg-surface rounded-xl border dark:border-white/5 border-outline/10 p-4">
        <p className="text-[11px] uppercase tracking-wider dark:text-gray-500 text-on-surface-variant font-black mb-3">
          Drop zones
        </p>
        <div className="flex flex-col gap-2">
          {dropZones.map((zone) => {
            const assigned = poolItems.find(
              (item) => item.id === activeMap[zone.id],
            );
            const isCorrect = correctMap
              ? correctMap[zone.id] === activeMap[zone.id]
              : false;

            return (
              <button
                key={zone.id}
                type="button"
                disabled={disabled && !correctMap}
                onClick={() => handleZoneClick(zone.id)}
                className={`min-h-[58px] rounded-xl border px-3 py-2 text-left transition-colors ${correctMap ? (isCorrect ? "border-[#4fd1c5] bg-tertiary-container/40" : "border-error bg-error/10") : "dark:border-white/10 border-outline/20 dark:bg-[#16202a] bg-surface-container-high"}`}
              >
                <div className="text-[10px] uppercase tracking-wider dark:text-gray-500 text-on-surface-variant font-black mb-1">
                  {zone.label}
                </div>
                <div className="font-semibold text-[14px] dark:text-[#e2e8f0] text-on-surface">
                  {assigned?.text || "Select item, click here"}
                </div>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          disabled={disabled || !canSubmit}
          onClick={() => onSubmit(activeMap)}
          className="mt-4 w-full rounded-xl dark:bg-[#29b6f6] bg-primary dark:text-[#081015] text-on-primary font-black py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          SUBMIT ANSWER
        </button>
      </div>
    </div>
  );
};

export default BattlePage;
