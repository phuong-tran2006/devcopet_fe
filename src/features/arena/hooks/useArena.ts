import { useEffect } from "react";
import { useArenaStore } from "../store/arena.store";

export const useArena = () => {
  const arena = useArenaStore();

  useEffect(() => {
    arena.connectArenaSocket();
  }, [arena.connectArenaSocket]);

  return arena;
};
