import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import {
  Tournament,
  TeamWithPlayers,
  MatchWithDetails,
  MatchScore,
  CreateTournamentDTO,
  TournamentParticipant,
} from './type'

// Local tournament data structure
export interface LocalTournament extends Omit<Tournament, 'id' | 'created_at'> {
  id: string
  created_at: string
  isLocal: true // Flag to identify local tournaments
}

export interface LocalMatch
  extends Omit<MatchWithDetails, 'id' | 'created_at' | 'match_date'> {
  id: string
  created_at: string
  match_date: string
  isLocal: true
}

export interface LocalMatchScore extends Omit<MatchScore, 'id'> {
  id: string
  isLocal: true
}

export interface LocalTournamentState {
  // Current tournament being created
  currentTournament: LocalTournament | null
  currentTournamentParticipants: (TournamentParticipant & {
    team: TeamWithPlayers
  })[]
  currentMatches: LocalMatch[]
  currentMatchScores: LocalMatchScore[]

  // UI state
  loading: boolean
  error: string | null

  // Completion tracking
  isAllMatchesCompleted: boolean
  tournamentWinner: TeamWithPlayers | null
}

export interface LocalTournamentActions {
  // Tournament creation
  createLocalTournament: (tournamentData: CreateTournamentDTO) => string

  // Team management
  addTeamToLocalTournament: (team: TeamWithPlayers) => void
  setLocalTournamentParticipants: (
    participants: (TournamentParticipant & { team: TeamWithPlayers })[]
  ) => void

  // Match management
  addLocalMatch: (
    matchData: Omit<LocalMatch, 'id' | 'created_at' | 'match_date' | 'isLocal'>
  ) => LocalMatch
  updateLocalMatch: (matchId: string, updates: Partial<LocalMatch>) => void
  finishLocalMatch: (
    matchId: string,
    winnerTeamId: string,
    scores: Omit<LocalMatchScore, 'id' | 'isLocal'>[]
  ) => void

  // Tournament completion
  setTournamentWinner: (winnerTeam: TeamWithPlayers) => void
  checkAllMatchesCompleted: () => void

  // Data management
  clearLocalTournament: () => void
  getLocalTournamentData: () => {
    tournament: LocalTournament | null
    participants: (TournamentParticipant & { team: TeamWithPlayers })[]
    matches: LocalMatch[]
    scores: LocalMatchScore[]
  }
}

const useLocalTournamentStore = create<
  LocalTournamentState & LocalTournamentActions
>()(
  persist(
    (set, get) => ({
      // ============================================================================
      // STATE
      // ============================================================================
      currentTournament: null,
      currentTournamentParticipants: [],
      currentMatches: [],
      currentMatchScores: [],
      loading: false,
      error: null,
      isAllMatchesCompleted: false,
      tournamentWinner: null,

      // ============================================================================
      // ACTIONS
      // ============================================================================

      createLocalTournament: (tournamentData: CreateTournamentDTO) => {
        const tournamentId = uuidv4()
        const localTournament: LocalTournament = {
          ...tournamentData,
          id: tournamentId,
          created_at: new Date().toISOString(),
          isLocal: true,
        }

        set({
          currentTournament: localTournament,
          currentTournamentParticipants: [],
          currentMatches: [],
          currentMatchScores: [],
          isAllMatchesCompleted: false,
          tournamentWinner: null,
          error: null,
        })

        return tournamentId
      },

      addTeamToLocalTournament: (team: TeamWithPlayers) => {
        const state = get()
        if (!state.currentTournament) return

        const participant = {
          tournament_id: state.currentTournament.id,
          team_id: team.id,
          team,
        }

        set({
          currentTournamentParticipants: [
            ...state.currentTournamentParticipants,
            participant,
          ],
        })
      },

      setLocalTournamentParticipants: (participants) => {
        set({ currentTournamentParticipants: participants })
      },

      addLocalMatch: (matchData) => {
        const matchId = uuidv4()
        const localMatch: LocalMatch = {
          ...matchData,
          id: matchId,
          created_at: new Date().toISOString(),
          match_date: new Date().toISOString(),
          isLocal: true,
        }

        set((state) => ({
          currentMatches: [...state.currentMatches, localMatch],
        }))

        return localMatch
      },

      updateLocalMatch: (matchId: string, updates: Partial<LocalMatch>) => {
        set((state) => ({
          currentMatches: state.currentMatches.map((match) =>
            match.id === matchId ? { ...match, ...updates } : match
          ),
        }))
      },

      finishLocalMatch: (matchId: string, winnerTeamId: string, scores) => {
        // Update match with winner
        get().updateLocalMatch(matchId, { winner_team_id: winnerTeamId })

        // Add scores
        const localScores: LocalMatchScore[] = scores.map((score) => ({
          ...score,
          id: uuidv4(),
          isLocal: true,
        }))

        set((state) => ({
          currentMatchScores: [
            ...state.currentMatchScores.filter((s) => s.match_id !== matchId),
            ...localScores,
          ],
        }))

        // Check if all matches are completed
        get().checkAllMatchesCompleted()
      },

      setTournamentWinner: (winnerTeam: TeamWithPlayers) => {
        set((state) => ({
          currentTournament: state.currentTournament
            ? { ...state.currentTournament, winner_team_id: winnerTeam.id }
            : null,
          tournamentWinner: winnerTeam,
        }))
      },

      checkAllMatchesCompleted: () => {
        const state = get()
        const allCompleted = state.currentMatches.every(
          (match) => !!match.winner_team_id
        )

        set({ isAllMatchesCompleted: allCompleted })

        // If all matches are completed and it's a final match, determine tournament winner
        if (allCompleted) {
          const finalMatch = state.currentMatches.find(
            (m) => m.tag === 'Final Match'
          )
          if (finalMatch && finalMatch.winner_team_id) {
            const winnerTeam = state.currentTournamentParticipants.find(
              (p) => p.team_id === finalMatch.winner_team_id
            )?.team
            if (winnerTeam) {
              get().setTournamentWinner(winnerTeam)
            }
          }
        }
      },

      clearLocalTournament: () => {
        set({
          currentTournament: null,
          currentTournamentParticipants: [],
          currentMatches: [],
          currentMatchScores: [],
          isAllMatchesCompleted: false,
          tournamentWinner: null,
          loading: false,
          error: null,
        })
      },

      getLocalTournamentData: () => {
        const state = get()
        return {
          tournament: state.currentTournament,
          participants: state.currentTournamentParticipants,
          matches: state.currentMatches,
          scores: state.currentMatchScores,
        }
      },
    }),
    {
      name: 'local-tournament-storage',
      partialize: (state) => ({
        currentTournament: state.currentTournament,
        currentTournamentParticipants: state.currentTournamentParticipants,
        currentMatches: state.currentMatches,
        currentMatchScores: state.currentMatchScores,
        isAllMatchesCompleted: state.isAllMatchesCompleted,
        tournamentWinner: state.tournamentWinner,
      }),
    }
  )
)

export default useLocalTournamentStore
