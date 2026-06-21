import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const ARENA_SOCKET_URL = import.meta.env.VITE_WS_URL || `${API_URL}/arena`;

class SocketService {
  private socket: Socket | null = null;

  connect() {
    const token = localStorage.getItem("accessToken") || "";

    if (this.socket?.connected) return this.socket;

    if (this.socket) {
      this.socket.auth = { token };
      this.socket.connect();
      return this.socket;
    }

    this.socket = io(ARENA_SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected to Arena socket:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Arena socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Arena socket connection error:", error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.removeAllListeners();
    this.socket.disconnect();
    this.socket = null;
  }

  emit(event: string, data?: unknown) {
    this.connect()?.emit(event, data);
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.connect()?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (!this.socket) return;

    if (callback) {
      this.socket.off(event, callback);
      return;
    }

    this.socket.off(event);
  }
}

export const socketService = new SocketService();
