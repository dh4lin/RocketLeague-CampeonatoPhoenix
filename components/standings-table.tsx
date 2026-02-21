"use client"

import { useCallback, useState } from "react"
import type { Team } from "@/lib/types"
import { initialTeams } from "@/lib/initial-data"
import { useAdmin } from "@/lib/admin-context"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { EditableCell } from "./editable-cell"
import { TeamPhoto } from "./team-photo"
import { PasswordDialog } from "./password-dialog"
import {
  Plus,
  Trash2,
  ArrowUpDown,
  Trophy,
  RotateCcw,
  Lock,
  Unlock,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "placar-standings"

interface StoredData {
  teams: Team[]
  title: string
  season: string
  sortEnabled: boolean
}

const defaultData: StoredData = {
  teams: initialTeams,
  title: "Torneio Phoenix de Rocket League",
  season: "EDIÇÃO TWITCH TV",
  sortEnabled: true,
}

function calcSaldoGols(team: Team) {
  return team.golsMarcados - team.golsSofridos
}

function calcPontos(team: Team) {
  return team.vitorias * 6 + team.empates
}

function sortTeams(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => {
    const ptsA = calcPontos(a)
    const ptsB = calcPontos(b)
    if (ptsB !== ptsA) return ptsB - ptsA

    const sgA = calcSaldoGols(a)
    const sgB = calcSaldoGols(b)
    if (sgB !== sgA) return sgB - sgA

    if (b.golsMarcados !== a.golsMarcados) return b.golsMarcados - a.golsMarcados

    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias

    return a.name.localeCompare(b.name)
  })
}

export function StandingsTable() {
  const { isAdmin, logout } = useAdmin()
  const [data, setData, isHydrated] = useLocalStorage<StoredData>(
    STORAGE_KEY,
    defaultData
  )
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  const { teams, title, season, sortEnabled } = data

  const sortedTeams = sortEnabled ? sortTeams(teams) : teams

  const updateData = useCallback(
    (partial: Partial<StoredData>) => {
      setData((prev) => ({ ...prev, ...partial }))
    },
    [setData]
  )

  const updateTeam = useCallback(
    (id: string, field: keyof Team, value: string | number | null) => {
      setData((prev) => ({
        ...prev,
        teams: prev.teams.map((t) =>
          t.id === id ? { ...t, [field]: value } : t
        ),
      }))
    },
    [setData]
  )

  const addTeam = useCallback(() => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name: "Novo Participante",
      photo: null,
      rodadas: 0,
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      golsMarcados: 0,
      golsSofridos: 0,
    }
    setData((prev) => ({ ...prev, teams: [...prev.teams, newTeam] }))
  }, [setData])

  const removeTeam = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        teams: prev.teams.filter((t) => t.id !== id),
      }))
    },
    [setData]
  )

  const resetAll = useCallback(() => {
    setData(defaultData)
  }, [setData])

  const handleSave = useCallback(() => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [])

  const columns = [
    { key: "pos", label: "Pos", tooltip: "Posicao" },
    { key: "photo", label: "", tooltip: "Foto" },
    { key: "name", label: "PART", tooltip: "Nome do participante" },
    { key: "rodadas", label: "R", tooltip: "Rodadas" },
    { key: "vitorias", label: "V", tooltip: "Vitorias" },
    { key: "empates", label: "E", tooltip: "Empates" },
    { key: "derrotas", label: "D", tooltip: "Derrotas" },
    { key: "golsMarcados", label: "GM", tooltip: "Gols Marcados" },
    { key: "golsSofridos", label: "GS", tooltip: "Gols Sofridos" },
    { key: "sg", label: "SG", tooltip: "Saldo de Gols" },
    { key: "pts", label: "Pts", tooltip: "Pontos" },
  ]

  // Show a subtle loading state while hydrating from localStorage
  if (!isHydrated) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-3">
          <Trophy className="h-7 w-7 text-primary" />
          {isAdmin ? (
            <input
              type="text"
              value={title}
              onChange={(e) => updateData({ title: e.target.value })}
              className="bg-transparent text-center text-3xl font-bold tracking-tight text-foreground outline-none focus:ring-1 focus:ring-primary/30 focus:rounded-md focus:px-2 sm:text-4xl"
              aria-label="Titulo do campeonato"
            />
          ) : (
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              {title}
            </h1>
          )}
          <Trophy className="h-7 w-7 text-primary" />
        </div>
        {isAdmin ? (
          <input
            type="text"
            value={season}
            onChange={(e) => updateData({ season: e.target.value })}
            className="bg-transparent text-center text-sm tracking-widest text-muted-foreground uppercase outline-none focus:ring-1 focus:ring-primary/30 focus:rounded-md focus:px-2"
            aria-label="Temporada"
          />
        ) : (
          <p className="text-sm tracking-widest text-muted-foreground uppercase">
            {season}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <Button
                onClick={addTeam}
                size="sm"
                className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Adicionar Participante
              </Button>
              <Button
                onClick={resetAll}
                size="sm"
                variant="outline"
                className="gap-1.5 border-border text-foreground hover:bg-secondary"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Resetar
              </Button>
              <Button
                onClick={handleSave}
                size="sm"
                variant="outline"
                className={`gap-1.5 border-border transition-colors ${
                  saved
                    ? "text-primary border-primary/40 bg-primary/5"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <Save className="h-3.5 w-3.5" />
                {saved ? "Salvo!" : "Dados salvos automaticamente"}
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Modo visualização</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              onClick={() => updateData({ sortEnabled: !sortEnabled })}
              size="sm"
              variant="outline"
              className={`gap-1.5 border-border hover:bg-secondary ${
                sortEnabled
                  ? "text-primary border-primary/40"
                  : "text-muted-foreground"
              }`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              {sortEnabled ? "Ordem automatica" : "Ordem manual"}
            </Button>
          )}
          {isAdmin ? (
            <Button
              onClick={logout}
              size="sm"
              variant="outline"
              className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <Unlock className="h-3.5 w-3.5" />
              Sair
            </Button>
          ) : (
            <Button
              onClick={() => setPasswordDialogOpen(true)}
              size="sm"
              variant="outline"
              className="gap-1.5 border-border text-foreground hover:bg-secondary"
            >
              <Lock className="h-3.5 w-3.5" />
              Admin
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-xl shadow-background/50">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-2 py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase ${
                    col.key === "name" ? "text-left pl-3" : "text-center"
                  } ${col.key === "pts" ? "text-primary" : ""}`}
                  title={col.tooltip}
                >
                  {col.label}
                </th>
              ))}
              {isAdmin && <th className="w-10 px-2 py-3" />}
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => {
              const pts = calcPontos(team)
              const sg = calcSaldoGols(team)
              const position = index + 1

              return (
                <tr
                  key={team.id}
                  className={`group border-b border-border/50 transition-colors hover:bg-secondary/30 ${
                    position <= 3 ? "border-l-2 border-l-primary" : ""
                  } ${position === 1 ? "bg-primary/5" : ""}`}
                >
                  {/* Position */}
                  <td className="px-2 py-2.5 text-center">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        position === 1
                          ? "bg-primary text-primary-foreground"
                          : position <= 3
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {position}
                    </span>
                  </td>

                  {/* Photo */}
                  <td className="px-2 py-2.5">
                    {isAdmin ? (
                      <TeamPhoto
                        photo={team.photo}
                        teamName={team.name}
                        onPhotoChange={(url) =>
                          updateTeam(team.id, "photo", url)
                        }
                      />
                    ) : (
                      <div className="flex items-center justify-center">
                        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary">
                          {team.photo ? (
                            <img
                              src={team.photo}
                              alt={team.name}
                              className="h-full w-full object-cover"
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground">
                              {team.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Name */}
                  <td className="px-2 py-2.5 pl-3 text-left">
                    {isAdmin ? (
                      <EditableCell
                        value={team.name}
                        onChange={(v) => updateTeam(team.id, "name", v)}
                        type="text"
                        className={`text-left font-semibold ${
                          position === 1
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                        minWidth="6rem"
                      />
                    ) : (
                      <span
                        className={`font-semibold ${
                          position === 1
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {team.name}
                      </span>
                    )}
                  </td>

                  {/* R */}
                  <td className="px-2 py-2.5 text-center">
                    {isAdmin ? (
                      <EditableCell
                        value={team.rodadas}
                        onChange={(v) => updateTeam(team.id, "rodadas", v)}
                        type="number"
                      />
                    ) : (
                      <span className="font-mono text-sm text-foreground">
                        {team.rodadas}
                      </span>
                    )}
                  </td>

                  {/* V */}
                  <td className="px-2 py-2.5 text-center">
                    {isAdmin ? (
                      <EditableCell
                        value={team.vitorias}
                        onChange={(v) => updateTeam(team.id, "vitorias", v)}
                        type="number"
                        className="text-success"
                      />
                    ) : (
                      <span className="font-mono text-sm text-success">
                        {team.vitorias}
                      </span>
                    )}
                  </td>

                  {/* E */}
                  <td className="px-2 py-2.5 text-center">
                    {isAdmin ? (
                      <EditableCell
                        value={team.empates}
                        onChange={(v) => updateTeam(team.id, "empates", v)}
                        type="number"
                        className="text-warning"
                      />
                    ) : (
                      <span className="font-mono text-sm text-warning">
                        {team.empates}
                      </span>
                    )}
                  </td>

                  {/* D */}
                  <td className="px-2 py-2.5 text-center">
                    {isAdmin ? (
                      <EditableCell
                        value={team.derrotas}
                        onChange={(v) => updateTeam(team.id, "derrotas", v)}
                        type="number"
                        className="text-destructive"
                      />
                    ) : (
                      <span className="font-mono text-sm text-destructive">
                        {team.derrotas}
                      </span>
                    )}
                  </td>

                  {/* GM */}
                  <td className="px-2 py-2.5 text-center">
                    {isAdmin ? (
                      <EditableCell
                        value={team.golsMarcados}
                        onChange={(v) =>
                          updateTeam(team.id, "golsMarcados", v)
                        }
                        type="number"
                      />
                    ) : (
                      <span className="font-mono text-sm text-foreground">
                        {team.golsMarcados}
                      </span>
                    )}
                  </td>

                  {/* GS */}
                  <td className="px-2 py-2.5 text-center">
                    {isAdmin ? (
                      <EditableCell
                        value={team.golsSofridos}
                        onChange={(v) =>
                          updateTeam(team.id, "golsSofridos", v)
                        }
                        type="number"
                      />
                    ) : (
                      <span className="font-mono text-sm text-foreground">
                        {team.golsSofridos}
                      </span>
                    )}
                  </td>

                  {/* SG - calculated */}
                  <td className="px-2 py-2.5 text-center">
                    <span
                      className={`font-mono text-sm font-semibold ${
                        sg > 0
                          ? "text-success"
                          : sg < 0
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {sg > 0 ? `+${sg}` : sg}
                    </span>
                  </td>

                  {/* Pts - calculated */}
                  <td className="px-2 py-2.5 text-center">
                    <span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-md bg-primary/15 px-2 font-mono text-sm font-bold text-primary">
                      {pts}
                    </span>
                  </td>

                  {/* Actions - Admin only */}
                  {isAdmin && (
                    <td className="px-2 py-2.5 text-center">
                      <button
                        onClick={() => removeTeam(team.id)}
                        className="rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 focus:opacity-100 focus:outline-none"
                        title="Remover participante"
                        aria-label={`Remover ${team.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>

        {sortedTeams.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Trophy className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm">Nenhum participante adicionado</p>
            {isAdmin && (
              <Button
                onClick={addTeam}
                size="sm"
                variant="outline"
                className="mt-3 gap-1.5 border-border text-foreground hover:bg-secondary"
              >
                <Plus className="h-4 w-4" />
                Adicionar Participante
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-primary/30" />
          <span>{"Classificação (Top 3)"}</span>
        </div>
        <span className="text-border">{"| "}</span>
        <span>
          <strong className="text-foreground">Pos</strong> Posicao
        </span>
        <span>
          <strong className="text-foreground">PART.</strong> Participantes
        </span>
        <span>
          <strong className="text-foreground">R</strong> Rodadas
        </span>
        <span>
          <strong className="text-foreground">V</strong> Vitorias
        </span>
        <span>
          <strong className="text-foreground">E</strong> Empates
        </span>
        <span>
          <strong className="text-foreground">D</strong> Derrotas
        </span>
        <span>
          <strong className="text-foreground">GM</strong> Gols Marcados
        </span>
        <span>
          <strong className="text-foreground">GS</strong> Gols Sofridos
        </span>
        <span>
          <strong className="text-foreground">SG</strong> Saldo de Gols
        </span>
        <span>
          <strong className="text-foreground">Pts</strong> Pontos
        </span>
      </div>

      {isAdmin ? (
        <p className="mt-3 text-center text-xs text-muted-foreground/60">
          Modo admin ativo - clique em qualquer valor para editar - dados salvos
          automaticamente
        </p>
      ) : (
        <p className="mt-3 text-center text-xs text-muted-foreground/60">
          {"Clique em \"Admin\" para habilitar a edicao"}
        </p>
      )}

      {/* Password Dialog */}
      <PasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
      />
    </div>
  )
}
