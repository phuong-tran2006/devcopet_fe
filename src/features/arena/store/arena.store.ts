import { create } from "zustand";
import { socketService } from "../../../services/socket.service";

export type ArenaRank = "Beginner" | "Fresher" | "Senior" | "Expert";
export type ArenaMode = "ranked" | "casual" | "practice";
export type ArenaDifficulty = "easy" | "medium" | "hard";

export type ArenaStatus =
  | "idle"
  | "searching"
  | "found"
  | "accepting"
  | "countdown"
  | "playing"
  | "question_result"
  | "finished"
  | "error";

export interface PublicArenaPlayer {
  userId: string;
  username: string;
  avatarUrl?: string;
  isBot: boolean;
  arenaRank: ArenaRank;
  arenaRating: number;
}

export interface PublicArenaQuestion {
  id: string;
  type: "multiple_choice" | "drag_drop";
  title: string;
  question: string;
  codeSnippet?: { language: string; code: string } | null;
  template?: string;
  options?: { id: string; text: string }[];
  poolItems?: { id: string; text: string }[];
  dropZones?: { id: string; label: string }[];
  difficulty: ArenaDifficulty;
  timeLimitSeconds: number;
  chapterOrder: number;
  conceptTags: string[];
}

export interface PublicScoreboardItem {
  userId: string;
  username: string;
  isBot: boolean;
  score: number;
  streak: number;
  correctCount: number;
  wrongCount: number;
  timeoutCount: number;
  disconnected?: boolean;
}

export interface RatingChange {
  userId: string;
  oldRating: number;
  newRating: number;
  delta: number;
  oldRank: ArenaRank;
  newRank: ArenaRank;
}

export interface RankUpPayload {
  userId: string;
  oldRank: ArenaRank;
  newRank: ArenaRank;
}

export interface ArenaAnswerResult {
  roomId: string;
  questionId: string;
  isCorrect: boolean;
  earnedScore: number;
  correctAnswer?: { optionId?: string; dropZoneMap?: Record<string, string> };
  explanation?: string;
  totalScore: number;
  streak: number;
}

export interface ArenaQuestionFinished {
  roomId: string;
  questionId: string;
  correctAnswer: { optionId?: string; dropZoneMap?: Record<string, string> };
  explanation: string;
  scoreboard: PublicScoreboardItem[];
}

export interface ArenaMatchResult {
  roomId: string;
  result: "win" | "lose" | "draw";
  winnerUserId?: string;
  finalScoreboard: PublicScoreboardItem[];
  ratingChanges: RatingChange[];
  rewards?: unknown;
  rankUp?: RankUpPayload[];
}

interface FindMatchPayload {
  courseSlug: string;
  mode: ArenaMode;
}

interface ArenaState {
  status: ArenaStatus;
  roomId: string | null;
  mode: ArenaMode | null;
  courseSlug: string;
  matchTier: ArenaRank | null;
  players: PublicArenaPlayer[];
  waitingSeconds: number;
  estimatedBotFallbackSeconds: number;
  countdownValue: 3 | 2 | 1 | "GO" | null;
  currentQuestion: PublicArenaQuestion | null;
  questionIndex: number;
  totalQuestions: number;
  timeLimitSeconds: number;
  serverTime: string | null;
  selectedAnswer: {
    optionId?: string;
    dropZoneMap?: Record<string, string>;
  } | null;
  answerResult: ArenaAnswerResult | null;
  questionFinished: ArenaQuestionFinished | null;
  scoreboard: PublicScoreboardItem[];
  opponentAnsweredUserIds: string[];
  matchResult: ArenaMatchResult | null;
  errorMessage: string | null;
  hasAccepted: boolean;
  acceptTimeoutSeconds: number;
  connectArenaSocket: () => void;
  findMatch: (payload: FindMatchPayload) => void;
  cancelFindMatch: () => void;
  submitMultipleChoice: (optionId: string) => void;
  submitDragDrop: (dropZoneMap: Record<string, string>) => void;
  leaveRoom: () => void;
  acceptMatch: () => void;
  declineMatch: () => void;
  resetArena: () => void;
}

const initialArenaState = {
  status: "idle" as ArenaStatus,
  roomId: null,
  mode: null,
  courseSlug: "python-basic",
  matchTier: null,
  players: [],
  waitingSeconds: 0,
  estimatedBotFallbackSeconds: 0,
  countdownValue: null,
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 0,
  timeLimitSeconds: 0,
  serverTime: null,
  selectedAnswer: null,
  answerResult: null,
  questionFinished: null,
  scoreboard: [],
  opponentAnsweredUserIds: [],
  matchResult: null,
  errorMessage: null,
  hasAccepted: false,
  acceptTimeoutSeconds: 5,
};

let listenersRegistered = false;
let searchInterval: number | null = null;

const clearSearchInterval = () => {
  if (searchInterval) {
    clearInterval(searchInterval);
    searchInterval = null;
  }
};

export const useArenaStore = create<ArenaState>((set, get) => {
  const registerListeners = () => {
    if (listenersRegistered) return;
    listenersRegistered = true;

    socketService.on("arena:waiting", (data) => {
      if (data?.status === "cancelled") {
        clearSearchInterval();
        set({ ...initialArenaState });
        return;
      }

      set({
        status: "searching",
        waitingSeconds: data?.waitingSeconds ?? get().waitingSeconds,
        estimatedBotFallbackSeconds: data?.estimatedBotFallbackSeconds ?? 0,
        errorMessage: null,
      });
    });

    socketService.on("arena:match_found", (data) => {
      clearSearchInterval();
      console.log("Socket Event: arena:match_found", data);
      set({
        status: data.status || "accepting",
        roomId: data.roomId,
        mode: data.mode,
        courseSlug: data.courseSlug,
        matchTier: data.matchTier,
        players: data.players ?? [],
        acceptTimeoutSeconds: data.acceptTimeoutSeconds ?? 5,
        hasAccepted: false,
        scoreboard: (data.players ?? []).map((player: PublicArenaPlayer) => ({
          userId: player.userId,
          username: player.username,
          isBot: player.isBot,
          score: 0,
          streak: 0,
          correctCount: 0,
          wrongCount: 0,
          timeoutCount: 0,
        })),
        errorMessage: null,
      });
    });

    socketService.on("arena:match_started", (data) => {
      if (data?.roomId && data.roomId !== get().roomId) return;
      clearSearchInterval();
      console.log("Socket Event: arena:match_started", data);
      set({
        status: "countdown",
        roomId: data?.roomId || get().roomId,
      });
    });

    socketService.on("arena:match_cancelled", (data) => {
      if (data?.roomId && data.roomId !== get().roomId) return;
      clearSearchInterval();
      console.log("Socket Event: arena:match_cancelled", data);
      set({
        ...initialArenaState,
        status: "idle",
      });
    });

    socketService.on("arena:countdown", (data) => {
      if (data?.roomId && data.roomId !== get().roomId) return;
      console.log("Socket Event: arena:countdown", data);
      set({
        status: "countdown",
        roomId: data.roomId,
        countdownValue: data.value,
        errorMessage: null,
      });
    });

    socketService.on("arena:question", (data) => {
      if (data?.roomId && data.roomId !== get().roomId) return;
      set({
        status: "playing",
        roomId: data.roomId,
        currentQuestion: data.question,
        questionIndex: data.questionIndex,
        totalQuestions: data.totalQuestions,
        timeLimitSeconds: data.timeLimitSeconds,
        serverTime: data.serverTime,
        selectedAnswer: null,
        answerResult: null,
        questionFinished: null,
        opponentAnsweredUserIds: [],
        countdownValue: null,
        errorMessage: null,
      });
    });

    socketService.on("arena:answer_result", (data) => {
      if (data?.roomId && data.roomId !== get().roomId) return;
      set({
        status: "question_result",
        answerResult: data,
        errorMessage: null,
      });
    });

    socketService.on("arena:score_update", (data) => {
      if (data?.roomId && data.roomId !== get().roomId) return;
      set({ scoreboard: data?.scoreboard ?? [] });
    });

    socketService.on("arena:opponent_answered", (data) => {
      if (data?.roomId && data.roomId !== get().roomId) return;
      if (!data?.userId) return;
      set((state) => ({
        opponentAnsweredUserIds: state.opponentAnsweredUserIds.includes(
          data.userId,
        )
          ? state.opponentAnsweredUserIds
          : [...state.opponentAnsweredUserIds, data.userId],
      }));
    });

    socketService.on("arena:question_finished", (data) => {
      if (data?.roomId && data.roomId !== get().roomId) return;
      set({
        status: "question_result",
        questionFinished: data,
        scoreboard: data?.scoreboard ?? get().scoreboard,
      });
    });

    socketService.on("arena:match_finished", (data) => {
      if (data?.roomId && data.roomId !== get().roomId) return;
      set({
        status: "finished",
        matchResult: data,
        scoreboard: data?.finalScoreboard ?? get().scoreboard,
        countdownValue: null,
      });
    });

    socketService.on("arena:error", (data) => {
      clearSearchInterval();
      set({
        status: "error",
        errorMessage: data?.message || "Arena error",
      });
    });
  };

  return {
    ...initialArenaState,

    connectArenaSocket: () => {
      socketService.connect();
      registerListeners();
    },

    findMatch: ({ courseSlug, mode }) => {
      if (get().status === "searching") return;

      get().connectArenaSocket();
      clearSearchInterval();
      set({
        ...initialArenaState,
        status: "searching",
        courseSlug,
        mode,
      });
      searchInterval = window.setInterval(() => {
        set((state) => ({ waitingSeconds: state.waitingSeconds + 1 }));
      }, 1000);
      socketService.emit("arena:find_match", { courseSlug, mode });
    },

    cancelFindMatch: () => {
      clearSearchInterval();
      socketService.emit("arena:cancel_find_match", {});
      set({ ...initialArenaState });
    },

    submitMultipleChoice: (optionId) => {
      const { roomId, currentQuestion } = get();
      if (!roomId || !currentQuestion) return;

      set((state) => ({
        selectedAnswer: { optionId },
        opponentAnsweredUserIds: state.opponentAnsweredUserIds,
      }));
      socketService.emit("arena:submit_answer", {
        roomId,
        questionId: currentQuestion.id,
        answer: { optionId },
      });
    },

    submitDragDrop: (dropZoneMap) => {
      const { roomId, currentQuestion } = get();
      if (!roomId || !currentQuestion) return;

      set((state) => ({
        selectedAnswer: { dropZoneMap },
        opponentAnsweredUserIds: state.opponentAnsweredUserIds,
      }));
      socketService.emit("arena:submit_answer", {
        roomId,
        questionId: currentQuestion.id,
        answer: { dropZoneMap },
      });
    },

    leaveRoom: () => {
      clearSearchInterval();
      const { roomId } = get();
      if (roomId) {
        socketService.emit("arena:leave_room", { roomId });
      }
      set({ ...initialArenaState });
    },

    acceptMatch: () => {
      const { roomId } = get();
      if (!roomId) return;
      set({ hasAccepted: true });
      socketService.emit("arena:accept_match", { roomId });
    },

    declineMatch: () => {
      clearSearchInterval();
      const { roomId } = get();
      if (roomId) {
        socketService.emit("arena:decline_match", { roomId });
      }
      set({ ...initialArenaState });
    },

    resetArena: () => {
      clearSearchInterval();
      set({ ...initialArenaState });
    },
  };
});
