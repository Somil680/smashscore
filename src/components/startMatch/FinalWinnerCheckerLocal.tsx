'use client'
import { useEffect } from 'react'
import { generateTieBreakerFixtures } from './TieBreaker'
import useLocalTournamentStore from '@/store/useLocalTournamentStore'
import { Team, TeamWithPlayers } from '@/store/type'

interface FinalWinnerCheckerLocalProps {
  teamStats: Team[]
}

export default function FinalWinnerCheckerLocal({
  teamStats,
}: FinalWinnerCheckerLocalProps) {
  const {
    currentMatches,
    addLocalMatch,
    currentTournament,
    currentTournamentParticipants,
    checkAllMatchesCompleted,
    setTournamentWinner,
  } = useLocalTournamentStore()

  // Calculate wins for each team
  const getTeamWins = (teamId: string): number => {
    return currentMatches.filter(
      (match) =>
        match.winner_team_id === teamId &&
        match.tag !== 'Semi-Final' &&
        match.tag !== 'Final Match'
    ).length
  }

  // Find team with players by ID
  const findTeamWithPlayers = (teamId: string): TeamWithPlayers | null => {
    const participant = currentTournamentParticipants.find(
      (p) => p.team_id === teamId
    )
    return participant ? participant.team : null
  }

  // Generate final match between top 2 teams
  const generateFinalMatch = () => {
    // Sort teams by wins first, then by point difference
    const teamsWithStats = teamStats.map((team) => ({
      team,
      wins: getTeamWins(team.id),
      pointDifference: 0, // We'll calculate this if needed
    }))

    // Sort by wins (highest first), then by point difference if wins are equal
    const sortedTeams = teamsWithStats.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins
      return b.pointDifference - a.pointDifference
    })

    const topTeams = sortedTeams.map((item) => item.team)

    if (currentTournament?.final_match) {
      const tieMatches = generateTieBreakerFixtures(
        topTeams,
        currentTournament!.id
      )
      tieMatches.forEach((fixture) => {
        const team1 = findTeamWithPlayers(fixture.team_1_id)
        const team2 = fixture.team_2_id
          ? findTeamWithPlayers(fixture.team_2_id)
          : null

        if (team1) {
          addLocalMatch({
            tournament_id: fixture.tournament_id,
            team_1_id: fixture.team_1_id,
            team_2_id: fixture.team_2_id,
            tag: fixture.tag,
            team_1: team1,
            team_2: team2,
            winner_team_id: undefined,
          })
        }
      })
    } else {
       const teamsWithWins = teamStats.map((team) => ({
         team,
         wins: getTeamWins(team.id),
       }))

       // Sort by wins (highest first)
       const sortedTeams = teamsWithWins.sort((a, b) => b.wins - a.wins)

       if (sortedTeams.length > 0) {
         const winnerTeam = findTeamWithPlayers(sortedTeams[0].team.id)
         if (winnerTeam) {
           setTournamentWinner(winnerTeam)
         }
       }
    }

    setTimeout(() => checkAllMatchesCompleted(), 100)
  }

  useEffect(() => {
    if (!currentTournament ||!currentTournamentParticipants.length ||!teamStats.length
    ) {
      console.log('Missing required data, returning early')
      return
    }
    // Check if all group stage matches are completed
    const groupStageMatches = currentMatches.filter(
      (m) => m.tag !== 'Semi-Final' && m.tag !== 'Final Match'
    )
    // If there are no group stage matches, we can proceed (tournament might start with finals)
    const allGroupStageCompleted =
      groupStageMatches.length === 0 ||
      groupStageMatches.every((m) => m.winner_team_id)


    // Check if playoffs already exist
    const playoffsExist = currentMatches.some(
      (m) => m.tag === 'Semi-Final' || m.tag === 'Final Match'
    )

    // Exit if group stage not completed or playoffs already exist
    if (!allGroupStageCompleted || playoffsExist) {
      console.log(
        'Exiting: group stage not completed or playoffs already exist'
      )
      return
    }

    generateFinalMatch()

  }, [
    currentMatches,
    checkAllMatchesCompleted,
    setTournamentWinner,
  ])

  return null
}
