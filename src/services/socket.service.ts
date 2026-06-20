import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private socketUrl = import.meta.env.VITE_WS_URL || "http://localhost:5173";

  connect() {
    if (this.socket?.connected) return;

    const token = localStorage.getItem("accessToken");

    this.socket = io(this.socketUrl, {
      auth: {
        token: token ? `Bearer ${token}` : "",
      },
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
    });

    this.socket.on("connect", () => {
      console.log("⚡ Connected to WebSocket server with ID:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("🔌 Disconnected from WebSocket:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ WebSocket connection error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data?: any) {
    if (!this.socket) {
      this.connect();
    }
    this.socket?.emit(event, data);
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) {
      this.connect();
    }
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (!this.socket) return;
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }
}

export const socketService = new SocketService();
