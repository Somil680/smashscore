'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { getTeamDetails } from '@/hooks/helperFunction'
// import { Crown } from 'lucide-react'

export interface Player {
  id: string
  name: string
  image_url?: string
}

export interface Team {
  id: string
  player_1_id: string
  player_2_id?: string
}

export interface TeamWithPlayers extends Team {
  player_1: Player
  player_2: Player | null // player_2 is null for singles
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
export interface MatchWithDetails {
  id: string
  tournament_id: string
  tag?: string
  team_1: TeamWithPlayers
  team_2: TeamWithPlayers
  // other match fields...
}

// Props for our new ScoreCard component
interface ScoreCardProps {
  match: MatchWithDetails
  max_game_set: number
  onSave: (
    match: Match,
    scoresToSave: {
      game_number: number
      team_1_score: number
      team_2_score: number
    }[],
    winnerTeamId: string
  ) => void
}

export default function ScoreEntryCard({
  match,
  onSave,
  max_game_set,
}: ScoreCardProps) {
  
  const team1Details = getTeamDetails(match.team_1)
  const team2Details = getTeamDetails(match.team_2)

  const [scoresA, setScoresA] = React.useState<number[]>([])
  const [scoresB, setScoresB] = React.useState<number[]>([])
  const [completed, setCompleted] = React.useState(false)
  const [winner, setWinner] = React.useState<string | null>(null)

  React.useEffect(() => {
    setScoresA(Array(max_game_set).fill(0))
    setScoresB(Array(max_game_set).fill(0))
    setCompleted(false)
    setWinner(null)
  }, [max_game_set])

  function handleChange(idx: number, val: string, which: 'a' | 'b') {
    const v = Math.max(0, parseInt(val) || 0)
    if (which === 'a') {
      setScoresA((prev) => prev.map((s, i) => (i === idx ? v : s)))
    } else {
      setScoresB((prev) => prev.map((s, i) => (i === idx ? v : s)))
    }
  }

  function handleSave() {
    const winsA = scoresA.filter((a, i) => a > scoresB[i]).length
    console.log('🚀 ~ handleSave ~ winsA:', winsA)
    const winsB = scoresB.filter((b, i) => b > scoresA[i]).length
    console.log('🚀 ~ handleSave ~ winsB:', winsB)
    const winnerId =
      winsA > winsB
        ? team1Details.teamId
        : winsA < winsB
        ? team2Details.teamId
        : 'Draw'
    const scoresToSave = scoresA.map((s1, index) => ({
      game_number: index + 1,
      team_1_score: s1,
      team_2_score: scoresB[index],
    }))
    onSave(match, scoresToSave, winnerId ?? '')
    setWinner(winnerId ?? '')
    setCompleted(true)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl shadow-xl p-8 bg-white/90 dark:bg-[#181f2a] flex flex-col gap-6 items-center border-2 ${
        completed ? 'border-lime-400' : 'border-blue-400'
      } transition-all duration-300`}
    >
      {/* {completed && winner && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <SparklesCore
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={90}
            className="w-full h-full"
            particleColor="#FFD700"
          />
        </div>
      )} */}

      <div className="w-full flex justify-between items-center">
        <span className="text-sm font-medium text-gray-500">{match.tag}</span>
        {/* {isFinal && (
          <span className="text-sm font-bold px-3 py-1 bg-gradient-to-tr from-yellow-400 to-orange-500 text-white rounded-full shadow">
            FINAL MATCH 🏆
          </span>
        )} */}
      </div>

      <div className="flex gap-8 items-center text-xl font-bold relative z-10">
        <div className="flex flex-col items-center gap-2 relative">
          <span className="text-gray-900 dark:text-white text-base font-semibold mt-1">
            {team1Details.teamName.toUpperCase()}
          </span>
          {winner === team1Details.teamId && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="absolute -top-6"
            >
              <Crown size={28} className="text-yellow-400" />
            </motion.div>
          )}
        </div>
        <span className="text-2xl text-gray-400 font-extrabold">vs</span>
        <div className="flex flex-col items-center gap-2 relative">
          <span className="text-gray-900 dark:text-white text-base font-semibold mt-1">
            {team2Details.teamName.toUpperCase()}
          </span>
          {winner === team2Details.teamId && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="absolute -top-6"
            >
              <Crown size={28} className="text-yellow-400" />
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 justify-center relative z-10">
        {Array.from({ length: max_game_set }, (_, i) => (
          <div key={i} className="flex  items-center gap-2">
            <input
              type="number"
              min={0}
              //   value={scoresA[i] }
              onChange={(e) => handleChange(i, e.target.value, 'a')}
              className="w-16 rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-[#232c3b] px-2 py-2 text-center font-bold text-blue-600 dark:text-lime-400 text-lg shadow focus:ring-2 focus:ring-lime-400 transition-all"
              disabled={completed}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Game {i + 1}
            </span>
            <input
              type="number"
              min={0}
              //   value={scoresB[i]}
              onChange={(e) => handleChange(i, e.target.value, 'b')}
              className="w-16 rounded-lg border-2 border-lime-200 dark:border-lime-600 bg-white/80 dark:bg-[#232c3b] px-2 py-2 text-center font-bold text-lime-600 dark:text-blue-400 text-lg shadow focus:ring-2 focus:ring-blue-400 transition-all"
              disabled={completed}
            />
          </div>
        ))}
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        className={`mt-4 px-8 py-3 rounded-xl bg-gradient-to-tr from-lime-400 to-blue-500 text-white font-bold shadow-lg hover:scale-105 transition-transform text-lg ${
          completed ? 'opacity-60 cursor-not-allowed' : ''
        }`}
        disabled={completed || !(scoresA && scoresB) }
      >
        {completed ? 'Saved! ' : 'Save Result'}
      </motion.button>
    </motion.div>
  )
}
