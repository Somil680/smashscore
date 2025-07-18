import { TeamWithPlayers } from "@/components/startMatch/ScoreEntryCard"

 export  const getTeamDetails = (
    team: Partial<TeamWithPlayers>
  ): {
    teamName: string
    playerImages: (string | undefined)[]
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
    images.push(team.player_1.image_url)
    teamName = team.player_1.name

    // For doubles, add player 2's info
    if (team.player_2) {
      images.push(team.player_2.image_url)
      teamName = `${team.player_1.name} & ${team.player_2.name}`
    }

    return {
      teamName,
      playerImages: images,
      teamId: team.id,
    }
  }