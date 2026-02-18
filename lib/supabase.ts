import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  "SUA_URL_SUPABASE",
  "SUA_ANON_KEY"
)
