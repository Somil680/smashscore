import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Types ---
export type Player = {
  id: string;
  name: string;
  image?: string;
  createdAt: Date;
  matchesPlayed: number;
  matchesWon: number;
  highestScore: number;
  totalPointsScored: number;
  synced: boolean;
};

export type TournamentType = 'league' | 'knockout' | 'round-robin';

export type Tournament = {
  id: string;
  name: string;
  type: TournamentType;
  playerIds: string[];
  createdAt: Date;
  synced: boolean;
};

export type Match = {
  id: string;
  tournamentId: string;
  playerAId: string;
  playerBId: string;
  scores: { a: number[]; b: number[] };
  winnerId: string;
  playedAt: Date;
  synced: boolean;
};

// --- Store State & Actions ---
export interface SmashScoreState {
  players: Player[];
  tournaments: Tournament[];
  matches: Match[];
  currentTournamentId?: string;
  currentMatchId?: string;

  // Player actions
  addPlayer: (player: Omit<Player, 'createdAt' | 'matchesPlayed' | 'matchesWon' | 'highestScore' | 'totalPointsScored' | 'synced'>) => void;
  editPlayer: (id: string, updates: Partial<Omit<Player, 'id' | 'createdAt'>>) => void;
  deletePlayer: (id: string) => void;
  updatePlayerStats: (id: string, stats: Partial<Pick<Player, 'matchesPlayed' | 'matchesWon' | 'highestScore' | 'totalPointsScored'>>) => void;

  // Tournament actions
  addTournament: (tournament: Omit<Tournament, 'createdAt' | 'synced'>) => void;
  assignPlayersToTournament: (tournamentId: string, playerIds: string[]) => void;

  // Match actions
  addMatch: (match: Omit<Match, 'playedAt' | 'synced' | 'winnerId'> & { scores: { a: number[]; b: number[] } }) => void;
  recordMatchResult: (matchId: string, scores: { a: number[]; b: number[] }, winnerId: string) => void;

  // Selection
  selectTournament: (id: string) => void;
  selectMatch: (id: string) => void;

  // Reset
  reset: () => void;
}

export const useSmashScoreStore = create<SmashScoreState>()(
  persist(
    (set, get) => ({
      players: [],
      tournaments: [],
      matches: [],
      currentTournamentId: undefined,
      currentMatchId: undefined,

      addPlayer: (player) => set((state) => ({
        players: [
          ...state.players,
          {
            ...player,
            createdAt: new Date(),
            matchesPlayed: 0,
            matchesWon: 0,
            highestScore: 0,
            totalPointsScored: 0,
            synced: false,
          },
        ],
      })),

      editPlayer: (id, updates) => set((state) => ({
        players: state.players.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      })),

      deletePlayer: (id) => set((state) => ({
        players: state.players.filter((p) => p.id !== id),
      })),

      updatePlayerStats: (id, stats) => set((state) => ({
        players: state.players.map((p) =>
          p.id === id ? { ...p, ...stats } : p
        ),
      })),

      addTournament: (tournament) => set((state) => ({
        tournaments: [
          ...state.tournaments,
          {
            ...tournament,
            createdAt: new Date(),
            synced: false,
          },
        ],
      })),

      assignPlayersToTournament: (tournamentId, playerIds) => set((state) => ({
        tournaments: state.tournaments.map((t) =>
          t.id === tournamentId ? { ...t, playerIds } : t
        ),
      })),

      addMatch: (match) => set((state) => {
        // winnerId is empty until result is recorded
        return {
          matches: [
            ...state.matches,
            {
              ...match,
              playedAt: new Date(),
              synced: false,
              winnerId: '',
            },
          ],
        };
      }),

      recordMatchResult: (matchId, scores, winnerId) => set((state) => ({
        matches: state.matches.map((m) =>
          m.id === matchId ? { ...m, scores, winnerId } : m
        ),
      })),

      selectTournament: (id) => set(() => ({ currentTournamentId: id })),
      selectMatch: (id) => set(() => ({ currentMatchId: id })),

      reset: () => set(() => ({
        players: [],
        tournaments: [],
        matches: [],
        currentTournamentId: undefined,
        currentMatchId: undefined,
      })),
    }),
    {
      name: 'smashscore-storage',
      partialize: (state) => ({
        players: state.players,
        tournaments: state.tournaments,
        matches: state.matches,
        currentTournamentId: state.currentTournamentId,
        currentMatchId: state.currentMatchId,
      }),
    }
  )
);
