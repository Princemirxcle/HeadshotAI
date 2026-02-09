import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// CONFIGURATION: CONNECT YOUR SUPABASE DATABASE
// Override via .env: SUPABASE_URL and SUPABASE_ANON_KEY
// ------------------------------------------------------------------

const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://hulfsltvyvagzjpevwwu.supabase.co';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bGZzbHR2eXZhZ3pqcGV2d3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDgyMTAsImV4cCI6MjA3OTcyNDIxMH0.TdeYzIcws8gEhq3PE491G7KxputV7BEODNqHKEIrlDE';

// ------------------------------------------------------------------

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Checks if the user has replaced the placeholders with real keys
export const isSupabaseConfigured = () => {
    // Returns true if the URL looks like a valid Supabase URL and isn't the generic placeholder
    return supabaseUrl.startsWith('https://') &&
           !supabaseUrl.includes('YOUR_SUPABASE_PROJECT_URL');
};
