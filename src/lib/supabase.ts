import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Defensive check: If env vars are missing, we create a dummy client that throws specific errors or logs warnings
// rather than crashing the entire app initialization.
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder-project.supabase.co', 'placeholder-key'); 

// Note: If the user didn't set the env vars in Vercel, calls to supabase will fail with 401/404,
// but at least the app renders.
if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.error('⚠️ CRITICAL: VITE_SUPABASE_URL is missing or invalid in environment variables.');
}
