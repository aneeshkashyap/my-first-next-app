/**
 * Authentication Types, Mock User Configuration, and Storage Utilities
 * 
 * This module isolates all mock authentication credentials and session
 * management so it can be easily replaced by a real backend API in the future.
 */

export interface AuthUser {
  email: string;
  name: string;
  studentId: string;
  department: string;
  role: "student";
}

/**
 * Isolated Development Mock Credentials
 */
export const MOCK_USER_CREDENTIALS = {
  email: "2024cs0905@svce.ac.in",
  password: "Student@123",
  user: {
    email: "2024cs0905@svce.ac.in",
    name: "Aneesh Kashyap K S",
    studentId: "2024CS0905",
    department: "Computer Science & Engineering",
    role: "student" as const,
  },
};

const AUTH_STORAGE_KEY = "student_portal_auth_session_v1";

/**
 * Safely loads the authenticated user from localStorage.
 * Password is NEVER stored or read from localStorage.
 */
export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.email === "string" &&
      typeof parsed.name === "string"
    ) {
      return parsed as AuthUser;
    }
    return null;
  } catch (error) {
    console.warn("Failed to parse authenticated session from localStorage:", error);
    return null;
  }
}

/**
 * Persists only the non-sensitive AuthUser object in localStorage.
 */
export function setStoredAuthUser(user: AuthUser): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.warn("Failed to store authenticated session to localStorage:", error);
  }
}

/**
 * Clears the authenticated session from localStorage.
 */
export function clearStoredAuthUser(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to remove authenticated session from localStorage:", error);
  }
}

/**
 * Mock authentication validator.
 * Simulates server-side verification with credential checking.
 */
export async function authenticateCredentials(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  // Simulate network latency (250ms) for realistic UX and loading states
  await new Promise((resolve) => setTimeout(resolve, 250));

  const cleanEmail = email.trim().toLowerCase();
  const targetEmail = MOCK_USER_CREDENTIALS.email.toLowerCase();

  if (cleanEmail === targetEmail && password === MOCK_USER_CREDENTIALS.password) {
    return {
      success: true,
      user: MOCK_USER_CREDENTIALS.user,
    };
  }

  return {
    success: false,
    error: "Invalid institutional email or password. Please check your credentials.",
  };
}
