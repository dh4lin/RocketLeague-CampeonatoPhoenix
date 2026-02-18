import { supabase } from "./supabase"

export async function getTeams() {
  const { data } = await supabase
    .from("teams")
    .select("*")

  return data || []
}
