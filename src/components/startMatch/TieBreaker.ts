// // utils/tiebreaker.ts

// import { Team } from '@/store/useBadmintonStore'
// import { Match } from '@/store/useSmashScoreStore'

// // Count team wins from matches
// export function calculateTeamWins(matches: Match[]): Record<string, number> {
//   const wins: Record<string, number> = {}

//   matches.forEach((match) => {
//     if (match.winnerteam_id) {
//       wins[match.winnerteam_id] = (wins[match.winnerteam_id] || 0) + 1
//     }
//   })

//   return wins
// }

// // Return top N teams by win count (e.g., 2, 3, or 4)
// export function getTopTeamsByWins(
//   wins: Record<string, number>,
//   topN = 4
// ): string[] {
//   const sorted = Object.entries(wins)
//     .sort(([, a], [, b]) => b - a) // sort desc by wins
//     .map(([teamId]) => teamId)

//   return sorted.slice(0, topN)
// }

// // Generate fixtures for 2, 3, or 4 team tiebreakers
// // export function generateTieBreakerFixtures(
// //   topTeams: string[]
// // ): { team1Id: string; team2Id: string }[] {
// //   if (topTeams.length === 2) {
// //     return [{ team1Id: topTeams[0], team2Id: topTeams[1] }] // final
// //   } else if (topTeams.length === 3 || topTeams.length === 4) {
// //     return [
// //       { team1Id: topTeams[0], team2Id: topTeams[1] },
// //       { team1Id: topTeams[2], team2Id: topTeams[3] },
// //     ] // semis
// //   }
// //   return []
// // }

// /**
//  * Generate tiebreaker fixtures based on top teams and their point scores.
//  * @param topTeams - Array of team IDs considered top.
//  * @param teams - Full list of all teams with point data.
//  * @returns Array of fixture pairs { team1Id, team2Id }
//  */
// export function generateTieBreakerFixtures(
//   topTeams: { id: string; wins: number; pointDifference: number; team: Team }[],
//   // teams: Team[],
//   activeTournamentId: string | null
// ): {
//   tournament_id: string
//   team_1_id: string
//   team_2_id: string
//   tag: string
// }[] {
//   console.log("🚀 ~ topTeams:", topTeams)

//   if (topTeams.length === 3) {
//     // Only 2 teams → Final matc
//     return [
//       {
//         tournament_id: activeTournamentId ?? "",
//         team_1_id: topTeams[0].id,
//         team_2_id: topTeams[1].id,
//         tag: `Final Match`,
//       },
//     ]
//   }

//   if (topTeams.length >= 4) {
//     // 3 teams → Semi: bottom 2; Final: vs top 1 (can be handled in logic later)
//     return [
//       {
//         tournament_id: activeTournamentId ?? "",
//         team_1_id: topTeams[1].id,
//         team_2_id: topTeams[2].id,
//         tag: `Semi Final`,
//       },
//       {
//         tournament_id: activeTournamentId ?? "",
//         team_1_id: topTeams[0].id,
//         team_2_id:  ,
//         tag: `Final Match`,
//       },
//       // Final is not included yet; generated after semi result
//     ]
//   }
//   // No valid case
//   return []
// }
// utils/generateTieBreakerFixtures.ts

// Import your Team type
import { Team } from '@/store/useBadmintonStore';

// Define the shape of the fixture data this function will return
export interface PlayoffFixtureData {
  tournament_id: string;
  team_1_id: string;
  team_2_id: string | null; // team_2_id can now be null
  tag: string;
}

export function generateTieBreakerFixtures(
  topTeams: { id: string; team: Team }[],
  activeTournamentId: string | null
): PlayoffFixtureData[] {
  
  if (!activeTournamentId) return [];

  // Case 1: Exactly 2 teams left -> This is the Final
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

  // Case 2: 3 or more teams left -> Create Semi-Final and a Final with a placeholder
  if (topTeams.length >= 4) {
    return [
      // The Semi-Final match between Rank 2 and Rank 3
      {
        tournament_id: activeTournamentId,
        team_1_id: topTeams[1].id,
        team_2_id: topTeams[2].id,
        tag: `Semi-Final`,
      },
      // The Final match with Rank 1 waiting for the winner
      {
        tournament_id: activeTournamentId,
        team_1_id: topTeams[0].id,
        team_2_id: null, // Use null as a placeholder for the winner
        tag: `Final Match`,
      },
    ];
  }

  // No valid case for playoffs
  return [];
}
