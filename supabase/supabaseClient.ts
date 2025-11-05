import pkg from '@supabase/supabase-js';
const { createClient, SupabaseClient } = pkg;

let supabase: SupabaseClient | null = null;

function getSupabase() {
  if (supabase) {
    return supabase;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not set. Using mock implementations.');
    supabase = {
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ select: () => ({ data: null, error: null }) }),
        update: () => ({ eq: () => ({ error: null }) }),
        eq: () => ({ single: () => ({ data: null, error: null }) }),
        or: () => ({ limit: () => ({ data: null, error: null }) }) as any,
        neq: () => ({ order: () => ({ limit: () => ({ data: [], error: null }) }) }) as any,
      })
    } as any;
  } else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabase;
}

export { getSupabase };