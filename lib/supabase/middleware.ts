/**
 * Supabase Next.js Middleware Session Refresh Helper
 *
 * Keeps active user sessions fresh across incoming requests by exchanging
 * tokens and updating response cookies.
 */

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Refreshes active Supabase authentication sessions and persists updated session cookies to the response.
 *
 * @param request - Incoming Next.js edge request.
 * @returns Modified NextResponse containing updated auth cookies.
 */
export const updateSession = async (request: NextRequest): Promise<NextResponse> => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        /**
         * Reads cookies from the incoming Next.js request.
         *
         * @returns Array of cookie key-value pairs.
         */
        getAll() {
          return request.cookies.getAll();
        },
        /**
         * Sets refreshed cookies onto both the request and the response headers.
         *
         * @param cookiesToSet - Array of updated cookie objects.
         */
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh user session if present
  await supabase.auth.getUser();

  return supabaseResponse;
};
