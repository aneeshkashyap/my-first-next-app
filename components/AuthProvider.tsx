"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  AuthUser,
  getStoredAuthUser,
  setStoredAuthUser,
  clearStoredAuthUser,
  authenticateCredentials,
} from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Restore authenticated session on client mount to prevent SSR hydration mismatch
  useEffect(() => {
    const savedUser = getStoredAuthUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  // Sync session changes across multiple browser tabs/windows
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "student_portal_auth_session_v1") {
        const updated = getStoredAuthUser();
        setUser(updated);
        if (!updated) {
          router.replace("/login");
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [router]);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await authenticateCredentials(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        setStoredAuthUser(result.user);
        router.replace("/");
        return { success: true };
      }
      return { success: false, error: result.error || "Login failed" };
    },
    [router]
  );

  const logout = useCallback(() => {
    setUser(null);
    clearStoredAuthUser();
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

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
