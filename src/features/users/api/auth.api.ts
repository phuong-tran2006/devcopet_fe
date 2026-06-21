import { api } from "../../../services/axiosClient";
import type { LoginDto, RegisterDto } from "../types/auth.types";

export const retryPassword = async (email: string) => {
  const response = await api.post("/auth/retry-password", { email });
  return response.data;
};

export const changePassword = async (payload: {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}) => {
  const response = await api.post("/auth/change-password", payload);
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

  retryPassword: async (email: string) => {
    return retryPassword(email);
  },

  changePassword: async (data: {
    email: string;
    code: string;
    password: string;
    confirmPassword: string;
  }) => {
    return changePassword(data);
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};
