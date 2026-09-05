/**
 * Client-side Supabase Browser Client Factory
 *
 * Initializes a Supabase client using browser storage and cookies
 * for client-side components and hooks.
 */

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Creates and returns a client-side Supabase client instance configured with browser cookies.
 *
 * @returns Configured Supabase browser client.
 */
export const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!
  );
