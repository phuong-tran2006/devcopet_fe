import { api } from "../../../services/axiosClient";
import type { LoginDto, RegisterDto } from "../types/auth.types";

// Simulate network delay for mock data
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUsers = [
  {
    id: "1",
    username: "demo_user",
    email: "demo@devcopet.io",
    password: "demo123",
    fullName: "Demo User",
    avatar: null,
    codingExperience: "intermediate",
    dateOfBirth: "1995-06-15",
    createdAt: "2024-01-15T10:30:00Z",
    role: "user",
  },
  {
    id: "admin",
    username: "admin",
    email: "admin@devcopet.io",
    password: "admin123",
    fullName: "Administrator",
    avatar: null,
    codingExperience: "expert",
    dateOfBirth: null,
    createdAt: "2024-01-01T00:00:00Z",
    role: "admin",
  },
];

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
    // try {
    //   const response = await api.post("/auth/login", data);
    //   return response.data;
    // } catch(e) { ... fallback to mock }

    // Mock implementation based on chithanh branch
    await delay(800);

    if (!data.email || !data.password) {
      throw new Error("Email and password are required");
    }

    const user = mockUsers.find((u) => u.email === data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isDemoUser = user.email === "demo@devcopet.io";
    const isAdminUser = user.email === "admin@devcopet.io";

    if (!isDemoUser && !isAdminUser && user.password !== data.password) {
      throw new Error("Invalid email or password");
    }

    if (isAdminUser && data.password !== "admin123") {
      throw new Error("Invalid email or password");
    }

    const accessToken = `mock_access_token_${Date.now()}`;
    const refreshToken = `mock_refresh_token_${Date.now()}`;
    const { password, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  },

  register: async (data: RegisterDto) => {
    // const response = await api.post("/auth/register", data);
    // return response.data;

    // Mock implementation based on chithanh branch
    await delay(800);

    const username =
      (data as RegisterDto & { fullName?: string }).fullName?.trim() ||
      data.email.split("@")[0];

    if (!data.email || !data.password) {
      throw new Error("Email and password are required");
    }

    const existingUser = mockUsers.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const existingUsername = mockUsers.find((u) => u.username === username);
    if (existingUsername) {
      throw new Error("Username already taken");
    }

    const newUser = {
      id: String(mockUsers.length + 1),
      username,
      email: data.email,
      password: data.password,
      fullName: (data as any).fullName || username,
      avatar: null,
      codingExperience:
        (data as RegisterDto & { codingExperience?: string })
          .codingExperience || "beginner",
      dateOfBirth: null,
      createdAt: new Date().toISOString(),
      role: "user",
    };

    mockUsers.push(newUser);

    const accessToken = `mock_access_token_${Date.now()}`;
    const refreshToken = `mock_refresh_token_${Date.now()}`;
    const { password, ...userWithoutPassword } = newUser;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
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
    // const response = await api.post("/auth/logout");
    // return response.data;
    await delay(300);
    return true;
  },
};
