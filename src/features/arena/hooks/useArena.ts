import { useEffect, useState } from "react";
import { socketService } from "../../../services/socket.service";

export type ArenaStatus =
  | "idle"
  | "searching"
  | "found"
  | "playing"
  | "finished";

export interface ArenaPlayer {
  id: string;
  username: string;
  avatarUrl?: string;
  score: number;
}

export interface ArenaQuestion {
  id: string;
  question: string;
  type:
    | "multiple_choice"
    | "fill_blank"
    | "arrange_order"
    | "drag_drop_matching"
    | "find_bug"
    | "code_trace"
    | "operation_table";
  options?: any;
  blanks?: any;
  estimatedMinutes?: number;
  xp?: number;
}

export const useArena = () => {
  const [status, setStatus] = useState<ArenaStatus>("idle");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ArenaQuestion | null>(
    null,
  );
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [players, setPlayers] = useState<ArenaPlayer[]>([]);
  const [answerResult, setAnswerResult] = useState<any>(null);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    // Connect to WS server
    socketService.connect();

    // Listen to matchmaking events
    socketService.on("arena:waiting", () => {
      setStatus("searching");
    });

    socketService.on(
      "arena:match_found",
      (data: { roomId: string; players: ArenaPlayer[] }) => {
        setStatus("found");
        setRoomId(data.roomId);
        setPlayers(data.players);
      },
    );

    // Listen to battle lifecycle events
    socketService.on("arena:countdown", (count: number) => {
      setCountdown(count);
      if (count === 0) {
        setStatus("playing");
        setCountdown(null);
      }
    });

    socketService.on(
      "arena:question",
      (data: { question: ArenaQuestion; index: number }) => {
        setCurrentQuestion(data.question);
        setQuestionIndex(data.index);
        setAnswerResult(null); // Reset answer result for next question
      },
    );

    socketService.on("arena:answer_result", (data: any) => {
      setAnswerResult(data);
    });

    socketService.on(
      "arena:score_update",
      (updatedScores: Record<string, number>) => {
        setScores(updatedScores);
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => ({
            ...player,
            score:
              updatedScores[player.id] !== undefined
                ? updatedScores[player.id]
                : player.score,
          })),
        );
      },
    );

    socketService.on("arena:match_finished", (data: { winnerId: string }) => {
      setStatus("finished");
      setWinner(data.winnerId);
    });

    // Cleanup listeners on unmount
    return () => {
      socketService.off("arena:waiting");
      socketService.off("arena:match_found");
      socketService.off("arena:countdown");
      socketService.off("arena:question");
      socketService.off("arena:answer_result");
      socketService.off("arena:score_update");
      socketService.off("arena:match_finished");
    };
  }, []);

  const findMatch = () => {
    setStatus("searching");
    socketService.emit("arena:find_match");
  };

  const cancelSearch = () => {
    setStatus("idle");
    socketService.emit("arena:cancel_match");
  };

  const submitAnswer = (answerPayload: any) => {
    if (!roomId || !currentQuestion) return;
    socketService.emit("arena:submit_answer", {
      roomId,
      questionId: currentQuestion.id,
      answer: answerPayload,
    });
  };

  return {
    status,
    roomId,
    countdown,
    currentQuestion,
    questionIndex,
    players,
    scores,
    answerResult,
    winner,
    findMatch,
    cancelSearch,
    submitAnswer,
  };
};
