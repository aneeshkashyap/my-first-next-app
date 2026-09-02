/**
 * Supabase Authentication Types and Service Layer
 * 
 * Provides client-side Supabase authentication functions for signing in with
 * email/password, signing out, and formatting Supabase user sessions.
 */

import { createClient } from "@/utils/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  studentId: string;
  role: "student";
}

/**
 * Formats a Supabase User object into our application's AuthUser model
 */
export function formatSupabaseUser(supabaseUser: SupabaseUser): AuthUser {
  const metadata = supabaseUser.user_metadata || {};
  const email = supabaseUser.email || "";

  // Extract display name from user metadata: prioritize full_name
  const name =
    metadata.full_name ||
    metadata.name ||
    (email.toLowerCase() === "2024cs0905@svce.ac.in"
      ? "Aneesh Kashyap K S"
      : email
      ? email.split("@")[0]
      : "Aneesh Kashyap K S");

  // Extract or generate student ID
  const studentId =
    metadata.student_id ||
    metadata.studentId ||
    (email.toLowerCase() === "2024cs0905@svce.ac.in"
      ? "2024CS0905"
      : email
      ? email.split("@")[0].toUpperCase()
      : "2024CS0905");

  return {
    id: supabaseUser.id,
    name,
    email,
    studentId,
    role: "student",
  };
}

/**
 * Authenticates user credentials against Supabase Auth using email and password.
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
 * Signs out the current user session from Supabase.
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
