import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase OAuth PKCE Callback Route Handler
 *
 * Exchanges the temporary authorization code received from the OAuth provider
 * (Google / GitHub) for a persistent Supabase session, writing secure cookies
 * to the response.
 *
 * @param request - Incoming NextRequest containing OAuth code or error query parameters.
 * @returns Redirect response to dashboard on success, or login with error parameters on failure.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const oauthErrorCode = searchParams.get("error_code");
  const oauthErrorDesc = searchParams.get("error_description");

  // Determine base URL safely for redirects
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const redirectBase =
    !isLocalEnv && forwardedHost
      ? `https://${forwardedHost}`
      : origin;

  // Handle incoming OAuth provider or Supabase error
  if (oauthError || oauthErrorDesc) {
    console.error("[OAuth Callback Diagnostics] Provider returned error:", {
      pathname: "/auth/callback",
      hasCode: Boolean(code),
      errorCode: oauthErrorCode || oauthError || "unknown_error",
      errorDescription: oauthErrorDesc || "No description provided",
    });

    const next = searchParams.get("next") || "/";
    const safeNext = next.startsWith("/") ? next : "/";
    const targetPath = safeNext.startsWith("/profile") ? "/profile" : "/login";
    const redirectUrl = new URL(`${redirectBase}${targetPath}`);

    if (oauthErrorDesc?.includes("Multiple accounts with the same email")) {
      redirectUrl.searchParams.set("error", "email_conflict");
    } else {
      redirectUrl.searchParams.set("error", oauthError || "oauth");
    }
    if (oauthErrorCode) redirectUrl.searchParams.set("error_code", oauthErrorCode);
    if (oauthErrorDesc) redirectUrl.searchParams.set("error_description", oauthErrorDesc);

    return NextResponse.redirect(redirectUrl.toString());
  }

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("[OAuth Callback Diagnostics] Supabase URL or Anon Key is missing.");
      return NextResponse.redirect(`${redirectBase}/login?error=oauth&error_description=Missing+Supabase+configuration`);
    }

    const next = searchParams.get("next") || "/";
    const safeNext = next.startsWith("/") ? next : "/";
    const response = NextResponse.redirect(`${redirectBase}${safeNext}`);

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        /**
         * Reads all request cookies for OAuth code exchange.
         *
         * @returns Array of cookie key-value objects.
         */
        getAll() {
          return request.cookies.getAll();
        },
        /**
         * Sets persistent session cookies onto the redirect response.
         *
         * @param cookiesToSet - Collection of cookies to persist.
         */
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }

    console.error("[OAuth Callback Diagnostics] Code exchange failed:", {
      pathname: "/auth/callback",
      hasCode: true,
      errorCode: error.name || "code_exchange_failed",
      errorDescription: error.message,
      status: error.status,
    });

    const targetPath = safeNext.startsWith("/profile") ? "/profile" : "/login";
    const redirectUrl = new URL(`${redirectBase}${targetPath}`);
    redirectUrl.searchParams.set("error", "code_exchange_failed");
    redirectUrl.searchParams.set("error_description", error.message);
    if (error.status) redirectUrl.searchParams.set("error_code", String(error.status));

    return NextResponse.redirect(redirectUrl.toString());
  }

  // Safe fallback when neither code nor error parameter was passed
  console.warn("[OAuth Callback Diagnostics] Missing authorization code in callback URL:", {
    pathname: "/auth/callback",
    hasCode: false,
  });

  return NextResponse.redirect(`${redirectBase}/login?error=missing_code&error_description=No+authorization+code+received`);
}
