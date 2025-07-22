export interface Player {
  id: string
  created_at: string
  name: string
  image_url?: string
}

// Represents a team. For singles, player_2_id will be null.
export interface Team {
  id: string
  player_1_id: string
  player_2_id?: string
  created_at: string
}

export interface Tournament {
  id: string
  name: string
  tournament_type: 'league' | 'knockout' | 'round-robin'
  match_type: 'singles' | 'doubles'
  winner_team_id?: string
  points_per_game: number
  max_game_set: number
  created_at: string
}

// Junction table type
export interface TournamentParticipant {
  tournament_id: string
  team_id: string
}

export interface Match {
  id: string
  tournament_id: string
  team_1_id: string
  team_2_id: string | null
  winner_team_id?: string
  tag?: string // 'Semi-Final', 'Round 1', etc.
  match_date: string
  created_at: string
}

export interface MatchScore {
  id: string
  match_id: string
  game_number: number
  team_1_score: number
  team_2_score: number
}
export type TeamWithPlayers = Team & {
  player_1: Player
  player_2?: Player
}

export type TournamentWithWinner = Tournament & {
  winner_team: TeamWithPlayers | null
}

export type MatchWithDetails = Match & {
  team_1: TeamWithPlayers
  team_2: TeamWithPlayers | null
}

export interface MatchWithScoresAndDetails extends MatchWithDetails {
  match_scores: MatchScore[]
}

// Represents a full tournament with its winner and all matches/scores
export interface TournamentWithDetails extends TournamentWithWinner {
  matches: MatchWithScoresAndDetails[]
}
// ============================================================================
// Data Transfer Objects (DTOs)
// ============================================================================

// For creating a new player
export type CreatePlayerDTO = Pick<Player, 'name' | 'image_url'>

// For creating a new team
export type CreateTeamDTO = Pick<Team, 'player_1_id' | 'player_2_id'>

// For creating a new tournament
export type CreateTournamentDTO = Omit<
  Tournament,
  'id' | 'created_at' | 'winner_team_id'
>

// For creating a new match
export type CreateMatchDTO = Omit<
  Match,
  'id' | 'created_at' | 'match_date' | 'winner_team_id'
>

// For adding scores to a match
export type AddMatchScoreDTO = Omit<MatchScore, 'id'>

// ============================================================================
// Store-specific types
// ============================================================================

// State and actions for the Player store
export interface PlayerState {
  players: Player[]
  loading: boolean
  error: string | null
}

export interface PlayerActions {
  fetchPlayers: () => Promise<void>
  addPlayer: (playerData: CreatePlayerDTO) => Promise<Player | null>
}

// State and actions for the Team store
export interface TeamState {
  teams: TeamWithPlayers[]
  loading: boolean
  error: string | null
}

export interface TeamActions {
  fetchTeams: () => Promise<void>
  addTeam: (teamData: CreateTeamDTO) => Promise<TeamWithPlayers | null>
  getOrCreateTeam: (
    player1Id: string,
    player2Id?: string
  ) => Promise<TeamWithPlayers | null>
}

// State and actions for the Tournament store
export interface TournamentState {
  tournaments: TournamentWithWinner[]
  activeTournamentId: string | null
  activeTournament: TournamentWithDetails | null
  activeTournamentParticipants: (TournamentParticipant & {
    team: TeamWithPlayers
  })[]
  matches: MatchWithDetails[]
  matchScores: MatchScore[]
  loading: boolean
  error: string | null
  currentPage: number
  totalTournaments: number
}

export interface TournamentActions {
  fetchTournaments: (page?: number) => Promise<void>
  fetchTournamentDetails: (tournamentId: string) => Promise<void>
  addTournament: (
    tournamentData: CreateTournamentDTO
  ) => Promise<Tournament | null>
  addTeamToTournament: (tournamentId: string, teamId: string) => Promise<void>
  setTournamentWinner: (
    tournamentId: string,
    winnerTeamId: string
  ) => Promise<void>
  fetchMatchesForTournament: (tournamentId: string) => Promise<void>
  addMatch: (matchData: CreateMatchDTO) => Promise<MatchWithDetails | null>
  updateMatch: (
    matchId: string,
    updates: Partial<Match>
  ) => Promise<MatchWithDetails | null>
  finishMatch: (
    matchId: string,
    winnerTeamId: string,
    scores: AddMatchScoreDTO[]
  ) => Promise<void>
  setActiveTournamentParticipants: (
    active: { tournament_id: string; team_id: string; team: TeamWithPlayers }[]
  ) => Promise<void>
}
