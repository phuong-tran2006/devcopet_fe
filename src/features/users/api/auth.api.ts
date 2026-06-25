import { api } from "../../../services/axiosClient";
import type { LoginDto, RegisterDto } from "../types/auth.types";

export const retryPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const verifyResetCode = async (email: string, code: string) => {
  const response = await api.post("/auth/verify-reset-code", { email, code });
  return response.data;
};

export const changePassword = async (payload: {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await api.post("/auth/reset-password", payload);
  return response.data;
};

export const authApi = {
  login: async (data: LoginDto) => {
    try {
      const response = await api.post("/auth/login", data);
      return response.data;
    } catch (err: any) {
      if (
        err.response &&
        (err.response.status === 400 || err.response.status === 401)
      ) {
        const message = err.response.data?.message || err.message;
        throw new Error(Array.isArray(message) ? message[0] : message);
      }
      throw new Error("Login service is unavailable. Please try again later.");
    }
  },

  register: async (data: RegisterDto) => {
    try {
      const response = await api.post("/auth/register", data);
      return response.data;
    } catch (err: any) {
      if (
        err.response &&
        (err.response.status === 400 || err.response.status === 409)
      ) {
        const message = err.response.data?.message || err.message;
        throw new Error(Array.isArray(message) ? message[0] : message);
      }
      throw new Error(
        "Register service is unavailable. Please try again later.",
      );
    }
  },

  resendVerificationEmail: async (email: string) => {
    try {
      const response = await api.post("/auth/resend-verification-email", {
        email,
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message;
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  },

  verifyEmail: async (email: string, code: string) => {
    try {
      const response = await api.post("/auth/verify-email", { email, code });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message;
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  },

  retryPassword: async (email: string) => {
    return retryPassword(email);
  },

  verifyResetCode: async (email: string, code: string) => {
    return verifyResetCode(email, code);
  },

  changePassword: async (data: {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    return changePassword(data);
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};
