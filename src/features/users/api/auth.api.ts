import { api } from "../../../services/axiosClient";
import type { LoginDto, RegisterDto } from "../types/auth.types";

export const authApi = {
  login: async (data: LoginDto) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterDto) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};
