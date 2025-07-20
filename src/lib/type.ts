export type TournamentType = 'league' | 'knockout' | 'round-robin'
export type MatchType = 'singles' | 'doubles'

export interface Player {
  id: string
  created_at: string
  name: string
  image_url?: string
  // ... any other player properties
}

export interface Team {
  id: string
  created_at: string
  player_1_id: string
  player_2_id?: string | null
}

// This interface represents a Team object with its players' details nested inside.
export interface TeamWithPlayers extends Team {
  player_1: Player
  player_2: Player | null // Can be null for singles teams
}

// --- Main Interface for the API Response ---

/**
 * Represents the structure of a Tournament object when fetched from Supabase
 * with the winner_team and its players' details included.
 */
export interface TournamentWithWinner {
  id: string
  created_at: string
  name: string
  match_type: MatchType
  tournament_type: TournamentType
  winner_team_id: string | null

  // This property holds the nested object for the winning team.
  // It can be null if there is no winner yet.
  winner_team: TeamWithPlayers | null
}
