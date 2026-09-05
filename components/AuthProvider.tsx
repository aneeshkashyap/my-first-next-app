"use client";

/**
 * Authentication Context and Provider Component
 *
 * Manages the global student authentication state, initial Supabase session detection,
 * real-time session subscription, and credential login / logout operations.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  formatSupabaseUser,
  authenticateCredentials,
  signOutUser,
} from "@/lib/auth";
import type { AuthUser, AuthContextType } from "@/lib/types/auth";

export type { AuthUser, AuthContextType };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides student authentication state and actions across the application tree.
 *
 * @param props - Component props containing children elements.
 * @returns Context provider wrapping the application subtree.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    /**
     * Retrieves the initial authenticated session from Supabase on application load.
     */
    async function initializeAuth() {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (isMounted) {
          if (currentUser) {
            setUser(formatSupabaseUser(currentUser));
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.warn("Failed to check active Supabase auth session:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    // Subscribe to Supabase authentication state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(formatSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Authenticates user credentials against Supabase and navigates to the dashboard on success.
   *
   * @param email - Student institutional email address.
   * @param password - Account password.
   * @returns Operation result with success flag and optional error message.
   */
  const login = useCallback(
    async (email: string, password: string) => {
      const result = await authenticateCredentials(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        router.replace("/");
        return { success: true };
      }
      return {
        success: false,
        error: result.error || "Authentication failed. Please check your credentials.",
      };
    },
    [router]
  );

  /**
   * Signs out the authenticated user session and redirects to the login screen.
   */
  const logout = useCallback(async () => {
    await signOutUser();
    setUser(null);
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Accesses the active authentication context. Must be invoked within an AuthProvider.
 *
 * @returns Active AuthContextType containing current student, authentication status, and auth actions.
 * @throws Error if invoked outside of an AuthProvider hierarchy.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
