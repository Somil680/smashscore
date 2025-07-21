// // import { TeamWithPlayers } from "@/components/startMatch/ScoreEntryCard"

// import { TeamWithPlayers } from "@/store/type"

//  export  const getTeamDetails = (
//     team: Partial<TeamWithPlayers>
//   ): {
//     teamName: string
//     playerImages: (string | undefined)[]
//     teamId: string | undefined
//   } => {
//     // Default values for fallback
//     const defaultDetails = {
//       teamName: `Team (${team?.id?.substring(0, 6)}...)` || 'TBA',
//       playerImages: [],
//       teamId: team?.id,
//     }

//     // Defensive Check: If team or player_1 object is missing, fallback gracefully.
//     if (!team || !team.player_1) {
//       return defaultDetails
//     }

//     const images: (string | undefined)[] = []
//     let teamName = ''

//     // Add player 1's info
//     images.push(team.player_1.image_url)
//     teamName = team.player_1.name

//     // For doubles, add player 2's info
//     if (team.player_2) {
//       images.push(team.player_2.image_url)
//       teamName = `${team.player_1.name} & ${team.player_2.name}`
//     }

//     return {
//       teamName,
//       playerImages: images,
//       teamId: team.id,
//     }
//   }
import { TeamWithPlayers } from '@/store/type' // Adjust path as needed

/**
 * A helper function that safely extracts display details from a Team object.
 * @param team - The full Team object, potentially with nested player data.
 * @returns An object with the team's name, player images, and ID.
 */
export const getTeamDetails = (
  team: TeamWithPlayers // This is the fix: Accept the full TeamWithPlayers type
): {
  teamName: string
  playerImages: (string)[]
  teamId: string | undefined
} => {
  // Default values for fallback
  const defaultDetails = {
    teamName: `Team (${team?.id?.substring(0, 6)}...)` || 'TBA',
    playerImages: [],
    teamId: team?.id,
  }

  // Defensive Check: If team or player_1 object is missing, fallback gracefully.
  if (!team || !team.player_1) {
    return defaultDetails
  }

  const images: (string | undefined)[] = []
  let teamName = ''

  // Add player 1's info
  images.push(team.player_1.image_url?? "")
  teamName = team.player_1.name

  // For doubles, add player 2's info (handles if player_2 is null)
  if (team.player_2) {
    images.push(team.player_2.image_url ?? "")
    teamName = `${team.player_1.name} & ${team.player_2.name}`
  }

  return {
    teamName,
    playerImages: images,
    teamId: team.id,
  }
}
