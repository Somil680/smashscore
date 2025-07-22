// import { useBadmintonStore } from '@/store/useBadmintonStore'

// export const createAndRegisterTeam = async (
//   tournamentId: string,
//   player1Id: string,
//   player2Id?: string
// ) => {
//   // Get the actions from your Zustand store
//   const { addTeam, addTeamToTournament, fetchTeamsFromCurrentTournament } =
//     useBadmintonStore.getState()

//   console.log(`Attempting to create a team for player(s): ${player1Id}`)

//   // Step 1: Call addTeam and wait for it to complete.
//   // It will return the newly created team object or null if it fails.
//   const newTeam = await addTeam(player1Id, player2Id)

//   // Step 2: Check if the team was created successfully.
//   if (newTeam && newTeam.id) {
//     console.log(`Team created successfully with ID: ${newTeam.id}`)

//     // Step 3: Immediately use the newTeam.id to register it to the tournament.
//     await addTeamToTournament(tournamentId, newTeam.id)
//     await fetchTeamsFromCurrentTournament()

//     console.log(
//       `Team ${newTeam.id} successfully registered to tournament ${tournamentId}.`
//     )
//     return newTeam // Return the new team for any further UI updates
//   } else {
//     console.error(
//       'Failed to create the team. Cannot register to the tournament.'
//     )
//     return null
//   }
// }

// NEW: A manager function to handle the whole process

// export const selectActiveTournamentTeams = (state: BadmintonState): Team[] => {
//   // 1. Get the IDs of teams participating in the active tournament.
//   // Using a Set is slightly more efficient for lookups than .includes()
//   const participatingTeamIds = new Set(
//     state.activeTournamentsParticipant.map((p) => p.team_id)
//   )

//   // 2. Filter the global 'teams' list to find the full objects for those IDs.
//   return state.teams.filter((team) => participatingTeamIds.has(team.id))
// }
// export const createAndRegisterTeam = async (
//   tournamentId: string,
//   player1Id: string,
//   player2Id?: string
// ) => {
//   // Get the actions from your Zustand store
//   const {
//     getOrCreateTeam,
//     addTeamToTournament,
//   } = useBadmintonStore.getState()

//   // Step 1: Call getOrCreateTeam. This will either find the existing team
//   // or create a new one if it doesn't exist.
//   //   console.log(
//   //     `Getting or creating a team for player(s): ${player1Id} ${player2Id}`
//   //   )
//   const team = await getOrCreateTeam(player1Id, player2Id ? player2Id : null)
//   //   console.log('🚀 ~ team getOrCreateTeam:', team)

//   // Step 2: Check if we have a team (either found or newly created).
//   if (team && team.id) {
//     // console.log(`Using team ID: ${team.id}`)

//     // Step 3: Immediately use the team.id to register it to the tournament.
//     await addTeamToTournament(tournamentId, team.id)

//     // Step 4: Refresh the local state to show the new participant.
//     //   console.log("🚀 ~ teamLinked:", teamLinked)
//     // await fetchTeamsFromCurrentTournament()

//     // console.log(
//     //   `Team ${team.id} successfully registered to tournament ${tournamentId}.`
//     // )
//     return team // Return the team for any further UI updates
//   } else {
//     console.error(
//       'Failed to get or create the team. Cannot register to the tournament.'
//     )
//     return null
//   }
// }
