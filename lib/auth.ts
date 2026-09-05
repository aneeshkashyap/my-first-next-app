/**
 * Compatibility Re-export for Supabase Authentication Service Layer
 *
 * @deprecated Prefer importing directly from '@/lib/auth'.
 */

export * from "./auth/authService";
export * from "./auth/accountLinkingService";
export type {
  AuthUser,
  AuthContextType,
  OAuthProvider,
  AccountConnectionStatus,
  UserIdentity,
} from "./types/auth";
