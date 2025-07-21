// // ============================================================================
// // 1. TYPE DEFINITIONS
// // ============================================================================

// export interface Player {
//   id: string
//   created_at: string
//   name: string
//   image_url?: string
// }

// // Represents a team. For singles, player_2_id will be null.
// export interface Team {
//   id: string
//   player_1_id: string
//   player_2_id?: string
//   created_at: string
// }

// export interface Tournament {
//   id: string
//   name: string
//   tournament_type: 'league' | 'knockout' | 'round-robin'
//   match_type: 'singles' | 'doubles'
//   winner_team_id?: string
//   created_at: string
// }

// // Junction table type
// export interface TournamentParticipant {
//   tournament_id: string
//   team_id: string
// }

// export interface Match {
//   id: string
//   tournament_id: string
//   team_1_id: string
//   team_2_id: string
//   winner_team_id?: string
//   tag?: string // 'Semi-Final', 'Round 1', etc.
//   match_date: string
//   created_at: string
// }
// export type TournamentType = 'league' | 'knockout' | 'round-robin'
// export type MatchType = 'singles' | 'doubles'

// export interface Player {
//   id: string
//   created_at: string
//   name: string
//   image_url?: string
//   // ... any other player properties
// }

// export interface Team {
//   id: string
//   created_at: string
//   player_1_id: string
//   player_2_id?: string | null
// }

// // This interface represents a Team object with its players' details nested inside.
// export interface TeamWithPlayers extends Team {
//   player_1: Player
//   player_2: Player | null // Can be null for singles teams
// }

// // --- Main Interface for the API Response ---

// /**
//  * Represents the structure of a Tournament object when fetched from Supabase
//  * with the winner_team and its players' details included.
//  */
// export interface TournamentWithWinner {
//   id: string
//   created_at: string
//   name: string
//   match_type: MatchType
//   tournament_type: TournamentType
//   winner_team_id: string | null

//   // This property holds the nested object for the winning team.
//   // It can be null if there is no winner yet.
//   winner_team: TeamWithPlayers | null
// }

// export interface MatchScore {
//   id: string
//   match_id: string
//   game_number: number
//   team_1_score: number
//   team_2_score: number
// }
// export interface Player {
//   id: string
//   name: string
//   image_url?: string
// }

// export interface Team {
//   id: string
//   player_1_id: string
//   player_2_id?: string
// }

// export interface TeamWithPlayers extends Team {
//   player_1: Player
//   player_2: Player | null // player_2 is null for singles
// }

// export interface MatchWithDetails {
//   id: string
//   tournament_id: string
//   tag?: string
//   team_1: TeamWithPlayers
//   team_2: TeamWithPlayers
//   // other match fields...
// }

// export interface MatchWithScoresAndDetails extends MatchWithDetails {
//   match_scores: MatchScore[]
// }

// // Represents a full tournament with its winner and all matches/scores
// export interface TournamentWithDetails extends TournamentWithWinner {
//   matches: MatchWithScoresAndDetails[]
// }
// store/types.ts

// ============================================================================
// 1. BASE DATABASE TYPES (Matches the columns in your Supabase tables)
// ============================================================================

export type TournamentType = 'league' | 'knockout' | 'round-robin'
export type MatchType = 'singles' | 'doubles'

export interface Player {
  id: string
  created_at: string
  name: string
  image_url: string
}

export interface Team {
  id: string
  created_at: string
  player_1_id: string
  player_2_id: string | null
}

export interface Tournament {
  id: string
  created_at: string
  name: string
  tournament_type: TournamentType
  match_type: MatchType
  winner_team_id: string | null
  points_per_game: number
  max_game_set: number
}

export interface TournamentParticipant {
  tournament_id: string
  team_id: string
}

export interface Match {
  id: string
  created_at: string
  tournament_id: string
  team_1_id: string
  team_2_id: string | null
  winner_team_id: string | null
  tag: string 
  match_date: string
}

export interface MatchScore {
  id: string
  match_id: string
  game_number: number
  team_1_score: number
  team_2_score: number
}

// ============================================================================
// 2. ENRICHED TYPES (Represents data fetched with foreign key joins)
// ============================================================================

export interface TeamWithPlayers extends Team {
  player_1: Player
  player_2: Player | null
}

export interface MatchWithDetails
  // extends Omit<Match, 'team_1_id' | 'team_2_id'>
{
  id: string
  tournament_id: string
  tag?: string
  team_1: TeamWithPlayers
  team_2: TeamWithPlayers
  winner_team_id: string
}
// export interface MatchWithDetails {
//   id: string
//   tournament_id: string
//   tag?: string
//   team_1: TeamWithPlayers
//   team_2: TeamWithPlayers
//   winner_team_id : string
//   // other match fields...
// }

export interface MatchWithScoresAndDetails extends MatchWithDetails {
  match_scores: MatchScore[]
}

export interface TournamentWithWinner extends Tournament {
  winner_team: TeamWithPlayers | null
}

export interface TournamentWithDetails extends TournamentWithWinner {
  matches: MatchWithScoresAndDetails[]
}

export interface DetailedTournamentParticipant extends TournamentParticipant {
  team: TeamWithPlayers
}
