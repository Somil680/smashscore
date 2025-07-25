// import { MatchWithDetails, MatchScore } from '@/store/type'

// /**
//  * Calculates the total matches played, wins, and score for a single team.
//  *
//  * @param {string} teamId - The ID of the team to calculate stats for.
//  * @param {Array} matches - The array of all match objects from the store.
//  * @param {Array} matchScores - The array of all score objects from the store.
//  * @returns {object} An object containing matchesPlayed, totalWins, and totalScore.
//  */
// export function calculateTeamStats(
//   teamId: string,
//   matches: MatchWithDetails[],
//   matchScores: MatchScore[]
// ) {
//   let matchesPlayed = 0
//   let totalWins = 0
//   let totalScore = 0

//   // Find all matches this team participated in
//   const teamMatches = matches.filter(
//     (match) => match.team_1.id === teamId || match.team_2?.id === teamId
//   )

//   // 1. Calculate Matches Played
//   matchesPlayed = teamMatches.length

//   // Loop through only the relevant matches
//   for (const match of teamMatches) {
//     // 2. Calculate Total Wins
//     if (match.winner_team_id === teamId) {
//       totalWins += 1
//     }

//     // 3. Calculate Total Score
//     const scoresForThisMatch = matchScores.filter(
//       (s) => s.match_id === match.id
//     )
//     for (const score of scoresForThisMatch) {
//       if (match.team_1.id === teamId) {
//         totalScore += score.team_1_score
//       } else if (match.team_2?.id === teamId) {
//         totalScore += score.team_2_score
//       }
//     }
//   }

//   return {
//     matchesPlayed,
//     totalWins,
//     totalScore,
//   }
// }

// // --- Example Usage ---
// // const { teams, matches, matchScores } = useTournamentStore();
// // const teamA_Id = 'some-team-uuid';
// // const teamA_Stats = calculateTeamStats(teamA_Id, matches, matchScores);
// // console.log(teamA_Stats);
// // Output: { matchesPlayed: 3, totalWins: 2, totalScore: 115 }
import { MatchWithDetails } from '@/store/type'

/**
 * Calculates matches played, wins, and win probability for a single team.
 *
 * @param {string} teamId - The ID of the team to calculate stats for.
 * @param {Array} matches - The array of all match objects from the store.
 * @param {Array} matchScores - The array of all score objects from the store.
 * @returns {object} An object containing matchesPlayed, totalWins, and winProbability.
 */
export function calculateTeamStats(
  teamId: string,
  matches: MatchWithDetails[],
) {
  let matchesPlayed = 0
  let totalWins = 0

  // Find all matches this team participated in
  const teamMatches = matches.filter(
    (match) => match.team_1.id === teamId || match.team_2?.id === teamId
  )

  // 1. Calculate Matches Played
  matchesPlayed = teamMatches.length

  // 2. Calculate Wins
  for (const match of teamMatches) {
    if (match.winner_team_id === teamId) {
      totalWins += 1
    }
  }

  // 3. Calculate Win Probability
  const winProbability =
    matchesPlayed > 0 ? Number(((totalWins / matchesPlayed)*100).toFixed(0)) : 0

  return {
    matchesPlayed,
    totalWins,
    winProbability,
  }
}
