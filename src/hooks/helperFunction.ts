import { TeamWithPlayers } from '@/store/type' // Adjust path as needed

/**
 * A helper function that safely extracts display details from a Team object.
 * @param team - The full Team object, potentially with nested player data.
 * @returns An object with the team's name, player images, and ID.
 */
export const getTeamDetails = (
  team: TeamWithPlayers | null
): {
  teamName: string
  playerImages: string[] // This signature is now correct
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
  images.push(team.player_1.image_url) // image_url can be string or null/undefined
  teamName = team.player_1.name

  // For doubles, add player 2's info (handles if player_2 is null)
  if (team.player_2) {
    images.push(team.player_2.image_url) // image_url can be string or null/undefined
    teamName = `${team.player_1.name} & ${team.player_2.name}`
  }

  return {
    teamName,
    // FIX: Filter out any null or undefined values from the images array.
    // This ensures the returned array is of type 'string[]', matching the signature.
    playerImages: images.filter((img): img is string => !!img),
    teamId: team.id,
  }
}
