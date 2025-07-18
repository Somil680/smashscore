'use client'
import React, { useEffect, useMemo } from 'react'
import ScoreEntryCard from './ScoreEntryCard'
import { useBadmintonStore } from '@/store/useBadmintonStore'
import { Trophy, Calendar, Users, ListChecks, Play } from 'lucide-react'
import FinalWinnerChecker from './FinalWinnerChecker'
import { getTeamDetails } from '@/hooks/helperFunction'
// import { generatePlayoffFixtures } from '@/hooks/generatePlayOff'
export interface Team {
  id: string
  // ... other team properties
}

export interface Match {
  id: string
  team_1_id: string
  team_2_id: string
  winner_team_id?: string
  tournament_id: string
  tag?: string
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

const MatchCreate = () => {
  const {
    tournaments,
    activeTournamentId,
    activeTeams,
    matches,
    activeTournamentParticipants,
    fetchMatchesForTournament,
    finishMatch,
    updateMatch,
    matchScores,
    fetchTournamentsParticipants,
    teams,
    setTournamentWinner,
  } = useBadmintonStore()
    console.log("🚀 ~ MatchCreate ~ matches:", matches)

  useEffect(() => {
    if (!activeTournamentId || activeTeams.length === 0) return
    fetchMatchesForTournament(activeTournamentId)
    fetchTournamentsParticipants(activeTournamentId)
  }, [activeTournamentId, fetchMatchesForTournament])

  const { groupStageCompleted, playoffsExist, finalMatch } = useMemo(() => {
    if (matches.length === 0)
      return {
        groupStageCompleted: false,
        playoffsExist: false,
        finalMatch: null,
      }

    const groupStageMatches = matches.filter(
      (m) => m.tag !== 'Semi-Final' && m.tag !== 'Final Match'
    )
    const semiFinalMatch = matches.find((m) => m.tag === 'Semi-Final')
    const finalMatch = matches.find((m) => m.tag === 'Final Match')

    return {
      groupStageCompleted: groupStageMatches.every(
        (match) => !!match.winner_team_id
      ),
      playoffsExist: !!semiFinalMatch,
      finalMatch: finalMatch || null,
    }
  }, [matches])



  const teamStats = useMemo(() => {
    if (activeTeams.length === 0) return []

    // This logic is similar to your generatePlayoffFixtures function
    const stats = activeTeams.map((team) => ({
      id: team.id,
      wins: 0,
      pointDifference: 0,
      team,
    }))

    for (const match of matches) {
      if (!match.winner_team_id) continue

      const winnerIndex = stats.findIndex((t) => t.id === match.winner_team_id)
      if (winnerIndex !== -1) {
        stats[winnerIndex].wins += 1
      }

      const matchScoresForThisMatch = matchScores.filter(
        (s) => s.match_id === match.id
      )
      let totalPoints1 = 0
      let totalPoints2 = 0

      for (const game of matchScoresForThisMatch) {
        totalPoints1 += game.team_1_score
        totalPoints2 += game.team_2_score
      }

      const pointDiff = totalPoints1 - totalPoints2
      const team1Index = stats.findIndex((t) => t.id === match.team_1_id)
      const team2Index = stats.findIndex((t) => t.id === match.team_2_id)

      if (team1Index !== -1) stats[team1Index].pointDifference += pointDiff
      if (team2Index !== -1) stats[team2Index].pointDifference -= pointDiff
    }

    // Sort the stats for display
    return stats.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins
      return b.pointDifference - a.pointDifference
    })
  }, [matches, matchScores, activeTeams])

  // const handleSaveResult = (
  //   match: Match,
  //   scoresMatch: {
  //     game_number: number
  //     team_1_score: number
  //     team_2_score: number
  //   }[],
  //   winnerTeamId: string
  // ) => {
  //   finishMatch(match.id, winnerTeamId, scoresMatch)
  // }

  //   function generatePlayoffFixtures(
  //   teams: Team[],
  //   matches: Match[],
  //   scores: MatchScore[]
  // ): PlayoffFixture[] {
  //   // 1. Initialize stats for each team
  //   const teamStats: { [key: string]: { wins: number; pointDifference: number; team: Team } } = {}

  //   for (const team of teams) {
  //     teamStats[team.id] = { wins: 0, pointDifference: 0, team }
  //   }

  //   // 2. Calculate wins and point differences from all matches
  //   for (const match of matches) {
  //     if (!match.winner_team_id) continue // Skip matches that weren't completed

  //     // --- Calculate Wins ---
  //     teamStats[match.winner_team_id].wins += 1

  //     // --- Calculate Point Difference ---
  //     const matchScores = scores.filter((s) => s.match_id === match.id)
  //     let totalPoints1 = 0
  //     let totalPoints2 = 0

  //     for (const gameScore of matchScores) {
  //       totalPoints1 += gameScore.team_1_score
  //       totalPoints2 += gameScore.team_2_score
  //     }

  //     const pointDiff = totalPoints1 - totalPoints2

  //     // Add point difference to each team's total
  //     teamStats[match.team_1_id].pointDifference += pointDiff
  //     teamStats[match.team_2_id].pointDifference -= pointDiff
  //   }

  //   // 3. Rank the teams
  //   const rankedTeams = Object.values(teamStats).sort((a, b) => {
  //     // Sort by wins first (descending)
  //     if (b.wins !== a.wins) {
  //       return b.wins - a.wins
  //     }
  //     // If wins are tied, sort by point difference (descending)
  //     return b.pointDifference - a.pointDifference
  //   })

  //   console.log('🚀 ~ rankedTeams ~ teamStats:', teamStats)
  //   console.log('Ranked Teams:', rankedTeams)

  //   // 4. Check if there are enough ranked teams to generate playoffs
  //   if (rankedTeams.length < 3) {
  //     console.warn('Not enough teams to generate semi-finals and finals.')
  //     return []
  //   }

  //   // 5. Generate the new playoff fixtures
  //   const playoffFixtures: PlayoffFixture[] = []

  //   const rank1 = rankedTeams[0].team
  //   const rank2 = rankedTeams[1].team
  //   const rank3 = rankedTeams[2].team

  //   // Semi-Final: Rank 2 vs Rank 3
  //   playoffFixtures.push({
  //     teamA: rank2,
  //     teamB: rank3,
  //     tag: 'Semi-Final',
  //   })

  //   // Final: Rank 1 vs Winner of Semi-Final (TBA)
  //   playoffFixtures.push({
  //     teamA: rank1,
  //     teamB: null, // Winner is to be announced
  //     tag: 'Final',
  //   })

  //   return playoffFixtures
  // }

  // Check if all initial matches are completed

  const allMatchesCompleted = useMemo(() => {
    if (matches.length === 0) return false
    // We only check for matches without a playoff tag
    const groupStageMatches = matches.filter(
      (m) => m.tag !== 'Semi-Final' && m.tag !== 'Final'
    )
    return groupStageMatches.every((match) => !!match.winner_team_id)
  }, [matches])

  const handleSaveResult = (
    match: Match,
    scoresMatch: {
      game_number: number
      team_1_score: number
      team_2_score: number
    }[],
    winnerTeamId: string
  ) => {
    // First, save the result of the match that was just played
    finishMatch(match.id, winnerTeamId, scoresMatch)

    // --- THIS IS THE NEW CONNECTIVITY LOGIC ---
    // If the match that just finished was a semi-final...
    if (match.tag === 'Semi-Final') {
      // Find the final match (the one with a null opponent)
      const finalMatch = matches.find(
        (m) => m.tag === 'Final Match' && m.team_2_id === null
      )

      if (finalMatch) {
        console.log(
          `Updating Final Match (${finalMatch.id}) with winner: ${winnerTeamId}`
        )
        // Update the final match to set team_2_id to the winner of the semi-final
        updateMatch(finalMatch.id, { team_2_id: winnerTeamId })
      }
    }
  }
  
  const handleDeclareWinner = () => {
    if (finalMatch && finalMatch.winner_team_id && activeTournamentId) {
      setTournamentWinner(activeTournamentId, finalMatch.winner_team_id)
    } else {
      alert('Final match is not yet complete.')
    }
  }
  // useEffect(() => {
  //   if (!allMatchesCompleted) return
  //   teamStats.sort((a, b) => {
  //     if (b.wins !== a.wins) {
  //       return b.wins - a.wins
  //     }
  //     return b.pointDifference - a.pointDifference
  //   })
  //   const tieMatches = generateTieBreakerFixtures(
  //     teamStats,
  //     activeTeams,
  //     activeTournamentId
  //   )
  //   console.log('🚀 ~ useEffect ~ tieMatches:', tieMatches)
  // }, [allMatchesCompleted])
  console.log('🚀 ~ teamStats.sort ~ teamStats:', teamStats)

  // const handleGeneratePlayoffs = async () => {
  //   if (!activeTournamentId) return

  //   // Generate the new fixtures
  //   const newFixtures = generatePlayoffFixtures(
  //     activeTeams,
  //     matches,
  //     matchScores
  //   )

  //   // Save the new matches to the database
  //   for (const fixture of newFixtures) {
  //     await addMatch({
  //       tournament_id: activeTournamentId,
  //       team_1_id: fixture.teamA.id,
  //       // For the final, teamB is initially null
  //       team_2_id: fixture.teamB ? fixture.teamB.id : null,
  //       tag: fixture.tag,
  //     })
  //   }
  //   // Refresh the match list to show the new playoff matches
  //   fetchMatchesForTournament(activeTournamentId)
  // }

  return (
    <div className="space-y-4 ">
      <div className="bg-gradient-to-r from-lime-400 via-blue-500 to-purple-400 p-[2px] rounded-2xl">
        <div className="bg-[#111827] rounded-2xl p-5 text-white">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Trophy size={20} /> {tournaments[0].name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                Created:{' '}
                {new Date(tournaments[0].created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Type: {tournaments[0].tournament_type}</span>
            </div>
            <div className="flex items-center gap-2">
              <ListChecks size={16} />
              <span>Match Type: {tournaments[0].match_type}</span>
            </div>
            <div className="flex items-center gap-2">
              <ListChecks size={16} />
              <span>
                Points/Game: <strong>{21}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ListChecks size={16} />
              <span>
                Max Game Sets: <strong>{1}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
      {matches.map((match) => (
        <ScoreEntryCard
          key={match.id}
          match={match}
          max_game_set={1}
          onSave={(match, scores, winnerId) => {
            handleSaveResult(match, scores, winnerId)
          }}
        />
      ))}
      {/* Render the button to generate playoffs */}
      {finalMatch &&
        finalMatch.winner_team_id &&
        !tournaments[0].winner_team_id && (
          <div className="flex justify-center py-4">
            <button
              onClick={handleDeclareWinner}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg"
            >
              <Trophy size={20} />
              Declare Final Tournament Winner
            </button>
          </div>
        )}
      <FinalWinnerChecker teamStats={teamStats} />
      <div className="flex  flex-wrap gap-4">
        {teamStats
          .sort((a, b) => b.pointDifference - a.pointDifference)
          .map((team) => {
              const name = activeTournamentParticipants.filter((id) => id.team_id === team.id)
              console.log("🚀 ~ .map ~ name:", name)
              const team1Details = getTeamDetails(name[0]?.team)
          return (
            <div
              key={team.id}
              className="bg-transparent text-white p-[1px] rounded-xl w-full max-w-[190px]"
            >
              <div className="bg-[#111827] rounded-xl px-3 py-2 flex flex-col border border-transparent bg-clip-padding">
                <h3 className="text-sm font-semibold text-white">
                  {team1Details.teamName}
                </h3>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-lime-400 font-medium">
                    Points: {team.pointDifference}
                  </span>
                  <span className="text-xs text-blue-500 font-medium">
                    Wins: {team.wins}
                  </span>
                </div>
              </div>
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-lime-400 via-blue-500 to-purple-400 z-[-1]" />
            </div>
          )}
          )}
      </div>
    </div>
  )
}

export default MatchCreate
{
  /* <FinalWinnerChecker /> */
}
{
  /* <Button onClick={() => addDataToDatabase(tournaments , matches , teams)} >
  Complete Tournament
</Button> */
}
{
  /* <div className="flex  flex-wrap gap-4">
  {teams
    .sort((a, b) => b.totalPointsScored - a.totalPointsScored)
    .map((team) => (
      <div
        key={team.id}
        className="bg-transparent text-white p-[1px] rounded-xl w-full max-w-[190px]"
      >
        <div className="bg-[#111827] rounded-xl px-3 py-2 flex flex-col border border-transparent bg-clip-padding">
          <h3 className="text-sm font-semibold text-white">
            {team.name}
          </h3>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-lime-400 font-medium">
              Points: {team.totalPointsScored}
            </span>
            <span className="text-xs text-blue-500 font-medium">
              Wins: {2}
            </span>
          </div>
        </div>
        <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-lime-400 via-blue-500 to-purple-400 z-[-1]" />
      </div>
    ))}
</div> */
}
// const activeTournament = useBadmintonStore((state) =>
//   state.tournaments.find((t) => t.id === state.activeTournamentId)
// )
// console.log("🚀 ~ MatchCreate ~ activeTournament:", activeTournament)

// const [fixtures, setFixtures] = useState<Fixture[]>([])
// console.log("🚀 ~ MatchCreate ~ fixtures:", fixtures)

// This function generates the fixtures but doesn't save them yet
// const handleGenerateFixtures = () => {
//   if (!activeTournament || activeTeams.length < 2) {
//     alert(
//       'Cannot generate fixtures. Make sure a tournament is active and has at least 2 teams.'
//     )
//     return
//   }
//   const generated = generateFixtures(
//     activeTournament.tournament_type,
//     activeTeams
//   )
//   setFixtures(generated)
// }

// This function takes the generated fixtures and saves them to the database
// const handleConfirmAndCreateMatches = async () => {
//   if (!activeTournamentId || fixtures.length === 0) {
//     alert('No fixtures to save. Please generate fixtures first.')
//     return
//   }

//   try {
//     await Promise.all(
//       fixtures.map((fixture) =>
//         addMatch({
//           tournament_id: activeTournamentId,
//           team_1_id: fixture.playerA,
//           team_2_id: fixture.playerB,
//           tag: 'Round 1', // Or determine tag based on tournament type/round
//         })
//       )
//     )
//     alert(`${fixtures.length} matches have been created successfully!`)
//     setFixtures([]) // Clear fixtures after saving
//   } catch (error) {
//     alert(
//       'An error occurred while creating the matches. Please check the console.'
//     )
//     console.error('Failed to create matches:', error)
//   }
// }
