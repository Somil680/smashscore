// ============================================================================
// 2. STORE STATE AND ACTIONS
// ============================================================================
import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import {
  Tournament,
  TournamentParticipant,
  TournamentWithDetails,
  TournamentWithWinner,
} from './type'

export interface BadmintonState {
  // --- STATE ---
  tournaments: TournamentWithWinner[]
  activeTournamentParticipants: TournamentParticipant[]
  activeTournament: TournamentWithDetails | null // NEW: To hold details of a single tournament
  activeTournamentId: string | null
  loading: boolean
  error: string | null
  currentPage: number
  totalTournaments: number

  // --- ACTIONS ---

  // Tournament Actions
  fetchTournaments: (page: number) => Promise<void>
  fetchTournamentsParticipants: (tournament_id: string) => Promise<void>
  fetchTeamsFromCurrentTournament: () => Promise<void>
  fetchTournamentDetails: (tournamentId: string) => Promise<void> // NEW action
  addTournament: (
    details: Omit<Tournament, 'id' | 'created_at' | 'winner_team_id'>
  ) => Promise<Tournament | null>
  addTeamToTournament: (tournamentId: string, teamId: string) => Promise<void>
  setTournamentWinner: (
    tournamentId: string,
    winnerTeamId: string
  ) => Promise<void>
}

// ============================================================================
// 3. ZUSTAND STORE IMPLEMENTATION
// ============================================================================
export const PAGE_SIZE = 10 // We want to load 10 tournaments at a time

export const useBadmintonStore = create<BadmintonState>((set, get) => ({
  // --- INITIAL STATE ---
  tournaments: [],
  activeTournamentParticipants: [],
  activeTournamentId: null,
  activeTournament: null, // NEW
  loading: false,
  error: null,
  currentPage: 0,
  totalTournaments: 0,

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
      if (error instanceof Error) {
        set({ error: error.message })
      } else {
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
      if (error instanceof Error) {
        set({ error: error.message })
      } else {
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
      if (error instanceof Error) {
        set({ error: error.message })
      } else {
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
      if (error instanceof Error) {
        set({ error: error.message })
        return null
      } else {
        set({ error: String(error) })
      }
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
      if (error instanceof Error) {
        set({ error: error.message })
      } else {
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
      if (error instanceof Error) {
        set({ error: error.message })
      } else {
        set({ error: String(error) })
      }
    } finally {
      set({ loading: false })
    }
  },

  fetchTeamsFromCurrentTournament: async () => {
    const { activeTournamentId, teams } = get() // Get other actions and state
    if (activeTournamentId) {
      set({ loading: true, error: null })
      try {
        const { error, data } = await supabase
          .from('tournament_participants')
          .select('*')
          .eq('tournament_id', activeTournamentId)

        if (error) throw error
        const participatingTeamIds = data.map((p) => p.team_id)
        const finalteam = teams.filter((team) =>
          participatingTeamIds.includes(team.id)
        )

      } catch (error: unknown) {
        if (error instanceof Error) {
          set({
            error: `Team created, but failed to add to tournament: ${error.message}`,
          })
        } else {
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
}))
