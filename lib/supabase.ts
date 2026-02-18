import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  "SUA_URL_SUPABASE",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb2F5YmhqaW1zZGZmbWZod2xxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzODIxMjMsImV4cCI6MjA4Njk1ODEyM30.XOXRCvrKsK6Nd3kB95k5IDsklvzHP-serz8_KfpwrXQ"
)
