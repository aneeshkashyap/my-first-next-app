/**
 * Supabase client and session utilities for client, server, and edge middleware.
 */

export { createClient as createBrowserClient } from "./client";
export { createClient as createServerClient } from "./server";
export { updateSession } from "./middleware";
export { createClient } from "./client";
