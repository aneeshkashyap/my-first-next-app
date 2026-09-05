/**
 * Supabase OAuth Account Linking Service Layer
 *
 * Provides authenticated students with manual identity linking routines to connect
 * third-party Google and GitHub identities to their existing institutional profile
 * using Supabase Auth's official linkIdentity() API.
 */

import { createClient } from "@/lib/supabase/client";
import type { OAuthProvider, AccountConnectionStatus } from "@/lib/types/auth";
import type { UserIdentity } from "@supabase/supabase-js";

/**
 * Retrieves the currently linked identity providers for the active authenticated user.
 *
 * @returns Result object with connection status for Email/Password, Google, and GitHub.
 */
export async function getLinkedAccountIdentities(): Promise<{
  success: boolean;
  connections: AccountConnectionStatus;
  rawIdentities: UserIdentity[];
  error?: string;
}> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUserIdentities();

    if (error) {
      return {
        success: false,
        connections: {
          hasPassword: true,
          isGoogleConnected: false,
          isGitHubConnected: false,
        },
        rawIdentities: [],
        error: error.message,
      };
    }

    const identities: UserIdentity[] = data?.identities || [];
    const hasPassword = identities.some((i) => i.provider === "email");
    const googleIdentity = identities.find((i) => i.provider === "google");
    const githubIdentity = identities.find((i) => i.provider === "github");

    const googleEmail =
      (googleIdentity?.identity_data?.email as string) || undefined;
    const githubUsername =
      (githubIdentity?.identity_data?.user_name as string) ||
      (githubIdentity?.identity_data?.preferred_username as string) ||
      undefined;

    return {
      success: true,
      connections: {
        hasPassword: hasPassword || identities.length === 0,
        isGoogleConnected: Boolean(googleIdentity),
        isGitHubConnected: Boolean(githubIdentity),
        googleEmail,
        githubUsername,
      },
      rawIdentities: identities,
    };
  } catch (err: unknown) {
    return {
      success: false,
      connections: {
        hasPassword: true,
        isGoogleConnected: false,
        isGitHubConnected: false,
      },
      rawIdentities: [],
      error:
        err instanceof Error
          ? err.message
          : "Failed to retrieve account connection statuses.",
    };
  }
}

/**
 * Initiates linking a third-party OAuth provider identity to the active user profile
 * via Supabase linkIdentity(), redirecting the browser to the provider authorization screen.
 *
 * @param provider - OAuth identity provider to link ("google" | "github").
 * @returns Result object with success flag and optional error message.
 */
export async function linkOAuthIdentity(
  provider: OAuthProvider
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=/profile`
        : "/auth/callback?next=/profile";

    const { error } = await supabase.auth.linkIdentity({
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
      error: `An unexpected error occurred while linking ${provider}.`,
    };
  }
}

/**
 * Links a Google account identity to the active institutional user session.
 *
 * @returns Result object with operation success status and optional error.
 */
export async function linkGoogleIdentity(): Promise<{ success: boolean; error?: string }> {
  return linkOAuthIdentity("google");
}

/**
 * Links a GitHub account identity to the active institutional user session.
 *
 * @returns Result object with operation success status and optional error.
 */
export async function linkGitHubIdentity(): Promise<{ success: boolean; error?: string }> {
  return linkOAuthIdentity("github");
}

/**
 * Unlinks a previously linked third-party OAuth identity from the active user profile.
 *
 * @param identity - The UserIdentity record to detach.
 * @returns Operation success status or friendly error message.
 */
export async function unlinkOAuthIdentity(
  identity: UserIdentity
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.unlinkIdentity(identity);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to unlink external account.",
    };
  }
}
