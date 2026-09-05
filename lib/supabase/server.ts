/**
 * Server-side Supabase Client Factory
 *
 * Configures server components and route handlers to access Supabase
 * using cookies forwarded from the client request.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Creates a server-side Supabase client instance with request cookie access.
 *
 * @param cookieStore - Awaited Next.js cookies() store.
 * @returns Configured Supabase server client.
 */
export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        /**
         * Retrieves all available cookies from the incoming server request.
         *
         * @returns Array of cookie key-value pairs.
         */
        getAll() {
          return cookieStore.getAll();
        },
        /**
         * Sets updated authentication cookies onto the server response.
         *
         * @param cookiesToSet - Collection of cookies to persist.
         */
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
};
