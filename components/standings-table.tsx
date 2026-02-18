"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Team } from "@/lib/types"

export function StandingsTable() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTeams()
  }, [])

  async function fetchTeams() {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("pontos", { ascending: false })

    if (!error && data) {
      setTeams(data)
    }

    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)

    await supabase
      .from("teams")
      .upsert(teams)

    setSaving(false)
    alert("Salvo no banco com sucesso!")
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Tabela do Campeonato
      </h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Time</th>
            <th>Pts</th>
            <th>V</th>
            <th>E</th>
            <th>D</th>
            <th>GM</th>
            <th>GS</th>
          </tr>
        </thead>

        <tbody>
          {teams.map((t) => (
            <tr key={t.id} className="text-center border-t">
              <td>{t.name}</td>
              <td>{t.pontos}</td>
              <td>{t.vitorias}</td>
              <td>{t.empates}</td>
              <td>{t.derrotas}</td>
              <td>{t.golsMarcados}</td>
              <td>{t.golsSofridos}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {saving ? "Salvando..." : "Salvar alterações"}
      </button>
    </div>
  )
}
