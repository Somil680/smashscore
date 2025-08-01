import { Team } from '@/store/type'

export interface PlayoffFixtureData {
  tournament_id: string
  team_1_id: string
  team_2_id: string | null // team_2_id can be null for a final match
  tag: string
}

// Define the rich type for a team's calculated statistics
export interface TeamStats {
  id: string
  wins: number
  pointDifference: number
  team: Team
}

/**
 * Generates playoff fixtures based on final team rankings.
 * @param topTeams - A sorted array of teams with their calculated stats.
 * @param activeTournamentId - The ID of the current tournament.
 * @returns An array of new playoff match objects.
 */
export function generateTieBreakerFixtures(
  topTeams: Team[],
  activeTournamentId: string | null
): PlayoffFixtureData[] {
  if (!activeTournamentId) {
    console.log('No active tournament ID provided')
    return []
  }

    return [
      {
        tournament_id: activeTournamentId,
        team_1_id: topTeams[0].id,
        team_2_id: topTeams[1].id,
        tag: `Final Match`,
      },
    ]
  
}
