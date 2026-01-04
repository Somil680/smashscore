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

    fetchTournaments: async (currentUserID, page = 0) => {
      set({ loading: true, error: null })
      try {
        const from = page * PAGE_SIZE
        const to = from + PAGE_SIZE - 1
        let query = supabase.from('tournaments').select(
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

        // Only filter by user_id if a user ID is provided
        if (currentUserID) {
          query = query.eq('user_id', currentUserID)
        }

        const { data, error, count } = await query
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
    fetchMatches: async () => {
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
        const { data, error: matchError } = await supabase
          .from('matches')
          .update({ winner_team_id: winnerTeamId })
          .eq('id', matchId)
        console.log(
          '🚀 ~ finishMatch ~ matchId:',
          data,
          matchId,
          'winnerTeamId:',
          winnerTeamId,
          'scores:',
          scores
        )
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

    saveBatchTournamentToSupabase: async (localTournamentData) => {
      set({ loading: true, error: null })

      try {
        const { tournament, participants, matches, scores } =
          localTournamentData

        // Step 1: Create the tournament
        const { data: createdTournament, error: tournamentError } =
          await supabase
            .from('tournaments')
            .insert([
              {
                name: tournament.name,
                tournament_type: tournament.tournament_type,
                match_type: tournament.match_type,
                winner_team_id: tournament.winner_team_id,
                points_per_game: tournament.points_per_game,
                max_game_set: tournament.max_game_set,
                user_id: tournament.user_id,
              },
            ])
            .select()
            .single()

        if (tournamentError) throw tournamentError
        if (!createdTournament) throw new Error('Failed to create tournament')

        const realTournamentId = createdTournament.id

        // Step 2: Create teams if they don't exist and add tournament participants
        const teamIdMapping: { [localTeamId: string]: string } = {}

        for (const participant of participants) {
          const team = participant.team
          console.log('🚀 ~ team:', team)

          // Check if team already exists in database
          let realTeamId = team.id

          // If team has local ID (starts with uuid pattern), create it in database
          // if (team.id.includes('-')) {
          let query = supabase
            .from('teams')
            .select('id')
            .eq('player_1_id', team.player_1_id)

          // Check if player_2_id is null or has a value
          if (team.player_2_id === null) {
            query = query.is('player_2_id', null)
          } else {
            query = query.eq('player_2_id', team.player_2_id)
          }

          const { data: existingTeam, error: findError } =
            await query.maybeSingle()
          // const { data: existingTeam, error: findError } = await supabase
          //   .from('teams')
          //   .select('id')
          //   .eq('player_1_id', team.player_1_id)
          //   .eq('player_2_id', team.player_2_id)
          //   .single()
          console.log('🚀 ~ existingTeam:', existingTeam)

          if (findError && findError.code !== 'PGRST116') throw findError

          if (existingTeam) {
            realTeamId = existingTeam.id
          } else {
            // Create new team
            const { data: newTeam, error: teamError } = await supabase
              .from('teams')
              .insert([
                {
                  player_1_id: team.player_1_id,
                  player_2_id: team.player_2_id,
                },
              ])
              .select()
              .single()

            if (teamError) throw teamError
            if (!newTeam) throw new Error('Failed to create team')

            realTeamId = newTeam.id
          }
          // }

          teamIdMapping[team.id] = realTeamId

          // Add team to tournament
          const { error: participantError } = await supabase
            .from('tournament_participants')
            .insert([
              {
                tournament_id: realTournamentId,
                team_id: realTeamId,
              },
            ])

          if (participantError) throw participantError
        }

        // Step 3: Create matches with correct team IDs
        const matchIdMapping: { [localMatchId: string]: string } = {}

        for (const match of matches) {
          const realTeam1Id = teamIdMapping[match.team_1_id] || match.team_1_id
          const realTeam2Id = match.team_2_id
            ? teamIdMapping[match.team_2_id] || match.team_2_id
            : null
          const realWinnerTeamId = match.winner_team_id
            ? teamIdMapping[match.winner_team_id] || match.winner_team_id
            : null

          const { data: createdMatch, error: matchError } = await supabase
            .from('matches')
            .insert([
              {
                tournament_id: realTournamentId,
                team_1_id: realTeam1Id,
                team_2_id: realTeam2Id,
                winner_team_id: realWinnerTeamId,
                tag: match.tag,
              },
            ])
            .select()
            .single()

          if (matchError) throw matchError
          if (!createdMatch) throw new Error('Failed to create match')

          matchIdMapping[match.id] = createdMatch.id
        }

        // Step 4: Create match scores with correct match IDs
        const scoresToInsert = scores.map((score) => ({
          match_id: matchIdMapping[score.match_id],
          game_number: score.game_number,
          team_1_score: score.team_1_score,
          team_2_score: score.team_2_score,
        }))

        if (scoresToInsert.length > 0) {
          const { error: scoresError } = await supabase
            .from('match_scores')
            .insert(scoresToInsert)

          if (scoresError) throw scoresError
        }

        // Step 5: Update tournament with winner if exists
        if (tournament.winner_team_id) {
          const realWinnerTeamId =
            teamIdMapping[tournament.winner_team_id] ||
            tournament.winner_team_id

          const { error: winnerError } = await supabase
            .from('tournaments')
            .update({ winner_team_id: realWinnerTeamId })
            .eq('id', realTournamentId)

          if (winnerError) throw winnerError
        }

        set({ loading: false })

        return {
          success: true,
          tournamentId: realTournamentId,
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        set({
          error: errorMessage,
          loading: false,
        })

        return {
          success: false,
          error: errorMessage,
        }
      }
    },
  })
)

export default useTournamentStore
