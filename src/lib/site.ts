export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://jinyucapital.com").replace(/\/$/, "");
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
