// import { Tournament } from './../components/useSmashScoreStore';
// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// import { supabase } from '../lib/supabase'
// import { v4 as uuidv4 } from 'uuid'

// // --- Types ---
// export type Player = {
//   id: string
//   name: string
//   image?: string
//   createdAt: Date
//   matchesPlayed: number
//   matchesWon: number
//   highestScore: number
//   totalPointsScored: number
//   synced: boolean
// }

// export type TournamentType = 'league' | 'knockout' | 'round-robin'
// export type MatchType = 'singles' | 'doubles'

// export type Tournament = {
//   id: string
//   name: string
//   type: TournamentType
//   match_type: MatchType
//   teams_Id: string[]
//   max_game_set: number
//   points_per_game: number
//   winner_team_id?: string // ✅ add this
//   createdAt: Date
//   synced: boolean
// }
// export type Teams = {
//   id: string
//   name: string
//   players_id: string[]
//   totalPointsScored: number // ✅ New field
//   createdAt: Date
// }

// export type Match = {
//   id: string
//   tournamentId: string
//   team1Id: string
//   team2Id: string
//   team1_score: number[]
//   team2_score: number[]
//   winnerteam_id: string
//   synced: boolean
// }

// // --- Store State & Actions ---
// export interface SmashScoreState {
//   players: Player[]
//   teams: Teams[]
//   tournaments: Tournament[]
//   matches: Match[]
//   currentTournamentId?: string
//   currentMatchId?: string
//   initialTournament: {
//     name: string
//     match_type: MatchType
//     max_game_set: number
//     points_per_game: number
//   }
//   setInitialTournament: (data: {
//     name: string
//     match_type: MatchType
//     max_game_set: number
//     points_per_game: number
//   }) => void
//   // Team Action
//   addTeam: (teams: Omit<Teams, 'createdAt'>) => void

//   // Player actions
//   addPlayer: (
//     player: Omit<
//       Player,
//       | 'createdAt'
//       | 'matchesPlayed'
//       | 'matchesWon'
//       | 'highestScore'
//       | 'totalPointsScored'
//       | 'synced'
//     >
//   ) => void
//   editPlayer: (
//     id: string,
//     updates: Partial<Omit<Player, 'id' | 'createdAt'>>
//   ) => void
//   deletePlayer: (id: string) => void
//   updatePlayerStats: (
//     id: string,
//     stats: Partial<
//       Pick<
//         Player,
//         'matchesPlayed' | 'matchesWon' | 'highestScore' | 'totalPointsScored'
//       >
//     >
//   ) => void

//   // Tournament actions
//   addTournament: (tournament: Omit<Tournament, 'createdAt' | 'synced'>) => void
//   assignPlayersToTournament: (tournamentId: string, playerIds: string[]) => void
//   setTournamentWinner: ( teamId: string) => void

//   // Match actions
//   addMatch: (
//     match: Omit<Match, 'playedAt' | 'synced' | 'winnerteam_id'>
//   ) => void
//   recordMatchResult: (
//     matchId: string,
//     scores: { a: number[]; b: number[] },
//     winnerId: string
//   ) => void

//   // Selection
//   selectTournament: (id: string) => void
//   selectMatch: (id: string) => void

//   // Reset
//   reset: () => void

//   // Fetch players
//   fetchPlayers: () => Promise<void>
// }

// export const useSmashScoreStore = create<SmashScoreState>()(
//   // persist
//   //   (
//   (set) => ({
//     // (set, get) => ({
//     players: [],
//     teams: [],
//     tournaments: [],
//     matches: [],
//     currentTournamentId: undefined,
//     currentMatchId: undefined,
//     initialTournament: {
//       name: '',
//       match_type: 'singles', // or default to 'doubles'
//       max_game_set: 3,
//       points_per_game: 21,
//     },
//     setInitialTournament: (data) =>
//       set(() => ({
//         initialTournament: {
//           name: data.name,
//           match_type: data.match_type,
//           max_game_set: data.max_game_set,
//           points_per_game: data.points_per_game,
//         },
//       })),

//     addTeam: async (team) => {
//       const newTeam = {
//         ...team,
//         createdAt: new Date(),
//       }
//       set((state) => ({ teams: [...state.teams, newTeam] })) // optimistic
//       // const { error } = await supabase.from('teams').insert([newTeam])
//       // if (!error) {
//       //   set((state) => ({
//       //     teams: state.teams.map((p) =>
//       //       p.id === newTeam.id ? { ...p, synced: true } : p
//       //     ),
//       //   }))
//       // }
//       // Optionally handle error (revert or notify)
//     },
//     addPlayer: async (player) => {
//       const newPlayer = {
//         ...player,
//         id: uuidv4(),
//         createdAt: new Date(),
//         matchesPlayed: 0,
//         matchesWon: 0,
//         highestScore: 0,
//         totalPointsScored: 0,
//         synced: false,
//       }
//       set((state) => ({ players: [...state.players, newPlayer] })) // optimistic
//       const { error } = await supabase.from('players').insert([newPlayer])
//       if (!error) {
//         set((state) => ({
//           players: state.players.map((p) =>
//             p.id === newPlayer.id ? { ...p, synced: true } : p
//           ),
//         }))
//       }
//       // Optionally handle error (revert or notify)
//     },

//     editPlayer: (id, updates) =>
//       set((state) => ({
//         players: state.players.map((p) =>
//           p.id === id ? { ...p, ...updates } : p
//         ),
//       })),

//     deletePlayer: (id) =>
//       set((state) => ({
//         players: state.players.filter((p) => p.id !== id),
//       })),

//     updatePlayerStats: (id, stats) =>
//       set((state) => ({
//         players: state.players.map((p) =>
//           p.id === id ? { ...p, ...stats } : p
//         ),
//       })),

//     addTournament: async (tournament) => {
//       const newTournament: Tournament = {
//         ...tournament,
//         id: uuidv4(),
//         createdAt: new Date(),
//         name: tournament.name,
//         type: tournament.type,
//         match_type: tournament.match_type,
//         teams_Id: tournament.teams_Id,
//         max_game_set: tournament.max_game_set,
//         points_per_game: tournament.points_per_game,
//         synced: false,
//       }

//       set((state) => ({ tournaments: [...state.tournaments, newTournament] }))
//       set(() => ({ currentTournamentId: newTournament.id }))
//       // const { error } = await supabase
//       //   .from('tournaments')
//       //   .insert([newTournament])
//       // if (!error) {
//       //   set((state) => {
//       //     console.log('🚀 ~ set ~ state:', state)
//       //     return {
//       //       tournaments: state.tournaments.map((p) =>
//       //         p.id === newTournament.id ? { ...p, synced: true } : p
//       //       ),
//       //     }
//       //   })
//       // }
//     },
//     // assignPlayersToTournament: (tournamentId, playerIds) =>
//     //   set((state) => ({
//     //     tournaments: state.tournaments.map((t) =>
//     //     {
//     //       console.log("🚀 ~ playerIds:", playerIds)
//     //       return (
//     //       t.id === tournamentId
//     //     ? { ...t, teams_Id: playerIds  }
//     //     : t)}
//     //   ),
//     //   })),
//     assignPlayersToTournament: (tournamentId, teamIds) =>
//       set((state) => ({
//         tournaments: state.tournaments.map((t) => {
//           console.log(
//             ' 🚀 ~ tournaments:state.tournaments.map ~ t.id:',
//             t.id,
//             tournamentId
//           )
//           if (t.id === tournamentId) {
//             console.log('✅ Assigning teamIds to tournament:', teamIds)
//             return { ...t, teams_Id: teamIds }
//           }
//           return t
//         }),
//       })),
//     addMatch: async (match) => {
//       const newMatch = {
//         ...match,
//         id: uuidv4(),
//         winnerteam_id: '',
//         created_at: new Date(),
//         synced: false,
//       }

//       set((state) => ({ matches: [...state.matches, newMatch] }))
//       // const { error } = await supabase.from('match').insert([newMatch])
//       // if (!error) {
//       //   set((state) => {
//       //     return {
//       //       matches: state.matches.map((p) =>
//       //         p.id === newMatch.id ? { ...p, synced: true } : p
//       //       ),
//       //     }
//       //   })
//       // }
//     },
//     setTournamentWinner: (teamId: string) =>
//       set((state) => ({
//         tournaments: state.tournaments.map((t) =>
//           t.id === state.currentTournamentId
//             ? { ...t, winnerteam_id: teamId }
//             : t
//         ),
//       })),
//     // recordMatchResult: (matchId, scores, winnerId) =>
//     //   set((state) => ({
//     //     matches: state.matches.map((m) =>
//     //       m.id === matchId
//     //         ? {
//     //             ...m,
//     //             team1_score: scores.a,
//     //             team2_score: scores.b,
//     //             winnerteam_id: winnerId,
//     //             synced: false,
//     //           }
//     //         : m
//     //     ),
//     //   })),
//     recordMatchResult: (matchId, scores, winnerId) =>
//       set((state) => {
//         const matchIndex = state.matches.findIndex((m) => m.id === matchId)
//         if (matchIndex === -1) return state

//         const match = state.matches[matchIndex]
//         const totalTeam1 = scores.a.reduce((acc, val) => acc + val, 0)
//         const totalTeam2 = scores.b.reduce((acc, val) => acc + val, 0)
      
//         const diffA = totalTeam1 - totalTeam2 // Could be negative
//         const diffB = totalTeam2 - totalTeam1 // Opposite of above
//         return {
//           matches: state.matches.map((m) =>
//             m.id === matchId
//               ? {
//                   ...m,
//                   team1_score: scores.a,
//                   team2_score: scores.b,
//                   winnerteam_id: winnerId,
//                 }
//               : m
//           ),
//           teams: state.teams.map((team) => {
//             if (team.id === match.team1Id) {
//               return {
//                 ...team,
//                 totalPointsScored: (team.totalPointsScored || 0) + diffA,
//               }
//             }
//             if (team.id === match.team2Id) {
//               return {
//                 ...team,
//                 totalPointsScored: (team.totalPointsScored || 0) + diffB,
//               }
//             }
//             return team
//           }),
//         }
//       }),

//     selectTournament: (id) => set(() => ({ currentTournamentId: id })),
//     selectMatch: (id) => set(() => ({ currentMatchId: id })),

//     reset: () =>
//       set(() => ({
//         players: [],
//         tournaments: [],
//         matches: [],
//         currentTournamentId: undefined,
//         currentMatchId: undefined,
//       })),

//     fetchPlayers: async () => {
//       const { data, error } = await supabase.from('players').select('*')
//       if (!error && data) {
//         set({ players: data })
//       }
//     },
//     fetchTournaments: async () => {
//       const { data, error } = await supabase.from('tournaments').select('*')
//       if (!error && data) {
//         set({ players: data })
//       }
//     },
//     fetchTeams: async () => {
//       const { data, error } = await supabase.from('team').select('*')
//       if (!error && data) {
//         set({ players: data })
//       }
//     },
//   })
//   // {
//   //   name: 'smashscore-storage',
//   //   partialize: (state) => ({
//   //     players: state.players,
//   //     tournaments: state.tournaments,
//   //     matches: state.matches,
//   //     currentTournamentId: state.currentTournamentId,
//   //     currentMatchId: state.currentMatchId,
//   //   }),
//   // }
//   // )
// )
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '../lib/supabase'

// --- Types ---
export type Player = {
  id: string
  name: string
  image?: string
  createdAt: Date
  matchesPlayed: number
  matchesWon: number
  highestScore: number
  totalPointsScored: number
  synced: boolean
}

export type TournamentType = 'league' | 'knockout' | 'round-robin'
export type MatchType = 'singles' | 'doubles'

export type Tournament = {
  id: string
  name: string
  type: TournamentType
  match_type: MatchType
  teams_Id: string[]
  max_game_set: number
  points_per_game: number
  winner_team_id?: string
  createdAt: Date
  synced: boolean
}

export type Teams = {
  id: string
  name: string
  players_id: string[]
  totalPointsScored: number
  createdAt: Date
}

export type Match = {
  id: string
  tournamentId: string
  team1Id: string
  team2Id: string
  team1_score: number[]
  team2_score: number[]
  winnerteam_id: string
  synced: boolean
}

export interface SmashScoreState {
  players: Player[]
  teams: Teams[]
  tournaments: Tournament[]
  matches: Match[]
  currentTournamentId?: string
  currentMatchId?: string
  initialTournament: {
    name: string
    match_type: MatchType
    max_game_set: number
    points_per_game: number
  }
  setInitialTournament: (data: SmashScoreState['initialTournament']) => void

  addTeam: (team: Omit<Teams, 'createdAt'>) => void
  addPlayer: (
    player: Omit<
      Player,
      | 'createdAt'
      | 'matchesPlayed'
      | 'matchesWon'
      | 'highestScore'
      | 'totalPointsScored'
      | 'synced'
    >
  ) => void
  editPlayer: (
    id: string,
    updates: Partial<Omit<Player, 'id' | 'createdAt'>>
  ) => void
  deletePlayer: (id: string) => void
  updatePlayerStats: (
    id: string,
    stats: Partial<
      Pick<
        Player,
        'matchesPlayed' | 'matchesWon' | 'highestScore' | 'totalPointsScored'
      >
    >
  ) => void

  addTournament: (tournament: Omit<Tournament, 'createdAt' | 'synced'>) => void
  assignPlayersToTournament: (tournamentId: string, playerIds: string[]) => void
  setTournamentWinner: (teamId: string) => void

  addMatch: (match: Omit<Match, 'winnerteam_id' | 'synced'>) => void
  recordMatchResult: (
    matchId: string,
    scores: { a: number[]; b: number[] },
    winnerId: string
  ) => void

  selectTournament: (id: string) => void
  selectMatch: (id: string) => void
  reset: () => void

  fetchPlayers: () => Promise<void>
  fetchTournaments: () => Promise<void>
  fetchTeams: () => Promise<void>
}

export const useSmashScoreStore = create<SmashScoreState>()((set) => ({
  players: [],
  teams: [],
  tournaments: [],
  matches: [],
  currentTournamentId: undefined,
  currentMatchId: undefined,
  initialTournament: {
    name: '',
    match_type: 'singles',
    max_game_set: 3,
    points_per_game: 21,
  },

  setInitialTournament: (data) =>
    set(() => ({ initialTournament: { ...data } })),

  addTeam: async (team) => {
    const newTeam = { ...team, createdAt: new Date() }
    set((state) => ({ teams: [...state.teams, newTeam] }))
  },

  addPlayer: async (player) => {
    const newPlayer: Player = {
      ...player,
      id: uuidv4(),
      createdAt: new Date(),
      matchesPlayed: 0,
      matchesWon: 0,
      highestScore: 0,
      totalPointsScored: 0,
      synced: false,
    }
    set((state) => ({ players: [...state.players, newPlayer] }))
    const { error } = await supabase.from('players').insert([newPlayer])
    if (!error) {
      set((state) => ({
        players: state.players.map((p) =>
          p.id === newPlayer.id ? { ...p, synced: true } : p
        ),
      }))
    }
  },

  editPlayer: (id, updates) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  deletePlayer: (id) =>
    set((state) => ({ players: state.players.filter((p) => p.id !== id) })),

  updatePlayerStats: (id, stats) =>
    set((state) => ({
      players: state.players.map((p) => (p.id === id ? { ...p, ...stats } : p)),
    })),

  addTournament: async (tournament) => {
    const newTournament: Tournament = {
      ...tournament,
      id: uuidv4(),
      createdAt: new Date(),
      synced: false,
    }
    set((state) => ({ tournaments: [...state.tournaments, newTournament] }))
    set(() => ({ currentTournamentId: newTournament.id }))
  },

  assignPlayersToTournament: (tournamentId, teamIds) =>
    set((state) => ({
      tournaments: state.tournaments.map((t) =>
        t.id === tournamentId ? { ...t, teams_Id: teamIds } : t
      ),
    })),

  setTournamentWinner: (teamId) =>
    set((state) => ({
      tournaments: state.tournaments.map((t) =>
        t.id === state.currentTournamentId
          ? { ...t, winner_team_id: teamId }
          : t
      ),
    })),

  addMatch: async (match) => {
    const newMatch: Match = {
      ...match,
      id: uuidv4(),
      winnerteam_id: '',
      synced: false,
    }
    set((state) => ({ matches: [...state.matches, newMatch] }))
  },

  recordMatchResult: (matchId, scores, winnerId) =>
    set((state) => {
      const matchIndex = state.matches.findIndex((m) => m.id === matchId)
      if (matchIndex === -1) return state

      const match = state.matches[matchIndex]
      const totalTeam1 = scores.a.reduce((acc, val) => acc + val, 0)
      const totalTeam2 = scores.b.reduce((acc, val) => acc + val, 0)
      const diffA = totalTeam1 - totalTeam2
      const diffB = totalTeam2 - totalTeam1

      return {
        matches: state.matches.map((m) =>
          m.id === matchId
            ? {
                ...m,
                team1_score: scores.a,
                team2_score: scores.b,
                winnerteam_id: winnerId,
              }
            : m
        ),
        teams: state.teams.map((team) => {
          if (team.id === match.team1Id) {
            return {
              ...team,
              totalPointsScored: (team.totalPointsScored || 0) + diffA,
            }
          }
          if (team.id === match.team2Id) {
            return {
              ...team,
              totalPointsScored: (team.totalPointsScored || 0) + diffB,
            }
          }
          return team
        }),
      }
    }),

  selectTournament: (id) => set(() => ({ currentTournamentId: id })),
  selectMatch: (id) => set(() => ({ currentMatchId: id })),

  reset: () =>
    set(() => ({
      players: [],
      tournaments: [],
      matches: [],
      currentTournamentId: undefined,
      currentMatchId: undefined,
    })),

  fetchPlayers: async () => {
    const { data, error } = await supabase.from('players').select('*')
    if (!error && data) set({ players: data })
  },

  fetchTournaments: async () => {
    const { data, error } = await supabase.from('tournaments').select('*')
    if (!error && data) set({ tournaments: data })
  },

  fetchTeams: async () => {
    const { data, error } = await supabase.from('team').select('*')
    if (!error && data) set({ teams: data })
  },
}))
