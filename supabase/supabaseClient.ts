import { createClient, SupabaseClient } from '@supabase/supabase-js';

// For Vercel deployment, use NEXT_PUBLIC_ prefixed variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Using mock implementations.');
  // Create a mock client for the build process
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ select: () => ({ data: null, error: null }) }),
      update: () => ({ eq: () => ({ error: null }) }),
      eq: () => ({ single: () => ({ data: null, error: null }) }),
      or: () => ({ limit: () => ({ data: null, error: null }) }),
      neq: () => ({ order: () => ({ limit: () => ({ data: [], error: null }) }) }),
    })
  } as any;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };