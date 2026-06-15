/**
 * API Service Layer
 *
 * This module provides API functions for authentication and user management.
 * Uses mock data with simulated delays for development when no backend is available.
 * Can be easily swapped for real API calls by updating the fetch functions.
 */

// Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Simulate network delay for mock data (ms)
const MOCK_DELAY = 800;

// =============================================================================
// Utility Functions
// =============================================================================

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// =============================================================================
// Mock Data for Authentication
// =============================================================================

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

let currentMockUser = null;

// =============================================================================
// Auth API Functions
// =============================================================================

/**
 * Register a new user
 * POST /auth/register
 */
export const register = async (data) => {
  // Real API implementation:
  // const response = await fetch(`${API_BASE_URL}/auth/register`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) {
  //   const err = await response.json();
  //   throw new Error(err.message || 'Registration failed');
  // }
  // return response.json();

  // Mock implementation
  await delay(MOCK_DELAY);

  // Validate required fields
  if (!data.email || !data.password || !data.username) {
    throw new Error("Email, username, and password are required");
  }

  // Check if email already exists
  const existingUser = mockUsers.find((u) => u.email === data.email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Check if username already exists
  const existingUsername = mockUsers.find((u) => u.username === data.username);
  if (existingUsername) {
    throw new Error("Username already taken");
  }

  // Create new user
  const newUser = {
    id: String(mockUsers.length + 1),
    username: data.username,
    email: data.email,
    password: data.password,
    fullName: data.fullName || data.username,
    avatar: null,
    codingExperience: data.codingExperience || "beginner",
    dateOfBirth: data.dateOfBirth || null,
    createdAt: new Date().toISOString(),
  };

  mockUsers.push(newUser);

  // Return mock token and user data
  const token = `mock_token_${Date.now()}`;
  const { password, ...userWithoutPassword } = newUser;

  return {
    token,
    user: userWithoutPassword,
  };
};

/**
 * Login user
 * POST /auth/login
 */
export const login = async (data) => {
  // Real API implementation:
  // const response = await fetch(`${API_BASE_URL}/auth/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) {
  //   const err = await response.json();
  //   throw new Error(err.message || 'Login failed');
  // }
  // return response.json();

  // Mock implementation
  await delay(MOCK_DELAY);

  if (!data.email || !data.password) {
    throw new Error("Email and password are required");
  }

  // Find user by email (for demo, also check password)
  const user = mockUsers.find((u) => u.email === data.email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check password - demo user accepts any password, others require exact match
  const isDemoUser = user.email === "demo@devcopet.io";
  const isAdminUser = user.email === "admin@devcopet.io";

  if (!isDemoUser && !isAdminUser && user.password !== data.password) {
    throw new Error("Invalid email or password");
  }

  // For admin user, also check password
  if (isAdminUser && data.password !== "admin123") {
    throw new Error("Invalid email or password");
  }

  // Generate mock token
  const token = `mock_token_${Date.now()}`;
  currentMockUser = user;

  const { password, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
};

/**
 * Logout user
 * POST /auth/logout
 */
export const logout = async () => {
  // Real API implementation:
  // const response = await fetch(`${API_BASE_URL}/auth/logout`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  // });
  // return response.ok;

  // Mock implementation
  await delay(300);
  currentMockUser = null;
  return true;
};

/**
 * Get current user
 * GET /users/me
 */
export const getMe = async () => {
  // Real API implementation:
  // const response = await fetch(`${API_BASE_URL}/users/me`, {
  //   headers: getAuthHeaders(),
  // });
  // if (!response.ok) {
  //   throw new Error('Unauthorized');
  // }
  // return response.json();

  // Mock implementation
  await delay(MOCK_DELAY);

  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No token found");
  }

  if (!currentMockUser) {
    // Try to find the user from mockUsers based on token
    // In a real app, the backend would validate the token
    throw new Error("Session expired");
  }

  const { password, ...userWithoutPassword } = currentMockUser;
  return userWithoutPassword;
};

// =============================================================================
// Social Auth Functions
// =============================================================================

/**
 * Redirect to Google OAuth
 */
export const googleAuth = () => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};

/**
 * Redirect to GitHub OAuth
 */
export const githubAuth = () => {
  window.location.href = `${API_BASE_URL}/auth/github`;
};

/**
 * Redirect to Facebook OAuth
 */
export const facebookAuth = () => {
  window.location.href = `${API_BASE_URL}/auth/facebook`;
};

// =============================================================================
// Export config and mock data for development/debugging
// =============================================================================

export const apiConfig = {
  baseUrl: API_BASE_URL,
  useMock: true,
  mockDelay: MOCK_DELAY,
};

// =============================================================================
// Auth API Export (for convenience)
// =============================================================================

export const authAPI = {
  register,
  login,
  logout,
  getMe,
  google: googleAuth,
  github: githubAuth,
  facebook: facebookAuth,
};
