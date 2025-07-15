// // components/FinalWinnerChecker.tsx

// 'use client'

// import React from 'react'
// import { useSmashScoreStore } from '@/store/useSmashScoreStore'
// import {
//   calculateTeamWins,
//   getTopTeamsByWins,
//   generateTieBreakerFixtures,
// } from './TieBreaker'
// import { v4 as uuidv4 } from 'uuid'

// export default function FinalWinnerChecker() {
//   const {
//     matches,
//     tournaments,
//     currentTournamentId,
//     addMatch,
//     selectMatch,
//     selectTournament,
//     setInitialTournament,
//   } = useSmashScoreStore()

//   const tournament = tournaments.find((t) => t.id === currentTournamentId)

//   const allCompleted = matches.every((m) => m.winnerteam_id)
//   const teamWins = calculateTeamWins(matches)

//   const [winnerId, setWinnerId] = React.useState<string | null>(null)
//   const [tieBreakFixtures, setTieBreakFixtures] = React.useState<
//     { team1Id: string; team2Id: string }[]
//   >([])

//   React.useEffect(() => {
//     if (!allCompleted || !tournament) return

//     const winCounts = calculateTeamWins(matches)
//     const topTeams = getTopTeamsByWins(winCounts, 4)

//     const topWinCount = winCounts[topTeams[0]]
//     const sameScoreTeams = topTeams.filter(
//       (id) => winCounts[id] === topWinCount
//     )

//     if (sameScoreTeams.length === 1) {
//       // We have a winner!
//       setWinnerId(sameScoreTeams[0])
//     } else {
//       // Generate tie-breaker fixtures
//       const tiebreakerFixtures = generateTieBreakerFixtures(sameScoreTeams)
//       setTieBreakFixtures(tiebreakerFixtures)

//       // Add new matches
//       tiebreakerFixtures.forEach((fixture) => {
//         addMatch({
//           id: uuidv4(),
//           tournamentId: tournament.id,
//           team1Id: fixture.team1Id,
//           team2Id: fixture.team2Id,
//           team1_score: [],
//           team2_score: [],
//         //   winnerteam_id: '',
//         //   synced: false,
//         })
//       })
//     }
//   }, [allCompleted, matches, tournament])

//   return (
//     <div className="p-4 bg-white dark:bg-[#111827] border rounded-lg shadow">
//       {winnerId ? (
//         <h2 className="text-xl font-bold text-green-600">
//           🏆 Tournament Winner: {winnerId}
//         </h2>
//       ) : tieBreakFixtures.length > 0 ? (
//         <p className="text-yellow-600 font-medium">
//           Tie detected! Added {tieBreakFixtures.length} tie-breaker match(es).
//         </p>
//       ) : (
//         <p className="text-gray-500">Waiting for all matches to complete...</p>
//       )}
//     </div>
//   )
// }
'use client'
import { useEffect } from 'react'
import { useSmashScoreStore } from '@/store/useSmashScoreStore'
import { v4 as uuidv4 } from 'uuid'

// Tie breaker generator
function generateTieBreakerFixtures(topTeams: string[]) {
  console.log("🚀 ~ generateTieBreakerFixtures ~ topTeams:", topTeams)
  if (topTeams.length === 2) {
    return [{ team1Id: topTeams[0], team2Id: topTeams[1] }] // final
  } else if (topTeams.length >= 3) {
    return [
      { team1Id: topTeams[0], team2Id: topTeams[3] }, // semi 1
      { team1Id: topTeams[1], team2Id: topTeams[2] }, // semi 2
    ]
  }
  return []
}

export default function FinalWinnerChecker() {
  const { matches, addMatch, setTournamentWinner } = useSmashScoreStore()

  useEffect(() => {
    if (matches.length === 0) return

    const allCompleted = matches.every((m) => m.winnerteam_id)
    if (!allCompleted) return

    // // 1️⃣ Count wins for each team
    // const winCount: Record<string, number> = {}
    // matches.forEach((match) => {
    //   const winner = match.winnerteam_id
    //   if (winner) {
    //     winCount[winner] = (winCount[winner] || 0) + 1
    //   }
    // })
    // console.log("🚀 ~ useEffect ~ winCount:", winCount)

    // // 2️⃣ Find top winners
    // const sortedTeams = Object.entries(winCount)
    // .sort((a, b) => b[1] - a[1])
    // .map(([teamId]) => teamId)

    // console.log("🚀 ~ useEffect ~ sortedTeams:", sortedTeams)
    // const topScore = winCount[sortedTeams[0]]
    //   console.log("🚀 ~ useEffect ~ topScore:", topScore)

    // const topTeams = sortedTeams.filter((id) => winCount[id] === topScore )
    // console.log("🚀 ~ useEffect ~ topTeams:", topTeams)
    // 🏆 1️⃣ Count wins for each team
    const winCount: Record<string, number> = {}
    matches.forEach((match) => {
      const winner = match.winnerteam_id
      if (winner) {
        winCount[winner] = (winCount[winner] || 0) + 1
      }
    })
    console.log('🏅 winCount:', winCount)

    // 🥇 2️⃣ Get top score (max wins)
    const maxWins = Math.max(...Object.values(winCount))
    const topByWins = Object.entries(winCount)
      .filter(([teamId, wins]) => {
          console.log("🚀 ~ useEffect ~ teamId:", teamId)
          return wins === maxWins
      })
      .map(([teamId]) => teamId)
    console.log('🎯 Teams with max wins:', topByWins)

    // 🧮 3️⃣ Use totalPointsScored to break ties
    // You should already have access to teams from the store
    const { teams } = useSmashScoreStore.getState() // or use inside component

    const topTeams = topByWins
      .map((id) => {
        const team = teams.find((t) => t.id === id)
        return {
          id,
          totalPointsScored: team?.totalPointsScored || 0,
        }
      })
      .sort((a, b) => b.totalPointsScored - a.totalPointsScored) // sort by score desc
      .map((team) => team.id)

    console.log('🏆 Final sorted topTeams by score:', topTeams)

    // 3️⃣ Decide what to do
    if (topTeams.length === 1) {
      setTournamentWinner(topTeams[0]) // ✅ clear winner
    } else {
      const semiFinalTeams = topTeams.slice(0, 2) // pick top 4 for semifinals

      const tieMatches = generateTieBreakerFixtures(semiFinalTeams)
      tieMatches.forEach(({ team1Id, team2Id }) => {
        addMatch({
          id: uuidv4(),
          tournamentId: matches[0].tournamentId,
          team1Id,
          team2Id,
          team1_score: [],
          team2_score: [],
          //   winnerteam_id: '',
          //   synced: false,
        })
      })
    }
  }, [matches])

  return null
}
