// 'use client'
import { useEffect } from 'react'
import { generateTieBreakerFixtures } from './TieBreaker'
import useTournamentStore from '@/store/useTournamentStore'
import { Team } from '@/store/type'

   interface FinalWinnerCheckerProps {
     teamStats: Team[]
   }

export default function FinalWinnerChecker({
  teamStats,
}: FinalWinnerCheckerProps) {
  const { matches, addMatch, activeTournamentId } = useTournamentStore()

  useEffect(() => {
    if (!matches.length || !activeTournamentId) return

    // Check if all non-playoff matches are done
    const groupStageMatches = matches.filter(
      (m) => m.tag !== 'Semi-Final' && m.tag !== 'Final Match'
    )
    const allCompleted = groupStageMatches.every((m) => m.winner_team_id)

    // Check if playoffs have already been created
    const playoffsExist = matches.some((m) => m.tag === 'Semi-Final')
    const playoffsFinalExist = matches.some((m) => m.tag === 'Final Match')

    if (!allCompleted || playoffsExist || playoffsFinalExist) return

    // Generate the fixtures
    const tieMatches = generateTieBreakerFixtures(teamStats, activeTournamentId)

    // Add each new match to the database
    tieMatches.forEach((fixture) => {
      addMatch({
        tournament_id: fixture.tournament_id,
        team_1_id: fixture.team_1_id,
        team_2_id: fixture.team_2_id, // This will be null for the final
        tag: fixture.tag,
      })
    })
  }, [matches , activeTournamentId])

  return null // This component only runs logic, it doesn't render anything
}
