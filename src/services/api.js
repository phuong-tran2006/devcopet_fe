/**
 * API Service Layer
 * 
 * This module provides API functions for authentication and user management.
 * Uses mock data with simulated delays for development when no backend is available.
 * Can be easily swapped for real API calls by updating the fetch functions.
 */

// Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Simulate network delay for mock data (ms)
const MOCK_DELAY = 800;

// =============================================================================
// Utility Functions
// =============================================================================

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

// =============================================================================
// Mock Data for Authentication
// =============================================================================

const mockUsers = [
  {
    id: '1',
    username: 'demo_user',
    email: 'demo@devcopet.io',
    password: 'demo123',
    fullName: 'Demo User',
    avatar: null,
    codingExperience: 'intermediate',
    dateOfBirth: '1995-06-15',
    createdAt: '2024-01-15T10:30:00Z',
    role: 'user',
  },
  {
    id: 'admin',
    username: 'admin',
    email: 'admin@devcopet.io',
    password: 'admin123',
    fullName: 'Administrator',
    avatar: null,
    codingExperience: 'expert',
    dateOfBirth: null,
    createdAt: '2024-01-01T00:00:00Z',
    role: 'admin',
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
    throw new Error('Email, username, and password are required');
  }

  // Check if email already exists
  const existingUser = mockUsers.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Check if username already exists
  const existingUsername = mockUsers.find(u => u.username === data.username);
  if (existingUsername) {
    throw new Error('Username already taken');
  }

  // Create new user
  const newUser = {
    id: String(mockUsers.length + 1),
    username: data.username,
    email: data.email,
    password: data.password,
    fullName: data.fullName || data.username,
    avatar: null,
    codingExperience: data.codingExperience || 'beginner',
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
    throw new Error('Email and password are required');
  }

  // Find user by email (for demo, also check password)
  const user = mockUsers.find(u => u.email === data.email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password - demo user accepts any password, others require exact match
  const isDemoUser = user.email === 'demo@devcopet.io';
  const isAdminUser = user.email === 'admin@devcopet.io';
  
  if (!isDemoUser && !isAdminUser && user.password !== data.password) {
    throw new Error('Invalid email or password');
  }
  
  // For admin user, also check password
  if (isAdminUser && data.password !== 'admin123') {
    throw new Error('Invalid email or password');
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
  
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    throw new Error('No token found');
  }

  if (!currentMockUser) {
    // Try to find the user from mockUsers based on token
    // In a real app, the backend would validate the token
    throw new Error('Session expired');
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
// Course API Functions (existing)
// =============================================================================

const mockCourses = [
  {
    id: 'python',
    name: 'Python',
    description: 'Learn the fundamentals of Python programming from scratch',
    icon: '🐍',
    progress: 37,
    lessons: 8,
    completed: 3,
  },
  {
    id: 'java',
    name: 'Java',
    description: 'Master object-oriented programming with Java',
    icon: '☕',
    progress: 0,
    lessons: 10,
    completed: 0,
  },
  {
    id: 'cpp',
    name: 'C++',
    description: 'Build high-performance applications with C++',
    icon: '⚡',
    progress: 0,
    lessons: 12,
    completed: 0,
  },
];

const mockCourseDetails = {
  python: {
    id: 'python',
    name: 'Python',
    description: 'Learn the fundamentals of Python programming from scratch. This comprehensive course covers everything from basic syntax to advanced concepts like decorators and generators.',
    icon: '🐍',
    totalStudents: 3200,
    totalLessons: 8,
    completedLessons: 3,
    progress: 37,
    rank: 'Moss Green',
  },
  java: {
    id: 'java',
    name: 'Java',
    description: 'Master object-oriented programming with Java. Learn about classes, inheritance, polymorphism, and more.',
    icon: '☕',
    totalStudents: 2800,
    totalLessons: 10,
    completedLessons: 0,
    progress: 0,
    rank: 'Seedling',
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    description: 'Build high-performance applications with C++. From memory management to modern C++ features.',
    icon: '⚡',
    totalStudents: 2100,
    totalLessons: 12,
    completedLessons: 0,
    progress: 0,
    rank: 'Seedling',
  },
};

const mockChapters = {
  python: [
    {
      id: 1,
      title: 'Module 1: Basics',
      subtitle: 'Learn the fundamentals',
      icon: 'book',
      status: 'completed',
      rank: 'Moss Green',
      lessons: [
        { id: 1, title: 'Hello World', description: 'Write your first Python program', duration: '10 min', status: 'completed' },
        { id: 2, title: 'Variables & Data Types', description: 'Store and manipulate data', duration: '15 min', status: 'completed' },
      ],
    },
    {
      id: 2,
      title: 'Module 2: Control Flow',
      subtitle: 'Make decisions in code',
      icon: 'code',
      status: 'active',
      rank: 'Teal',
      lessons: [
        { id: 3, title: 'If Statements', description: 'Conditional execution', duration: '12 min', status: 'completed' },
        { id: 4, title: 'Loops', description: 'Repeat actions with for and while', duration: '18 min', status: 'active' },
        { id: 5, title: 'Break & Continue', description: 'Control loop execution', duration: '10 min', status: 'locked' },
      ],
    },
    {
      id: 3,
      title: 'Module 3: Functions',
      subtitle: 'Organize and reuse code',
      icon: 'function',
      status: 'locked',
      rank: 'Thistle',
      lessons: [
        { id: 6, title: 'Function Basics', description: 'Define and call functions', duration: '15 min', status: 'locked' },
        { id: 7, title: 'Function Parameters', description: 'Pass data to functions', duration: '20 min', status: 'locked' },
      ],
    },
    {
      id: 4,
      title: 'Module 4: Data Structures',
      subtitle: 'Work with collections',
      icon: 'data',
      status: 'locked',
      rank: 'Thistle',
      lessons: [
        { id: 8, title: 'Lists & Tuples', description: 'Ordered collections', duration: '25 min', status: 'locked' },
      ],
    },
  ],
  java: [
    {
      id: 1,
      title: 'Module 1: Java Basics',
      subtitle: 'Introduction to Java',
      icon: 'book',
      status: 'locked',
      rank: 'Seedling',
      lessons: [
        { id: 1, title: 'Hello Java', description: 'Your first Java program', duration: '10 min', status: 'locked' },
        { id: 2, title: 'Variables & Types', description: 'Data in Java', duration: '15 min', status: 'locked' },
      ],
    },
    {
      id: 2,
      title: 'Module 2: OOP Basics',
      subtitle: 'Object-oriented programming',
      icon: 'code',
      status: 'locked',
      rank: 'Seedling',
      lessons: [
        { id: 3, title: 'Classes & Objects', description: 'Create classes and objects', duration: '20 min', status: 'locked' },
        { id: 4, title: 'Inheritance', description: 'Extend classes', duration: '25 min', status: 'locked' },
      ],
    },
  ],
  cpp: [
    {
      id: 1,
      title: 'Module 1: C++ Basics',
      subtitle: 'Getting started with C++',
      icon: 'book',
      status: 'locked',
      rank: 'Seedling',
      lessons: [
        { id: 1, title: 'Hello C++', description: 'Your first C++ program', duration: '10 min', status: 'locked' },
        { id: 2, title: 'Variables & Types', description: 'Data types in C++', duration: '15 min', status: 'locked' },
      ],
    },
  ],
};

const mockLessons = {
  1: {
    id: 1,
    title: 'Hello World',
    description: 'Write your first Python program and understand the basics of Python syntax.',
    breadcrumb: 'Python > Chapter > Module 1: Basics',
    duration: '10 min',
    difficulty: 'Beginner',
    xp: 15,
    courseId: 'python',
    chapterId: 1,
    content: `Welcome to Python! In this lesson, you'll write your first Python program.

Python is known for its simple and readable syntax. Let's start with the classic "Hello, World!" program.

The print() function is used to display output on the screen. It's one of the most commonly used functions in Python.

Key points:
- print() displays text and values
- Text strings are enclosed in quotes (single or double)
- Python automatically adds a new line after each print()`,
    codeExample: `# Your first Python program
print("Hello, World!")

# Using single quotes
print('Hello, Python!')

# Printing multiple items
print("Python", "is", "awesome")

# Using f-strings (formatted strings)
name = "Python"
print(f"Hello, {name}!")`,
    exercise: `Write a program that prints "Hello, Devcopet!" to the screen.`,
    expectedOutput: 'Hello, Devcopet!',
  },
  2: {
    id: 2,
    title: 'Variables & Data Types',
    description: 'Learn how to store and manipulate data using variables and different data types in Python.',
    breadcrumb: 'Python > Chapter > Module 1: Basics',
    duration: '15 min',
    difficulty: 'Beginner',
    xp: 20,
    courseId: 'python',
    chapterId: 1,
    content: `Variables are containers for storing data values. In Python, you don't need to declare the type of a variable explicitly.

Python has several built-in data types:
- **Strings** (str): Text data
- **Integers** (int): Whole numbers
- **Floats** (float): Decimal numbers
- **Booleans** (bool): True or False
- **Lists**: Ordered collections
- **Dictionaries**: Key-value pairs`,
    codeExample: `# String variables
name = "Alice"
greeting = 'Hello'

# Integer variables
age = 25
year = 2024

# Float variables
price = 19.99
pi = 3.14159

# Boolean variables
is_student = True
has_graduated = False

# Check types with type()
print(type(name))  # <class 'str'>
print(type(age))   # <class 'int'>
print(type(price)) # <class 'float'>`,
    exercise: `Create variables to store your name (string), age (integer), and whether you're a student (boolean). Then print each variable on a separate line.`,
    expectedOutput: 'YourName\n25\nTrue',
  },
  3: {
    id: 3,
    title: 'If Statements',
    description: 'Learn how to make decisions in your code using conditional statements.',
    breadcrumb: 'Python > Chapter > Module 2: Control Flow',
    duration: '12 min',
    difficulty: 'Beginner',
    xp: 20,
    courseId: 'python',
    chapterId: 2,
    content: `If statements allow you to execute code based on conditions.

The basic structure is:
- if: Executes when condition is True
- elif: Checks another condition if previous ones were False
- else: Executes when no conditions are True

Comparison operators:
- == : Equal to
- != : Not equal to
- <, > : Less/Greater than
- <=, >= : Less/Greater than or equal to`,
    codeExample: `# Basic if statement
age = 18

if age >= 18:
    print("You are an adult")

# if-else
score = 75
if score >= 60:
    print("You passed!")
else:
    print("You failed")

# if-elif-else
grade = 85
if grade >= 90:
    print("A")
elif grade >= 80:
    print("B")
elif grade >= 70:
    print("C")
else:
    print("F")`,
    exercise: `Write a program that checks if a number is positive, negative, or zero. Use if-elif-else statements.`,
    expectedOutput: 'Positive/Negative/Zero based on input',
  },
  4: {
    id: 4,
    title: 'Loops',
    description: 'Learn how to use for and while loops to repeat actions in your code.',
    breadcrumb: 'Python > Chapter > Module 2: Control Flow',
    duration: '18 min',
    difficulty: 'Beginner',
    xp: 25,
    courseId: 'python',
    chapterId: 2,
    content: `Loops allow you to execute a block of code multiple times.

**For Loop**: Used to iterate over a sequence (list, tuple, string, or range).

**While Loop**: Executes as long as a condition is true.

Loops help you avoid repetition and make your code more efficient.`,
    codeExample: `# For Loop - Iterate over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# For Loop with range
for i in range(5):
    print(f"Iteration: {i}")

# While Loop
count = 0
while count < 3:
    print(f"Count: {count}")
    count += 1`,
    exercise: `Write a for loop that prints numbers from 1 to 5 using the range() function.`,
    expectedOutput: '1\n2\n3\n4\n5',
  },
  5: {
    id: 5,
    title: 'Break & Continue',
    description: 'Control loop execution with break and continue statements.',
    breadcrumb: 'Python > Chapter > Module 2: Control Flow',
    duration: '10 min',
    difficulty: 'Beginner',
    xp: 15,
    courseId: 'python',
    chapterId: 2,
    content: `The break statement exits the loop entirely.

The continue statement skips the rest of the current iteration and moves to the next one.

These statements give you fine-grained control over loop execution.`,
    codeExample: `# Break - exit the loop
for i in range(10):
    if i == 5:
        break
    print(i)

# Continue - skip iteration
for i in range(5):
    if i == 2:
        continue
    print(i)`,
    exercise: `Write a loop that prints numbers 1-10 but skips 5 using continue.`,
    expectedOutput: '1\n2\n3\n4\n6\n7\n8\n9\n10',
  },
  6: {
    id: 6,
    title: 'Function Basics',
    description: 'Define and call functions to organize and reuse code.',
    breadcrumb: 'Python > Chapter > Module 3: Functions',
    duration: '15 min',
    difficulty: 'Intermediate',
    xp: 25,
    courseId: 'python',
    chapterId: 3,
    content: `Functions are reusable blocks of code that perform a specific task.

Benefits of functions:
- Code reusability
- Better organization
- Easier testing
- Improved readability

Use the def keyword to define a function.`,
    codeExample: `# Define a simple function
def greet():
    print("Hello!")

# Call the function
greet()

# Function with parameter
def greet_person(name):
    print(f"Hello, {name}!")

greet_person("Alice")
greet_person("Bob")

# Function with return value
def add(a, b):
    return a + b

result = add(3, 5)
print(f"3 + 5 = {result}")`,
    exercise: `Create a function called square that takes a number and returns its square.`,
    expectedOutput: 'The function should return the square of any number passed to it.',
  },
};

/**
 * Fetch all courses
 * GET /courses
 */
export const getCourses = async () => {
  await delay(MOCK_DELAY);
  return mockCourses;
};

/**
 * Fetch a single course by ID
 * GET /courses/:courseId
 */
export const getCourse = async (courseId) => {
  await delay(MOCK_DELAY);
  const course = mockCourseDetails[courseId];
  if (!course) {
    throw new Error(`Course not found: ${courseId}`);
  }
  return course;
};

/**
 * Fetch chapters for a course
 * GET /courses/:courseId/chapters
 */
export const getCourseChapters = async (courseId) => {
  await delay(MOCK_DELAY);
  const chapters = mockChapters[courseId];
  if (!chapters) {
    throw new Error(`Course not found: ${courseId}`);
  }
  return chapters;
};

/**
 * Fetch lessons for a chapter
 * GET /chapters/:chapterId/lessons
 */
export const getChapterLessons = async (chapterId) => {
  await delay(MOCK_DELAY);
  for (const courseId of Object.keys(mockChapters)) {
    const chapters = mockChapters[courseId];
    const chapter = chapters.find((c) => c.id === chapterId);
    if (chapter) {
      return chapter.lessons;
    }
  }
  throw new Error(`Chapter not found: ${chapterId}`);
};

/**
 * Fetch a single lesson by ID
 * GET /lessons/:lessonId
 */
export const getLesson = async (lessonId) => {
  await delay(MOCK_DELAY);
  const lesson = mockLessons[lessonId];
  if (!lesson) {
    throw new Error(`Lesson not found: ${lessonId}`);
  }
  return lesson;
};

/**
 * Fetch all lessons for a course (flat list)
 */
export const getCourseLessons = async (courseId) => {
  await delay(MOCK_DELAY);
  const chapters = mockChapters[courseId];
  if (!chapters) {
    throw new Error(`Course not found: ${courseId}`);
  }
  const lessons = chapters.flatMap((chapter) => chapter.lessons);
  return lessons;
};

// =============================================================================
// Export config and mock data for development/debugging
// =============================================================================

export const apiConfig = {
  baseUrl: API_BASE_URL,
  useMock: true,
  mockDelay: MOCK_DELAY,
};

export { mockCourses, mockCourseDetails, mockChapters, mockLessons };

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
