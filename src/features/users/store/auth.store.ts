import { create } from "zustand";

interface User {
  id?: string;
  email?: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  level?: number;
  exp?: number;
  onboardingCompleted?: boolean;
  petProfileInitialized?: boolean;
  [key: string]: unknown;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setAuth: (accessToken: string, refreshToken: string, user?: User) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  setAuth: (accessToken, refreshToken, user) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ isAuthenticated: true, user: user || null });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    set({ isAuthenticated: false, user: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Restore user data from localStorage first for instant UI response
      let user: User | null = null;
      try {
        const stored = localStorage.getItem("user");
        if (stored) user = JSON.parse(stored);
      } catch {
        // ignore parse errors
      }
      set({ isAuthenticated: true, user });

      // Fetch fresh user details to validate the token and prevent stale/deleted user session issues
      try {
        const { api } = await import("../../../services/axiosClient");
        const response = await api.get("/users/me");
        const freshUser = response.data;
        localStorage.setItem("user", JSON.stringify(freshUser));
        set({ isAuthenticated: true, user: freshUser });
      } catch (error: any) {
        console.error("Failed to validate auth token or fetch user session:", error);
        // If 401 unauthorized (e.g. database cleared), log out immediately
        if (error?.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          set({ isAuthenticated: false, user: null });
        }
      }
    } else {
      set({ isAuthenticated: false, user: null });
    }
  },
}));
