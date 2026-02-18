"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Team = {
  id: string
  name: string
  vitorias: number
  empates: number
  derrotas: number
  golsMarcados: number
  golsSofridos: number
}

export function StandingsTable() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTeams()
  }, [])

  async function fetchTeams() {
    const { data } = await supabase
      .from("teams")
      .select("*")

    if (data) setTeams(data)
    setLoading(false)
  }

  function calcPts(t: Team) {
    return t.vitorias * 3 + t.empates
  }

  function updateValue(
    id: string,
    field: keyof Team,
    value: number
  ) {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      )
    )
  }

  async function handleSave() {
    setSaving(true)

    await supabase
      .from("teams")
      .upsert(teams)

    alert("Salvo com sucesso!")
    setSaving(false)
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

              <td>{calcPts(t)}</td>

              <td>
                <input
                  type="number"
                  value={t.vitorias}
                  onChange={(e) =>
                    updateValue(
                      t.id,
                      "vitorias",
                      Number(e.target.value)
                    )
                  }
                  className="w-16 border"
                />
              </td>

              <td>
                <input
                  type="number"
                  value={t.empates}
                  onChange={(e) =>
                    updateValue(
                      t.id,
                      "empates",
                      Number(e.target.value)
                    )
                  }
                  className="w-16 border"
                />
              </td>

              <td>
                <input
                  type="number"
                  value={t.derrotas}
                  onChange={(e) =>
                    updateValue(
                      t.id,
                      "derrotas",
                      Number(e.target.value)
                    )
                  }
                  className="w-16 border"
                />
              </td>

              <td>
                <input
                  type="number"
                  value={t.golsMarcados}
                  onChange={(e) =>
                    updateValue(
                      t.id,
                      "golsMarcados",
                      Number(e.target.value)
                    )
                  }
                  className="w-16 border"
                />
              </td>

              <td>
                <input
                  type="number"
                  value={t.golsSofridos}
                  onChange={(e) =>
                    updateValue(
                      t.id,
                      "golsSofridos",
                      Number(e.target.value)
                    )
                  }
                  className="w-16 border"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {saving ? "Salvando..." : "Salvar"}
      </button>
    </div>
  )
}
