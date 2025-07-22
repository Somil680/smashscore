import { Team } from '@/store/type'

/**
 * A selector function that takes the entire state and returns only the
 * teams participating in the currently active tournament.
 * @param state The full Zustand state object.
 * @returns An array of Team objects.
 */
// export const selectActiveTournamentTeams = (state: BadmintonState): Team[] => {
//   // 1. Get the IDs of teams participating in the active tournament.
//   // Using a Set is slightly more efficient for lookups than .includes()
//   const participatingTeamIds = new Set(
//     state.activeTournamentParticipants.map((p) => p.id)
//   )

//   // 2. Filter the global 'teams' list to find the full objects for those IDs.
//   return state.teams.filter((team) => participatingTeamIds.has(team.id))
// }
