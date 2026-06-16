import { create } from "zustand";

interface User {
  id?: string;
  email?: string;
  name?: string;
  username?: string;
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

  checkAuth: () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Restore user data from localStorage
      let user: User | null = null;
      try {
        const stored = localStorage.getItem("user");
        if (stored) user = JSON.parse(stored);
      } catch {
        // ignore parse errors
      }
      set({ isAuthenticated: true, user });
    } else {
      set({ isAuthenticated: false, user: null });
    }
  },
}));
