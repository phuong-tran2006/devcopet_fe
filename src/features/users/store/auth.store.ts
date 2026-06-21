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
  setAuth: (
    accessToken?: string | null,
    refreshToken?: string | null,
    user?: User | null,
  ) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  setAuth: (_accessToken, _refreshToken, user) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
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
    // Restore user data from localStorage first for instant UI response.
    let user: User | null = null;
    try {
      const stored = localStorage.getItem("user");
      if (stored) user = JSON.parse(stored);
    } catch {
      // ignore parse errors
    }

    if (user) {
      set({ isAuthenticated: true, user });
    }

    try {
      const { api } = await import("../../../services/axiosClient");
      const response = await api.get("/users/me", {
        _skipAuthRedirect: true,
      } as any);
      const freshUser = response.data;
      localStorage.setItem("user", JSON.stringify(freshUser));
      set({ isAuthenticated: true, user: freshUser });
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      set({ isAuthenticated: false, user: null });
    }
  },
}));
