"use client";

/**
 * Account Connections Component
 *
 * Allows authenticated students to view, link, and disconnect third-party
 * OAuth identities (Google and GitHub) to their institutional student account.
 */

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  getLinkedAccountIdentities,
  linkGoogleIdentity,
  linkGitHubIdentity,
  unlinkOAuthIdentity,
} from "@/lib/auth";
import type { AccountConnectionStatus, OAuthProvider } from "@/lib/types/auth";
import type { UserIdentity } from "@supabase/supabase-js";

/**
 * Inner account connections component that consumes Next.js searchParams.
 *
 * @returns Account connections panel view.
 */
function AccountConnectionsContent() {
  const searchParams = useSearchParams();

  const [connections, setConnections] = useState<AccountConnectionStatus>({
    hasPassword: true,
    isGoogleConnected: false,
    isGitHubConnected: false,
  });
  const [rawIdentities, setRawIdentities] = useState<UserIdentity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<OAuthProvider | "unlink" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isUrlErrorDismissed, setIsUrlErrorDismissed] = useState(false);

  // Derive error from searchParams if present and not dismissed
  const urlError = (() => {
    if (isUrlErrorDismissed) return null;
    const error = searchParams.get("error");
    const errorDesc = searchParams.get("error_description");
    if (!error && !errorDesc) return null;

    const combined = `${error || ""} ${errorDesc || ""}`.toLowerCase();

    if (
      combined.includes("already belongs to another user") ||
      combined.includes("identity_already_exists") ||
      combined.includes("already exists") ||
      combined.includes("conflict")
    ) {
      return "This account is already linked to another user profile. If you previously signed into the portal with this Google or GitHub account, that identity is currently attached to a separate profile and must first be detached before it can be linked to your institutional account.";
    }

    if (combined.includes("identity already linked") || combined.includes("already linked")) {
      return "This third-party account is already linked to your profile.";
    }

    if (combined.includes("cancelled") || combined.includes("denied") || combined.includes("access_denied")) {
      return "Account linking authorization was cancelled or denied.";
    }

    return errorDesc || error || "Failed to link third-party account.";
  })();

  const activeErrorMessage = errorMessage || urlError;

  /**
   * Refreshes the list of linked identities from the Supabase authentication service.
   */
  const loadConnections = useCallback(async () => {
    const res = await getLinkedAccountIdentities();
    if (res.success) {
      setConnections(res.connections);
      setRawIdentities(res.rawIdentities);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    getLinkedAccountIdentities().then((res) => {
      if (!isMounted) return;
      if (res.success) {
        setConnections(res.connections);
        setRawIdentities(res.rawIdentities);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Triggers the manual identity linking flow for the chosen OAuth provider.
   *
   * @param provider - OAuth provider to link ("google" | "github").
   */
  const handleLink = async (provider: OAuthProvider) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setActionLoading(provider);

    try {
      const res =
        provider === "google"
          ? await linkGoogleIdentity()
          : await linkGitHubIdentity();

      if (!res.success) {
        setErrorMessage(res.error || `Failed to initiate ${provider} linking.`);
        setActionLoading(null);
      }
    } catch {
      setErrorMessage(`An unexpected error occurred while linking ${provider}.`);
      setActionLoading(null);
    }
  };

  /**
   * Disconnects a linked identity provider from the active profile.
   *
   * @param provider - Provider to unlink ("google" | "github").
   */
  const handleUnlink = async (provider: OAuthProvider) => {
    const target = rawIdentities.find((i) => i.provider === provider);
    if (!target) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setActionLoading("unlink");

    try {
      const res = await unlinkOAuthIdentity(target);
      if (res.success) {
        setSuccessMessage(`${provider === "google" ? "Google" : "GitHub"} account detached successfully.`);
        await loadConnections();
      } else {
        setErrorMessage(res.error || `Failed to disconnect ${provider} account.`);
      }
    } catch {
      setErrorMessage(`An error occurred while disconnecting ${provider}.`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Account Connections
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Link your Google or GitHub account to your institutional student profile so you can use either identity to sign in.
        </p>
      </div>

      {/* Error Alert */}
      {activeErrorMessage && (
        <div
          className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start justify-between gap-3 shadow-xs"
          role="alert"
        >
          <div className="flex items-start gap-2.5">
            <svg
              className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="leading-relaxed">{activeErrorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setIsUrlErrorDismissed(true);
            }}
            className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 cursor-pointer text-sm leading-none p-0.5"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div
          className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-start justify-between gap-3 shadow-xs"
          role="status"
        >
          <div className="flex items-start gap-2.5">
            <svg
              className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="leading-relaxed">{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 cursor-pointer text-sm leading-none p-0.5"
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      {/* Connection Items */}
      <div className="space-y-3">
        {/* 1. Institutional Password */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Institutional Email & Password
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Core academic portal credentials
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Connected (Primary)
          </span>
        </div>

        {/* 2. Google Connection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0 shadow-2xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Google Account
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {connections.isGoogleConnected
                  ? connections.googleEmail
                    ? `Linked as ${connections.googleEmail}`
                    : "Identity connected"
                  : "Not connected to this account"}
              </p>
            </div>
          </div>

          <div className="self-start sm:self-auto flex items-center gap-2">
            {isLoading ? (
              <div className="w-16 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ) : connections.isGoogleConnected ? (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Connected
                </span>
                <button
                  type="button"
                  onClick={() => handleUnlink("google")}
                  disabled={actionLoading !== null}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer disabled:opacity-50"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleLink("google")}
                disabled={actionLoading !== null}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {actionLoading === "google" ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <span>Link Google Account</span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* 3. GitHub Connection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                GitHub Account
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {connections.isGitHubConnected
                  ? connections.githubUsername
                    ? `Linked as @${connections.githubUsername}`
                    : "Identity connected"
                  : "Not connected to this account"}
              </p>
            </div>
          </div>

          <div className="self-start sm:self-auto flex items-center gap-2">
            {isLoading ? (
              <div className="w-16 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ) : connections.isGitHubConnected ? (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Connected
                </span>
                <button
                  type="button"
                  onClick={() => handleUnlink("github")}
                  disabled={actionLoading !== null}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer disabled:opacity-50"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleLink("github")}
                disabled={actionLoading !== null}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {actionLoading === "github" ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <span>Link GitHub Account</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Top-level AccountConnectionsSection component wrapped in Suspense boundary
 * to support useSearchParams client navigation.
 *
 * @returns Suspense-wrapped account connections view.
 */
export default function AccountConnectionsSection() {
  return (
    <Suspense
      fallback={
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm animate-pulse space-y-4">
          <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <div className="h-4 w-72 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          <div className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
          <div className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
          <div className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
        </div>
      }
    >
      <AccountConnectionsContent />
    </Suspense>
  );
}
