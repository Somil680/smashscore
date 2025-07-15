// utils/tiebreaker.ts

import { Match } from '@/store/useSmashScoreStore'

// Count team wins from matches
export function calculateTeamWins(matches: Match[]): Record<string, number> {
  const wins: Record<string, number> = {}

  matches.forEach((match) => {
    if (match.winnerteam_id) {
      wins[match.winnerteam_id] = (wins[match.winnerteam_id] || 0) + 1
    }
  })

  return wins
}

// Return top N teams by win count (e.g., 2, 3, or 4)
export function getTopTeamsByWins(
  wins: Record<string, number>,
  topN = 4
): string[] {
  const sorted = Object.entries(wins)
    .sort(([, a], [, b]) => b - a) // sort desc by wins
    .map(([teamId]) => teamId)

  return sorted.slice(0, topN)
}

// Generate fixtures for 2, 3, or 4 team tiebreakers
export function generateTieBreakerFixtures(
  topTeams: string[]
): { team1Id: string; team2Id: string }[] {
  if (topTeams.length === 2) {
    return [{ team1Id: topTeams[0], team2Id: topTeams[1] }] // final
  } else if (topTeams.length === 3 || topTeams.length === 4) {
    return [
      { team1Id: topTeams[0], team2Id: topTeams[1] },
      { team1Id: topTeams[2], team2Id: topTeams[3] },
    ] // semis
  }
  return []
}
