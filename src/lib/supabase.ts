// src/lib/supabase.ts
// Supabase client configuration for database connections
// Does not include authentication setup or advanced features

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Anon key exists?", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log(
  "Service role key exists?",
  !!process.env.SUPABASE_SERVICE_ROLE_KEY
);
