import { createClient } from "@supabase/supabase-js";

// Use environment variables with fallback to hardcoded values
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://yqfzcagahtfruyzdetxw.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxZnpjYWdhaHRmcnV5emRldHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0ODc3ODcsImV4cCI6MjA3NTA2Mzc4N30.ZO5Nn2CT9gTVLhHPVH4mGxb6_WQvMf7PpoXTjG4tkjg";

console.log(
  "Initializing Supabase client with URL:",
  supabaseUrl.substring(0, 15) + "...",
);

// Create Supabase client with simplified and reliable configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      "Content-Type": "application/json",
    },
  },
  db: {
    schema: "public",
  },
});
