import { create } from "zustand";

interface User {
  id?: string;
  email?: string;
  name?: string;
  // Add other user fields as needed
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
    set({ isAuthenticated: true, user: user || null });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ isAuthenticated: false, user: null });
  },

  checkAuth: () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      set({ isAuthenticated: true });
      // Optionally, you can fetch user profile here if you have a /users/me endpoint
    } else {
      set({ isAuthenticated: false, user: null });
    }
  },
}));
