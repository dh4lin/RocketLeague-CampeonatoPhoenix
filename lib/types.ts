export interface Team {
  id: string
  name: string
  photo: string | null
  rodadas: number
  vitorias: number
  empates: number
  derrotas: number
  golsMarcados: number
  golsSofridos: number
}

export interface StandingsConfig {
  title: string
  season: string
}
