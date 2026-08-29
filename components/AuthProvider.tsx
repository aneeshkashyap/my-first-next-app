"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
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

// Listeners for in-memory session changes and multi-tab synchronization
const authListeners = new Set<() => void>();

function notifyAuthListeners() {
  authListeners.forEach((listener) => listener());
}

function subscribeAuth(callback: () => void) {
  authListeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === "student_portal_auth_session_v1") {
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    authListeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

let cachedUserJson = "";
let cachedUser: AuthUser | null = null;

function getAuthSnapshot(): AuthUser | null {
  const current = getStoredAuthUser();
  const json = JSON.stringify(current);
  if (json !== cachedUserJson) {
    cachedUserJson = json;
    cachedUser = current;
  }
  return cachedUser;
}

function getServerAuthSnapshot(): AuthUser | null {
  return null;
}

function subscribeClient() {
  return () => {};
}

function getClientSnapshot(): boolean {
  return true;
}

function getServerClientSnapshot(): boolean {
  return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isClient = useSyncExternalStore(
    subscribeClient,
    getClientSnapshot,
    getServerClientSnapshot
  );

  const user = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getServerAuthSnapshot
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await authenticateCredentials(email, password);
      if (result.success && result.user) {
        setStoredAuthUser(result.user);
        notifyAuthListeners();
        router.replace("/");
        return { success: true };
      }
      return { success: false, error: result.error || "Login failed" };
    },
    [router]
  );

  const logout = useCallback(() => {
    clearStoredAuthUser();
    notifyAuthListeners();
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: !isClient,
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
