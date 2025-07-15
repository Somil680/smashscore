
'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { useSmashScoreStore } from '@/store/useSmashScoreStore'

export interface Player {
  id: string
  name: string
}

interface ScoreEntryCardProps {
  playerA: string
  playerB: string
  matchNumber: number
  isFinal?: boolean
  max_game_set: number
  onSave: (scores: { a: number[]; b: number[] }, winnerId: string) => void
}

export default function ScoreEntryCard({
  playerA,
  playerB,
  matchNumber,
  isFinal = false,
  max_game_set,
  onSave,
}: ScoreEntryCardProps) {
  const { teams } = useSmashScoreStore()

  const playerAObj = teams.find((p) => p.id === playerA)
  const playerBObj = teams.find((p) => p.id === playerB)

  const [scoresA, setScoresA] = React.useState<number[]>([])
  const [scoresB, setScoresB] = React.useState<number[]>([])
  const [completed, setCompleted] = React.useState(false)
  const [winner, setWinner] = React.useState<string | null>(null)

  React.useEffect(() => {
    setScoresA(Array(max_game_set).fill(0))
    setScoresB(Array(max_game_set).fill(0))
    setCompleted(false)
    setWinner(null)
  }, [max_game_set, playerA, playerB])

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
    console.log("🚀 ~ handleSave ~ winsA:", winsA)
    const winsB = scoresB.filter((b, i) => b > scoresA[i]).length
    console.log("🚀 ~ handleSave ~ winsB:", winsB)
    const winnerId = winsA > winsB ? playerA : winsA < winsB ? playerB :"Draw"
    console.log(
      '🚀 ~ handleSave ~ winnerId:',
      winnerId,
      winsA > winsB,
      winsA < winsB
    )
    onSave({ a: scoresA, b: scoresB }, winnerId)
    setWinner(winnerId)
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
      {completed && winner && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* <SparklesCore
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={90}
            className="w-full h-full"
            particleColor="#FFD700"
          /> */}
        </div>
      )}

      <div className="w-full flex justify-between items-center">
        <span className="text-sm font-medium text-gray-500">
          🏷 Match {matchNumber}
        </span>
        {isFinal && (
          <span className="text-sm font-bold px-3 py-1 bg-gradient-to-tr from-yellow-400 to-orange-500 text-white rounded-full shadow">
            FINAL MATCH 🏆
          </span>
        )}
      </div>

      <div className="flex gap-8 items-center text-xl font-bold relative z-10">
        <div className="flex flex-col items-center gap-2 relative">
          <span className="text-gray-900 dark:text-white text-base font-semibold mt-1">
            {playerAObj?.name}
          </span>
          {winner === playerA && (
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
            {playerBObj?.name}
          </span>
          {winner === playerB && (
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
        disabled={completed}
      >
        {completed ? 'Saved! ' : 'Save Result'}
      </motion.button>
    </motion.div>
  )
}
