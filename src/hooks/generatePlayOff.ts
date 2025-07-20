// utils/generatePlayoffs.ts

// These types should be imported from your store or a central types file
export interface Team {
  id: string
  // ... other team properties
}

export interface Match {
  id: string
  team_1_id: string
  team_2_id: string
  winner_team_id?: string
  // ... other match properties
}

export interface MatchScore {
  match_id: string
  team_1_score: number
  team_2_score: number
  // ... other score properties
}

export interface PlayoffFixture {
  teamA: Team
  teamB: Team | null // teamB can be null for a final (e.g., "Winner of Semi")
  tag: 'Semi-Final' | 'Final'
}

/**
 * Calculates team standings and generates playoff fixtures (semi-final and final).
 * Assumes the top-ranked team gets a bye to the final, and 2nd plays 3rd in the semi.
 * @param teams - An array of all teams that participated in the group stage.
 * @param matches - An array of all completed matches from the group stage.
 * @param scores - An array of all game scores from all matches.
 * @returns An array of new playoff fixtures.
 */
export function generatePlayoffFixtures(
  teams: Team[],
  matches: Match[],
  scores: MatchScore[]
): PlayoffFixture[] {
  // 1. Initialize stats for each team
  const teamStats: {
    [key: string]: { wins: number; pointDifference: number; team: Team }
  } = {}
  for (const team of teams) {
    teamStats[team.id] = { wins: 0, pointDifference: 0, team }
  }

  // 2. Calculate wins and point differences from all matches
  for (const match of matches) {
    if (!match.winner_team_id) continue // Skip matches that weren't completed

    // --- Calculate Wins ---
    teamStats[match.winner_team_id].wins += 1

    // --- Calculate Point Difference ---
    const matchScores = scores.filter((s) => s.match_id === match.id)
    let totalPoints1 = 0
    let totalPoints2 = 0

    for (const gameScore of matchScores) {
      totalPoints1 += gameScore.team_1_score
      totalPoints2 += gameScore.team_2_score
    }

    const pointDiff = totalPoints1 - totalPoints2

    // Add point difference to each team's total
    teamStats[match.team_1_id].pointDifference += pointDiff
    teamStats[match.team_2_id].pointDifference -= pointDiff
  }

  // 3. Rank the teams
  const rankedTeams = Object.values(teamStats).sort((a, b) => {
    // Sort by wins first (descending)
    if (b.wins !== a.wins) {
      return b.wins - a.wins
    }
    // If wins are tied, sort by point difference (descending)
    return b.pointDifference - a.pointDifference
  })
  console.log("🚀 ~ rankedTeams ~ rankedTeams:", rankedTeams)

  console.log('Ranked Teams:', rankedTeams)

    
  // 4. Check if there are enough ranked teams to generate playoffs
  if (rankedTeams.length < 3) {
    console.warn('Not enough teams to generate semi-finals and finals.')
    return []
  }

  // 5. Generate the new playoff fixtures
  const playoffFixtures: PlayoffFixture[] = []

  const rank1 = rankedTeams[0].team
  const rank2 = rankedTeams[1].team
  const rank3 = rankedTeams[2].team

  // Semi-Final: Rank 2 vs Rank 3
  playoffFixtures.push({
    teamA: rank2,
    teamB: rank3,
    tag: 'Semi-Final',
  })

  // Final: Rank 1 vs Winner of Semi-Final (TBA)
  playoffFixtures.push({
    teamA: rank1,
    teamB: null, // Winner is to be announced
    tag: 'Final',
  })

  return playoffFixtures
}
