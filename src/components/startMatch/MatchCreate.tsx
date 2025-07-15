// // 'use client'
// // import { useSmashScoreStore } from '@/store/useSmashScoreStore'
// // import React from 'react'
// // import ScoreEntryCard from './ScoreEntryCard'

// // const MatchCreate = () => {
// //   const { matches, recordMatchResult } = useSmashScoreStore()
// //   return (
// //     <div className="space-y-4">
// //       {matches.map((match) => (
// //         <ScoreEntryCard
// //           key={match.id}
// //           playerA={match.team1Id}
// //           playerB={match.team2Id}
// //           max_game_set={ 3}
// //           onSave={(scores, winnerId) => {
// //             console.log("🚀 ~ MatchCreate ~ winnerId:", winnerId)
// //             console.log("🚀 ~ MatchCreate ~ scores:", scores)
// //             recordMatchResult(match.id, scores, winnerId)
// //           }}
// //         />
// //       ))}
// //     </div>
// //   )
// // }

// // export default MatchCreate
// 'use client'
// import { useSmashScoreStore } from '@/store/useSmashScoreStore'
// import React, { useEffect, useState } from 'react'
// import ScoreEntryCard from './ScoreEntryCard'

// const MatchCreate = () => {
//   const { matches, recordMatchResult } = useSmashScoreStore()
//   const [allDone, setAllDone] = useState(false)

//   useEffect(() => {
//     // Check when all matches have a winner
//     const allCompleted =
//       matches.length > 0 && matches.every((m) => m.winnerteam_id)
//     if (allCompleted) {
//       console.log('🏆 All matches completed')
//       setAllDone(true)
//       // Call tie-breaker/final logic or show final screen
//     }
//   }, [matches])

//   return (
//     <div className="space-y-4">
//       {matches.map((match) => (
//         <ScoreEntryCard
//           key={match.id}
//           playerA={match.team1Id}
//           playerB={match.team2Id}
//           max_game_set={1}
//           onSave={(scores, winnerId) => {
//             recordMatchResult(match.id, scores, winnerId)
//           }}
//         />
//       ))}

//       {allDone && (
//         <div className="text-center mt-6 text-green-600 font-bold text-xl">
//           ✅ All matches completed. Proceed to Final or Tiebreaker.
//         </div>
//       )}
//     </div>
//   )
// }

// export default MatchCreate
'use client'
import { useSmashScoreStore } from '@/store/useSmashScoreStore'
import React, { useEffect, useState } from 'react'
import ScoreEntryCard from './ScoreEntryCard'
import FinalWinnerChecker from './FinalWinnerChecker' // ✅ import it

const MatchCreate = () => {
  const { matches, teams, recordMatchResult , tournaments } = useSmashScoreStore()
  console.log("🚀 ~ MatchCreate ~ teams:", teams)
  console.log("🚀 ~ MatchCreate ~ matches:", matches)
  const [allDone, setAllDone] = useState(false)

  useEffect(() => {
    const allCompleted =
      matches.length > 0 && matches.every((m) => m.winnerteam_id)
    if (allCompleted) {
      setAllDone(true)
    }
  }, [matches])

  return (
    <div className="space-y-4 ">
      <div className="space-y-2 flex flex-wrap  ">
        <div className="flex items-center border-2 rounded-lg border-gray-700 px-3 py-1 ">
          <p className="text-sm font-bold">Max Game Sets</p> &nbsp; : &nbsp;
          <p className="text-sm font-bold">{tournaments[0].max_game_set}</p>
        </div>
        <div className="flex items-center border-2 rounded-lg border-gray-700 px-3 py-1 ">
          <p className="text-sm font-bold">Points</p> &nbsp; : &nbsp;
          <p className="text-sm font-bold">{tournaments[0].points_per_game}</p>
        </div>
        <div className="flex items-center border-2 rounded-lg border-gray-700 px-3 py-1 ">
          <p className="text-sm font-bold">Match Type</p> &nbsp; : &nbsp;
          <p className="text-sm font-bold">{tournaments[0].match_type}</p>
        </div>
        <div className="flex items-center border-2 rounded-lg border-gray-700 px-3 py-1 ">
          <p className="text-sm font-bold">Tournament Type</p> &nbsp; : &nbsp;
          <p className="text-sm font-bold">{tournaments[0].type}</p>
        </div>
        <div className="flex items-center border-2 rounded-lg border-gray-700 px-3 py-1 ">
          <p className="text-sm font-bold">Tournament Name</p> &nbsp; : &nbsp;
          <p className="text-sm font-bold">{tournaments[0].name}</p>
        </div>
        <p className="text-sm font-bold">{tournaments[0].winner_team_id}</p>
      </div>
      {matches.map((match, i) => (
        <ScoreEntryCard
          key={match.id}
          playerA={match.team1Id}
          playerB={match.team2Id}
          max_game_set={tournaments[0].max_game_set}
          matchNumber={i + 1}
          isFinal={i === matches.length - 1}
          onSave={(scores, winnerId) => {
            recordMatchResult(match.id, scores, winnerId)
          }}
        />
      ))}
      {allDone && (
        <div className="text-center mt-6 text-green-600 font-bold text-xl">
          ✅ All matches completed. Proceeding to Tiebreaker or Final...
        </div>
      )}
      <FinalWinnerChecker />{' '}
      {/* ✅ This will trigger tie-breakers or winner setting */}
      {teams
        .sort((a, b) => b.totalPointsScored - a.totalPointsScored)
        .map((team) => (
          <div
            key={team.id}
            className="flex items-center border-2 rounded-lg border-gray-700 px-3 py-1"
          >
            <p className="text-sm font-bold">{team.name}</p> &nbsp; : &nbsp;
            <p className="text-sm font-bold">{team.totalPointsScored}</p>
          </div>
        ))}
    </div>
  )
}

export default MatchCreate
