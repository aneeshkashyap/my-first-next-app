/**
 * Supabase Authentication Service Layer
 *
 * Implements client-side authentication routines for email/password credentials,
 * user session sign-out, OAuth PKCE redirection, and user metadata normalization.
 */

import { createClient } from "@/lib/supabase/client";
import type { AuthUser, OAuthProvider, SupabaseUser } from "@/lib/types/auth";

/**
 * Normalizes a Supabase authentication User object into the portal's standard AuthUser model.
 * Safely derives student display name and student identification number from metadata and email.
 *
 * @param supabaseUser - Raw Supabase user session object.
 * @returns Standardized AuthUser model for the authenticated student.
 */
export function formatSupabaseUser(supabaseUser: SupabaseUser): AuthUser {
  const metadata = supabaseUser.user_metadata || {};
  const email = supabaseUser.email || "";

  // Extract display name from user metadata safely:
  // metadata.full_name -> metadata.name -> metadata.user_name -> email local-part -> "Student"
  const name =
    metadata.full_name ||
    metadata.name ||
    metadata.user_name ||
    (email ? email.split("@")[0] : "Student");

  // Extract or safely derive temporary student ID without copying another student's ID
  const studentId =
    metadata.student_id ||
    metadata.studentId ||
    (email
      ? email.split("@")[0].toUpperCase()
      : `STU-${supabaseUser.id.substring(0, 8).toUpperCase()}`);

  return {
    id: supabaseUser.id,
    name,
    email,
    studentId,
    role: "student",
  };
}

/**
 * Authenticates student credentials against Supabase Auth using email and password.
 *
 * @param email - Student institutional email address.
 * @param password - Student account password.
 * @returns Success status, formatted AuthUser on success, or friendly error message on failure.
 */
export async function authenticateCredentials(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Invalid email or password. Please check your credentials.",
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: "Authentication failed. No user returned from authentication service.",
      };
    }

    return {
      success: true,
      user: formatSupabaseUser(data.user),
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { success: false, error: err.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred during authentication. Please try again.",
    };
  }
}

/**
 * Signs out the currently authenticated user session from Supabase.
 *
 * @returns Success flag and optional error message if sign-out fails.
 */
export async function signOutUser(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { success: false, error: err.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred during sign out.",
    };
  }
}

/**
 * Initiates an OAuth sign-in flow for the given provider ('google' | 'github')
 * using PKCE redirection to the /auth/callback route handler.
 *
 * @param provider - Selected OAuth provider ("google" | "github").
 * @returns Success flag and optional error message if redirect initiation fails.
 */
export async function signInWithOAuthProvider(
  provider: OAuthProvider
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "/auth/callback";

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { success: false, error: err.message };
    }
    return {
      success: false,
      error: `An unexpected error occurred during ${provider} sign in.`,
    };
  }
}
