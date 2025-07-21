import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { TournamentWithWinner } from '@/lib/type'
import { MatchWithDetails } from './type'

// This is a placeholder for your actual Supabase client.
// You would typically initialize this in a separate file (e.g., 'lib/supabase.ts')
// and import it here.

// ============================================================================
// 1. TYPE DEFINITIONS 
// ============================================================================

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
  max_game_set : number
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
export interface MatchWithScoresAndDetails extends MatchWithDetails {
  match_scores: MatchScore[]
}

// Represents a full tournament with its winner and all matches/scores
export interface TournamentWithDetails extends TournamentWithWinner {
  matches: MatchWithScoresAndDetails[]
}

// ============================================================================
// 2. STORE STATE AND ACTIONS
// ============================================================================

export interface BadmintonState {
  // --- STATE ---
  players: Player[]
  teams: Team[]
  tournaments: TournamentWithWinner[]
  activeTournamentParticipants: TournamentParticipant[]
  activeTeams: Team[]
  activeTournamentId: string | null
  matches: Match[]
  matchScores: MatchScore[]
  loading: boolean
  error: string | null
  currentPage: number
  totalTournaments: number
  activeTournament: TournamentWithDetails | null // NEW: To hold details of a single tournament

  // --- ACTIONS ---

  // Player Actions
  fetchPlayers: () => Promise<void>
  addPlayer: (name: string, imageUrl?: string) => Promise<Player | null>

  // Team Actions
  fetchTeams: () => Promise<void>
  addTeam: (player1Id: string, player2Id: string | null) => Promise<Team | null>
  getOrCreateTeam: (
    player1Id: string,
    player2Id: string | null
  ) => Promise<Team | null>

  // Tournament Actions
  fetchTournaments: (page: number) => Promise<void>
  fetchTournamentsParticipants: (tournament_id: string) => Promise<void>
  addTournament: (
    details: Omit<Tournament, 'id' | 'created_at' | 'winner_team_id'>
  ) => Promise<Tournament | null>
  addTeamToTournament: (tournamentId: string, teamId: string) => Promise<void>
  setTournamentWinner: (
    tournamentId: string,
    winnerTeamId: string
  ) => Promise<void>

  // Match Actions
  fetchMatchesForTournament: (tournamentId: string) => Promise<void>
  addMatch: (
    matchData: Omit<
      Match,
      'id' | 'created_at' | 'match_date' | 'winner_team_id'
    >
  ) => Promise<Match | null>
  updateMatch: (matchId: string, updates: Partial<Match>) => Promise<void>

  finishMatch: (
    matchId: string,
    winnerTeamId: string,
    scores: Omit<MatchScore, 'id' | 'match_id'>[]
  ) => Promise<void>
  fetchTeamsFromCurrentTournament: () => Promise<void>
  fetchTournamentDetails: (tournamentId: string) => Promise<void> // NEW action

  setActiveTeams: (active: Team[]) => Promise<void>
  fetchMatch: () => Promise<void>
  fetchMatchScore: () => Promise<void>
}

// ============================================================================
// 3. ZUSTAND STORE IMPLEMENTATION
// ============================================================================
export const PAGE_SIZE = 10; // We want to load 10 tournaments at a time

export const useBadmintonStore = create<BadmintonState>((set, get) => ({
  // --- INITIAL STATE ---
  players: [],
  teams: [],
  tournaments: [],
  activeTournamentParticipants: [],
  activeTournamentId: null,
  activeTournament: null, // NEW

  activeTeams: [],
  matches: [],
  matchScores: [],
  loading: false,
  error: null,
  currentPage: 0,
  totalTournaments: 0,

  // --- PLAYER ACTIONS ---
  setActiveTeams: async (active: Team[]) => {
    set(() => ({ activeTeams: active }))
  },
  fetchPlayers: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.from('players').select('*')
      if (error) throw error
      set({ players: data || [] })
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      }
    } finally {
      set({ loading: false })
    }
  },

  addPlayer: async (name, image_url) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('players')
        .insert([{ name, image_url }])
        .select()
        .single()
      if (error) throw error
      if (data) {
        set((state) => ({ players: [...state.players, data] }))
        return data
      }
      return null
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      }return null
    } finally {
      set({ loading: false })
    }
  },

  // --- TEAM ACTIONS ---
  fetchTeams: async () => {
    set({ loading: true, error: null })
    try {
      const selectQuery = `
        *,
        player_1:players!teams_player_1_id_fkey(*),
        player_2:players!teams_player_2_id_fkey(*)
        
      `
      const { data, error } = await supabase.from('teams').select(selectQuery)
      if (error) throw error
      set({ teams: data || [] })
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      }
    } finally {
      set({ loading: false })
    }
  },
  addTeam: async (player_1_id, player_2_id) => {
    console.log('🚀 ~ addTeam: ~ player_2_id:', player_2_id)
    console.log('🚀 ~ addTeam: ~ player_1_id:', player_1_id)
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{ player_1_id, player_2_id }])
        .select()
        .single()
      if (error) throw error
      if (data) {
        set((state) => ({ teams: [...state.teams, data] }))
        return data
      }
      return null
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      } return null
    } finally {
      set({ loading: false })
    }
  },

  // --- TOURNAMENT ACTIONS ---
  fetchTournaments: async (page: number) => {
    set({ loading: true, error: null })
    const selectQuery = `
    *,
    winner_team:teams!tournaments_winner_team_id_fkey2 (
      *,
      player_1:players!teams_player_1_id_fkey(*),
      player_2:players!teams_player_2_id_fkey(*)
    )
  `
    try {
      const from = page * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const { data, error, count } = await supabase
        .from('tournaments')
        .select(selectQuery, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)
      if (error) throw error
      set({
        tournaments: data || [],
        totalTournaments: count || 0,
        currentPage: page,
      })
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      } 
    } finally {
      set({ loading: false })
    }
  },
  fetchTournamentDetails: async (tournamentId: string) => {
    set({ loading: true, error: null, activeTournament: null })

    const selectQuery = `
      *,
      winner_team:teams!tournaments_winner_team_id_fkey2(*, player_1:players!teams_player_1_id_fkey(*), player_2:players!teams_player_2_id_fkey(*)),
      matches (
        *,
        match_scores (*),
        team_1:teams!matches_team_1_id_fkey (*, player_1:players!teams_player_1_id_fkey(*), player_2:players!teams_player_2_id_fkey(*)),
        team_2:teams!matches_team_2_id_fkey (*, player_1:players!teams_player_1_id_fkey(*), player_2:players!teams_player_2_id_fkey(*))
      )
    `

    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select(selectQuery)
        .eq('id', tournamentId)
        .single()

      if (error) throw error

      set({ activeTournament: data as TournamentWithDetails | null })
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      }
    } finally {
      set({ loading: false })
    }
  },
  fetchTournamentsParticipants: async (tournament_id) => {
    set({ loading: true, error: null })
    try {
      const selectQuery = `
        *,
        team:teams (
          *,
          player_1:players!teams_player_1_id_fkey(*),
          player_2:players!teams_player_2_id_fkey(*)
        )
      `
      const { data, error } = await supabase
        .from('tournament_participants')
        .select(selectQuery)
        .eq('tournament_id', tournament_id)

      if (error) throw error

      // The type of `data` now matches `DetailedTournamentParticipant[]`
      set({ activeTournamentParticipants: data || [] })
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      }
    } finally {
      set({ loading: false })
    }
  },

  addTournament: async (details) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .insert([details])
        .select()
        .single()
      if (error) throw error
      if (data) {
        set((state) => ({
          tournaments: [...state.tournaments, data],
          activeTournamentId: data.id,
        }))
        return data
      }
      return null
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      }return null
    } finally {
      set({ loading: false })
    }
  },

  addTeamToTournament: async (tournament_id, team_id) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('tournament_participants')
        .upsert(
          { tournament_id, team_id },
          { onConflict: 'tournament_id,team_id', ignoreDuplicates: true }
        )
      // .select()
      // .single()
      if (error) throw error
      const newParticipant = { tournament_id, team_id }
      set((state) => {
        // Also, check if the participant is already in the local state to avoid duplicates there too.
        const alreadyExists = state.activeTournamentParticipants.some(
          (p) => p.team_id === team_id && p.tournament_id === tournament_id
        )

        if (alreadyExists) {
          return {} // Do nothing if it's already in the local state
        }

        return {
          activeTournamentParticipants: [
            ...state.activeTournamentParticipants,
            newParticipant,
          ],
        }
      })
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      }
    } finally {
      set({ loading: false })
    }
  },
  setTournamentWinner: async (tournamentId, winnerTeamId) => {
    set({ loading: true, error: null })
    try {
      // Step 1: Update the tournament record in the Supabase database
      const { data, error } = await supabase
        .from('tournaments')
        .update({ winner_team_id: winnerTeamId })
        .eq('id', tournamentId)
        .select() // Select the updated record to get it back
        .single()

      if (error) throw error

      // Step 2: Update the local state in Zustand
      // This ensures the UI updates immediately without needing a re-fetch.
      if (data) {
        set((state) => ({
          tournaments: state.tournaments.map((t) =>
            t.id === tournamentId ? data : t
          ),
        }))
      }

      console.log(
        `Tournament ${tournamentId} winner has been set to ${winnerTeamId}`
      )
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      }
    } finally {
      set({ loading: false })
    }
  },

  // --- MATCH ACTIONS ---
  fetchMatchesForTournament: async (tournamentId) => {
    set({ loading: true, error: null })
    try {
      const selectQuery = `
        *,
        team_1:teams!matches_team_1_id_fkey (
          *,
          player_1:players!teams_player_1_id_fkey(*),
          player_2:players!teams_player_2_id_fkey(*)
        ),
        team_2:teams!matches_team_2_id_fkey (
          *,
          player_1:players!teams_player_1_id_fkey(*),
          player_2:players!teams_player_2_id_fkey(*)
        )
      `
      const { data, error } = await supabase
        .from('matches')
        .select(selectQuery)
        .eq('tournament_id', tournamentId)
        .order('created_at', { ascending: true })

      if (error) throw error
      set({ matches: data || [] })
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      }
    } finally {
      set({ loading: false })
    }
  },

  addMatch: async (matchData) => {
    set({ loading: true, error: null })
    try {
      // Step 1: Insert the new match. This returns a "flat" object without nested details.
      const { data: newFlatMatch, error: insertError } = await supabase
        .from('matches')
        .insert([matchData])
        .select('id') // We only need the ID of the new match
        .single()

      if (insertError) throw insertError
      if (!newFlatMatch) return null

      // Step 2: Now, re-fetch the match we just created, but use the full nested query
      // to get all the team and player details.
      const selectQuery = `
          *,
          team_1:teams!matches_team_1_id_fkey (
            *,
            player_1:players!teams_player_1_id_fkey(*),
            player_2:players!teams_player_2_id_fkey(*)
          ),
          team_2:teams!matches_team_2_id_fkey (
            *,
            player_1:players!teams_player_1_id_fkey(*),
            player_2:players!teams_player_2_id_fkey(*)
          )
        `

      const { data: newDetailedMatch, error: fetchError } = await supabase
        .from('matches')
        .select(selectQuery)
        .eq('id', newFlatMatch.id)
        .single()

      if (fetchError) throw fetchError

      // Step 3: Add the fully detailed match object to our local state.
      // This ensures the UI always has the rich data it needs.
      if (newDetailedMatch) {
        set((state) => ({
          matches: [...state.matches, newDetailedMatch],
        }))
      }

      return newDetailedMatch
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      }return null
    } finally {
      set({ loading: false })
    }
  },
  updateMatch: async (matchId, updates) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('matches')
        .update(updates)
        .eq('id', matchId)

      if (error) throw error

      // Refresh the matches in the state to reflect the update
      get().fetchMatchesForTournament(get().activeTournamentId!)
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      }
    } finally {
      set({ loading: false })
    }
  },
  finishMatch: async (matchId, winnerTeamId, scores) => {
    set({ loading: true, error: null })
    try {
      // Step 1: Update the match winner
      const { error: matchError } = await supabase
        .from('matches')
        .update({ winner_team_id: winnerTeamId })
        .eq('id', matchId)

      if (matchError) throw matchError

      // Step 2: Add the scores for each game
      const scoresToInsert = scores.map((score) => ({
        ...score,
        match_id: matchId,
      }))
      const { data: insertedScores, error: scoresError } = await supabase
        .from('match_scores')
        .insert(scoresToInsert)
        .select()
      if (scoresError) throw scoresError

      // Step 3: Update local state
      set((state) => ({
        matches: state.matches.map((m) =>
          m.id === matchId ? { ...m, winner_team_id: winnerTeamId } : m
        ),
        matchScores: [
          ...state.matchScores.filter((s) => s.match_id !== matchId),
          ...(insertedScores || []),
        ],
      }))
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      }
    } finally {
      set({ loading: false })
    }
  },
  fetchMatchScore: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.from('match_scores').select(`*`)
      if (error) throw error
      set({
        matchScores: data || [],
      })
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      }
    } finally {
      set({ loading: false })
    }
  },
  fetchMatch: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.from('matches').select(`*`)
      if (error) throw error
      set({
        matches: data || [],
      })
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      }
    } finally {
      set({ loading: false })
    }
  },
  fetchTeamsFromCurrentTournament: async () => {
    const { activeTournamentId, teams } = get() // Get other actions and state
    console.log('🚀 ~ fetchTeamsFromCurrentTournament: ~ teams:', teams)
    if (activeTournamentId) {
      set({ loading: true, error: null })
      try {
        const { error, data } = await supabase
          .from('tournament_participants')
          .select('*')
          .eq('tournament_id', activeTournamentId)

        if (error) throw error
        console.log('🚀 ~ fetchTeamsFromCurrentTournament: ~ data:', data)
        const participatingTeamIds = data.map((p) => p.team_id)
        console.log(
          '🚀 ~ fetchTeamsFromCurrentTournament: ~ participatingTeamIds:',
          participatingTeamIds
        )

        const finalteam = teams.filter((team) =>
          participatingTeamIds.includes(team.id)
        )
        console.log(
          '🚀 ~ fetchTeamsFromCurrentTournament: ~ finalteam:',
          finalteam
        )
        // set((state) => ({
        //   activeTournamentParticipants: [
        //     ...state.activeTournamentParticipants,
        //     ...finalteam,
        //   ],
        // }))
      } catch (error: unknown) {
        // First, check if the error is an actual Error object
        if (error instanceof Error) {
          // If it is, we can safely access its message property
          set({ error: error.message })
        } else {
          // If it's something else (like a string), convert it to a string
          set({ error: String(error) })
        }
      } finally {
        set({ loading: false })
      }
    } else if (!activeTournamentId) {
      console.warn(
        'Team was created, but no tournament is active, so it was not registered.'
      )
    }
  },
  getOrCreateTeam: async (player1Id: string, player2Id: string | null) => {
    set({ loading: true, error: null })
    try {
      let queryBuilder = supabase.from('teams').select('*')

      // For a singles team, chain .eq() and .is() for a precise 'AND' condition.
      // This is the fix for the "invalid input syntax" error.
      if (!player2Id) {
        // console.log(`Searching for SINGLE player team: ${player1Id}`)
        queryBuilder = queryBuilder
          .eq('player_1_id', player1Id)
          .is('player_2_id', null)
      } else {
        // For a doubles team, the .or() logic is correct as it combines two possibilities.
        // console.log(
        //   `Searching for DOUBLE player team: ${player1Id}, ${player2Id}`
        // )
        const filter1 = `and(player_1_id.eq.${player1Id},player_2_id.eq.${player2Id})`
        const filter2 = `and(player_1_id.eq.${player2Id},player_2_id.eq.${player1Id})`
        queryBuilder = queryBuilder.or(`${filter1},${filter2}`)
      }

      const { data: existingTeam, error: findError } = await queryBuilder
        .limit(1)
        .single()

      if (findError && findError.code !== 'PGRST116') {
        // PGRST116 means "not found", which is ok
        throw findError
      }
      // If team already exists, return it.
      //   console.log('Found existing team:', existingTeam)
      if (existingTeam) {
        return existingTeam
      }

      // If team does not exist, create it by calling addTeam.
      //   console.log('No existing team found, creating a new one...')
      return get().addTeam(player1Id, player2Id)
    } catch (error: unknown) {
      // First, check if the error is an actual Error object
      if (error instanceof Error) {
        // If it is, we can safely access its message property
        set({ error: error.message })
      } else {
        // If it's something else (like a string), convert it to a string
        set({ error: String(error) })
      }return null
    } finally {
      set({ loading: false })
    }
  },
}))
