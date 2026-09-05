/**
 * Authentication and authorization types for the Student Portal.
 */

import type { User as SupabaseUser } from "@supabase/supabase-js";

/**
 * Normalized student user model used across client sessions and components.
 */
export interface AuthUser {
  /** Unique Supabase authentication UID matching auth.uid(). */
  id: string;
  /** Display name of the authenticated student. */
  name: string;
  /** Institutional email address. */
  email: string;
  /** Unique student identification number (e.g. 2024CS0905). */
  studentId: string;
  /** Role within the academic portal. */
  role: "student";
}

/**
 * React context value shape provided by AuthProvider to consumers.
 */
export interface AuthContextType {
  /** Current active authenticated student, or null if unauthenticated. */
  user: AuthUser | null;
  /** True when a valid user session is active. */
  isAuthenticated: boolean;
  /** True while the initial Supabase session is being checked. */
  isLoading: boolean;
  /**
   * Signs in a user with email and password credentials.
   *
   * @param email - Student email address.
   * @param password - Student account password.
   * @returns Operation result with optional error message.
   */
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  /**
   * Signs out the active user session and redirects to login.
   */
  logout: () => Promise<void>;
}

/**
 * Supported OAuth identity providers.
 */
export type OAuthProvider = "google" | "github";

/**
 * Account connection status across authentication providers for the active student.
 */
export interface AccountConnectionStatus {
  /** True if email and password authentication is active. */
  hasPassword: boolean;
  /** True if a Google OAuth identity is linked to this account. */
  isGoogleConnected: boolean;
  /** True if a GitHub OAuth identity is linked to this account. */
  isGitHubConnected: boolean;
  /** Identity metadata for linked Google account, if present. */
  googleEmail?: string;
  /** Identity metadata for linked GitHub account, if present. */
  githubUsername?: string;
}

export type { SupabaseUser };
export type { UserIdentity } from "@supabase/supabase-js";
