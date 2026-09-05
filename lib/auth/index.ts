/**
 * Authentication Module Barrel Export
 */

export * from "./authService";
export * from "./accountLinkingService";
export type {
  AuthUser,
  AuthContextType,
  OAuthProvider,
  AccountConnectionStatus,
  UserIdentity,
} from "@/lib/types/auth";
