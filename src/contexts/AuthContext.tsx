// @ts-nocheck
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI, logout as apiLogout } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
        } catch (err) {
          console.warn("Failed to get user from token:", err.message);
          localStorage.removeItem("accessToken");
        }
      }
      setLoading(false);
      setInitialized(true);
    };
    initAuth();
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem("accessToken", token);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.warn("Logout API call failed:", err.message);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((data) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  }, []);

  const value = {
    user,
    loading,
    initialized,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
