import { Team } from "@/store/type";

export interface PlayoffFixtureData {
  tournament_id: string;
  team_1_id: string;
  team_2_id: string | null; // team_2_id can be null for a final match
  tag: string;
}

// Define the rich type for a team's calculated statistics
export interface TeamStats {
    id: string;
    wins: number;
    pointDifference: number;
    team: Team;
}

/**
 * Generates playoff fixtures based on final team rankings.
 * @param topTeams - A sorted array of teams with their calculated stats.
 * @param activeTournamentId - The ID of the current tournament.
 * @returns An array of new playoff match objects.
 */
export function generateTieBreakerFixtures(
  topTeams: Team[], // FIX: Expects the full TeamStats object
  activeTournamentId: string | null
): PlayoffFixtureData[] {
  
  if (!activeTournamentId) return [];

  // Case 1: Exactly 2 teams are provided -> This is the Final
  if (topTeams.length === 3) {
    return [
      {
        tournament_id: activeTournamentId,
        team_1_id: topTeams[0].id,
        team_2_id: topTeams[1].id,
        tag: `Final Match`,
      },
    ];
  }

  // Case 2: 3 or more teams -> Create a Semi-Final and a Final with a placeholder
  if (topTeams.length >= 4) {
    // The teams are assumed to be pre-sorted: Rank 1 is topTeams[0], etc.
    return [
      // The Semi-Final match between Rank 2 and Rank 3
      {
        tournament_id: activeTournamentId,
        team_1_id: topTeams[1].id,
        team_2_id: topTeams[2].id,
        tag: `Semi-Final`,
      },
      // The Final match, with Rank 1 waiting for the winner of the semi-final
      {
        tournament_id: activeTournamentId,
        team_1_id: topTeams[0].id,
        team_2_id: null, // Use null as a placeholder for the winner
        tag: `Final Match`,
      },
    ];
  }

  // No valid case for generating playoffs
  return [];
}
