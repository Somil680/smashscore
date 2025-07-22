import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import {
  TournamentState,
  TournamentActions,
  CreateTournamentDTO,
  CreateMatchDTO,
  AddMatchScoreDTO,
  MatchWithDetails,
  TournamentWithDetails,
  Match,
  TeamWithPlayers,
} from './type'

export const PAGE_SIZE = 10

const useTournamentStore = create<TournamentState & TournamentActions>(
  (set) => ({
    // ============================================================================
    // STATE
    // ============================================================================
    tournaments: [],
    activeTournamentId: null,
    activeTournament: null,
    activeTournamentParticipants: [],
    matches: [],
    matchScores: [],
    loading: false,
    error: null,
    currentPage: 0,
    totalTournaments: 0,

    // ============================================================================
    // ACTIONS
    // ============================================================================

    fetchTournaments: async (page = 0) => {
      set({ loading: true, error: null })
      try {
        const from = page * PAGE_SIZE
        const to = from + PAGE_SIZE - 1
        const { data, error, count } = await supabase
          .from('tournaments')
          .select(
            `
            *,
            winner_team:teams!tournaments_winner_team_id_fkey2 (
              *,
              player_1:players!teams_player_1_id_fkey(*),
              player_2:players!teams_player_2_id_fkey(*)
            )
          `,
            { count: 'exact' }
          )
          .order('created_at', { ascending: false })
          .range(from, to)

        if (error) throw error
        set({
          tournaments: data || [],
          totalTournaments: count || 0,
          currentPage: page,
          loading: false,
        })
      } catch (error: unknown) {
        set({
          error: error instanceof Error ? error.message : String(error),
          loading: false,
        })
      }
    },

    fetchTournamentDetails: async (tournamentId: string) => {
      set({ loading: true, error: null })
      try {
        const { data, error } = await supabase
          .from('tournaments')
          .select(
            `
            *,
            winner_team:teams!tournaments_winner_team_id_fkey2(*, player_1:players!teams_player_1_id_fkey(*), player_2:players!teams_player_2_id_fkey(*)),
            matches (
              *,
              match_scores (*),
              team_1:teams!matches_team_1_id_fkey (*, player_1:players!teams_player_1_id_fkey(*), player_2:players!teams_player_2_id_fkey(*)),
              team_2:teams!matches_team_2_id_fkey (*, player_1:players!teams_player_1_id_fkey(*), player_2:players!teams_player_2_id_fkey(*))
            )
          `
          )
          .eq('id', tournamentId)
          .single()

        if (error) throw error
        set({
          activeTournament: data as TournamentWithDetails | null,
          loading: false,
        })
      } catch (error: unknown) {
        set({
          error: error instanceof Error ? error.message : String(error),
          loading: false,
        })
      }
    },

    addTournament: async (tournamentData: CreateTournamentDTO) => {
      set({ loading: true, error: null })
      try {
        const { data, error } = await supabase
          .from('tournaments')
          .insert([tournamentData])
          .select()
          .single()

        if (error) throw error
        if (data) {
          // You might want to fetch the detailed tournament view here
          set((state) => ({
            tournaments: [...state.tournaments, data],
            activeTournamentId: data.id,
            loading: false,
          }))
          return data
        }
        return null
      } catch (error: unknown) {
        set({
          error: error instanceof Error ? error.message : String(error),
          loading: false,
        })
        return null
      }
    },

    addTeamToTournament: async (tournamentId: string, teamId: string) => {
      set({ loading: true, error: null })
      try {
        const { error } = await supabase
          .from('tournament_participants')
          .upsert(
            { tournament_id: tournamentId, team_id: teamId },
            { onConflict: 'tournament_id,team_id' }
          )

        if (error) throw error
        // You might want to refresh participants or optimistically update
        set({ loading: false })
      } catch (error: unknown) {
        set({
          error: error instanceof Error ? error.message : String(error),
          loading: false,
        })
      }
    },

    setTournamentWinner: async (tournamentId: string, winnerTeamId: string) => {
      set({ loading: true, error: null })
      try {
        const { data, error } = await supabase
          .from('tournaments')
          .update({ winner_team_id: winnerTeamId })
          .eq('id', tournamentId)
          .select()
          .single()

        if (error) throw error
        if (data) {
          set((state) => ({
            tournaments: state.tournaments.map((t) =>
              t.id === tournamentId ? { ...t, ...data } : t
            ),
            loading: false,
          }))
        }
      } catch (error: unknown) {
        set({
          error: error instanceof Error ? error.message : String(error),
          loading: false,
        })
      }
    },

    fetchMatchesForTournament: async (tournamentId: string) => {
      set({ loading: true, error: null })
      try {
        const { data, error } = await supabase
          .from('matches')
          .select(
            `
            *,
            team_1:teams!matches_team_1_id_fkey(*, player_1:players!teams_player_1_id_fkey(*), player_2:players!teams_player_2_id_fkey(*)),
            team_2:teams!matches_team_2_id_fkey(*, player_1:players!teams_player_1_id_fkey(*), player_2:players!teams_player_2_id_fkey(*))
          `
          )
          .eq('tournament_id', tournamentId)
          .order('created_at', { ascending: true })

        if (error) throw error
        set({
          matches: (data as MatchWithDetails[]) || [],
          loading: false,
        })
      } catch (error: unknown) {
        set({
          error: error instanceof Error ? error.message : String(error),
          loading: false,
        })
      }
    },

    addMatch: async (matchData: CreateMatchDTO) => {
      set({ loading: true, error: null })
      try {
        const { data, error } = await supabase
          .from('matches')
          .insert([matchData])
          .select(
            `
            *,
            team_1:teams!matches_team_1_id_fkey(*, player_1:players!teams_player_1_id_fkey(*), player_2:players!teams_player_2_id_fkey(*)),
            team_2:teams!matches_team_2_id_fkey(*, player_1:players!teams_player_1_id_fkey(*), player_2:players!teams_player_2_id_fkey(*))
          `
          )
          .single()

        if (error) throw error
        if (data) {
          set((state) => ({
            matches: [...state.matches, data as MatchWithDetails],
            loading: false,
          }))
          return data as MatchWithDetails
        }
        return null
      } catch (error: unknown) {
        set({
          error: error instanceof Error ? error.message : String(error),
          loading: false,
        })
        return null
      }
    },

    updateMatch: async (matchId: string, updates: Partial<Match>) => {
      set({ loading: true, error: null })
      try {
        const { data, error } = await supabase
          .from('matches')
          .update(updates)
          .eq('id', matchId)
          .select(
            `
            *,
            team_1:teams!matches_team_1_id_fkey(*, player_1:players!teams_player_1_id_fkey(*), player_2:players!teams_player_2_id_fkey(*)),
            team_2:teams!matches_team_2_id_fkey(*, player_1:players!teams_player_1_id_fkey(*), player_2:players!teams_player_2_id_fkey(*))
          `
          )
          .single()

        if (error) throw error
        if (data) {
          set((state) => ({
            matches: state.matches.map((m) =>
              m.id === matchId ? (data as MatchWithDetails) : m
            ),
            loading: false,
          }))
          return data as MatchWithDetails
        }
        return null
      } catch (error: unknown) {
        set({
          error: error instanceof Error ? error.message : String(error),
          loading: false,
        })
        return null
      }
    },

    finishMatch: async (
      matchId: string,
      winnerTeamId: string,
      scores: AddMatchScoreDTO[]
    ) => {
      set({ loading: true, error: null })
      try {
        // Step 1: Update match winner
        const { error: matchError } = await supabase
          .from('matches')
          .update({ winner_team_id: winnerTeamId })
          .eq('id', matchId)

        if (matchError) throw matchError

        // Step 2: Insert scores
        const { data: insertedScores, error: scoresError } = await supabase
          .from('match_scores')
          .insert(scores)
          .select()

        if (scoresError) throw scoresError

        // Step 3: Optimistic UI update
        set((state) => ({
          matches: state.matches.map((m) =>
            m.id === matchId ? { ...m, winner_team_id: winnerTeamId } : m
          ),
          matchScores: [
            ...state.matchScores.filter((s) => s.match_id !== matchId),
            ...(insertedScores || []),
          ],
          loading: false,
        }))
      } catch (error: unknown) {
        set({
          error: error instanceof Error ? error.message : String(error),
          loading: false,
        })
      }
    },
    setActiveTournamentParticipants: async (
      active: {
        tournament_id: string
        team_id: string
        team: TeamWithPlayers
      }[]
    ) => {
      set({ activeTournamentParticipants: active })
    },
  })
)

export default useTournamentStore
