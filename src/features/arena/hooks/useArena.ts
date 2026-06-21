import { useEffect } from "react";
import { useArenaStore } from "../store/arena.store";

export const useArena = () => {
  const arena = useArenaStore();
  const connectArenaSocket = useArenaStore((state) => state.connectArenaSocket);

  useEffect(() => {
    connectArenaSocket();
  }, [connectArenaSocket]);

  return arena;
};
