'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Crown, Zap, CheckCircle } from 'lucide-react'
import { getTeamDetails } from '@/hooks/helperFunction'
import { MatchWithDetails } from '@/store/type'

interface ScoreCardProps {
  match: MatchWithDetails
  max_game_set: number
  onSave: (
    match: MatchWithDetails,
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
  const team1Details = match.team_1
    ? getTeamDetails(match.team_1)
    : { teamName: 'TBA', playerImages: [], teamId: undefined }
  const team2Details = match.team_2
    ? getTeamDetails(match.team_2)
    : { teamName: 'TBA', playerImages: [], teamId: undefined }

  const [scoresA, setScoresA] = React.useState<number[]>([])
  const [scoresB, setScoresB] = React.useState<number[]>([])
  const [completed, setCompleted] = React.useState(!!match.winner_team_id)
  const [winner, setWinner] = React.useState<string | null>(
    match.winner_team_id ?? null
  )

  React.useEffect(() => {
    setScoresA(Array(max_game_set).fill(0))
    setScoresB(Array(max_game_set).fill(0))
    if (match.winner_team_id) {
      setCompleted(true)
      setWinner(match.winner_team_id)
    } else {
      setCompleted(false)
      setWinner(null)
    }
  }, [max_game_set, match.id, match.winner_team_id])

  function handleChange(idx: number, val: string, which: 'a' | 'b') {
    const v = Math.max(0, parseInt(val) || 0)
    if (which === 'a') {
      setScoresA((prev) => prev.map((s, i) => (i === idx ? v : s)))
    } else {
      setScoresB((prev) => prev.map((s, i) => (i === idx ? v : s)))
    }
  }

  function handleSave() {
    if (!team1Details.teamId || !team2Details.teamId) {
      alert('Cannot save result, a team is not yet decided for this match.')
      return
    }

    const winsA = scoresA.filter((a, i) => a > scoresB[i]).length
    const winsB = scoresB.filter((b, i) => b > scoresA[i]).length

    if (winsA === winsB) {
      alert('A match cannot end in a draw. Please ensure one team has more game wins.')
      return
    }

    const winnerId = winsA > winsB ? team1Details.teamId : team2Details.teamId

    const scoresToSave = scoresA.map((s1, index) => ({
      game_number: index + 1,
      team_1_score: s1,
      team_2_score: scoresB[index],
    }))

    onSave(match, scoresToSave, winnerId)
    setWinner(winnerId)
    setCompleted(true)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-6"
      style={{
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
        boxShadow: completed ? '0 0 30px rgba(6, 182, 212, 0.2)' : 'none',
        borderColor: completed ? 'rgba(6, 182, 212, 0.5)' : 'rgba(51, 65, 85, 0.5)',
      }}
    >
      {/* Corner Accents */}
      <div 
        className="absolute top-0 right-0 w-4 h-4 pointer-events-none"
        style={{ background: completed 
          ? 'linear-gradient(135deg, transparent 50%, #10b981 50%)' 
          : 'linear-gradient(135deg, transparent 50%, #06b6d4 50%)' 
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-4 h-4 pointer-events-none"
        style={{ background: 'linear-gradient(-45deg, transparent 50%, #8b5cf6 50%)' }}
      />

      {/* Match Tag Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            {match.tag || 'Match'}
          </span>
        </div>
        {completed && (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Completed
            </span>
          </div>
        )}
      </div>

      {/* Teams vs Display */}
      <div className="flex justify-center items-center gap-6 mb-6">
        {/* Team 1 */}
        <div className="flex flex-col items-center gap-2 relative flex-1">
          {winner === team1Details.teamId && (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="absolute -top-8"
            >
              <Crown size={28} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            </motion.div>
          )}
          <div
            className={`px-4 py-2 font-mono font-bold text-sm uppercase tracking-wider text-center transition-all ${
              winner === team1Details.teamId 
                ? 'text-yellow-400' 
                : winner && winner !== team1Details.teamId 
                ? 'text-slate-500' 
                : 'text-white'
            }`}
            style={{
              background: winner === team1Details.teamId 
                ? 'linear-gradient(135deg, rgba(250, 204, 21, 0.1), rgba(245, 158, 11, 0.1))' 
                : 'rgba(15, 23, 42, 0.4)',
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
              border: winner === team1Details.teamId 
                ? '1px solid rgba(250, 204, 21, 0.3)' 
                : '1px solid rgba(51, 65, 85, 0.5)',
            }}
          >
            {team1Details.teamName}
          </div>
        </div>

        {/* VS */}
        <div
          className="px-3 py-1 text-xs font-mono font-bold text-slate-500"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
            border: '1px solid rgba(51, 65, 85, 0.3)',
          }}
        >
          VS
        </div>

        {/* Team 2 */}
        <div className="flex flex-col items-center gap-2 relative flex-1">
          {winner === team2Details.teamId && (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="absolute -top-8"
            >
              <Crown size={28} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            </motion.div>
          )}
          <div
            className={`px-4 py-2 font-mono font-bold text-sm uppercase tracking-wider text-center transition-all ${
              winner === team2Details.teamId 
                ? 'text-yellow-400' 
                : winner && winner !== team2Details.teamId 
                ? 'text-slate-500' 
                : 'text-white'
            }`}
            style={{
              background: winner === team2Details.teamId 
                ? 'linear-gradient(135deg, rgba(250, 204, 21, 0.1), rgba(245, 158, 11, 0.1))' 
                : 'rgba(15, 23, 42, 0.4)',
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
              border: winner === team2Details.teamId 
                ? '1px solid rgba(250, 204, 21, 0.3)' 
                : '1px solid rgba(51, 65, 85, 0.5)',
            }}
          >
            {team2Details.teamName}
          </div>
        </div>
      </div>

      {/* Score Inputs */}
      <div className="flex flex-col gap-3 items-center mb-6">
        {Array.from({ length: max_game_set }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Team 1 Score Input */}
            <input
              type="number"
              min={0}
              onChange={(e) => handleChange(i, e.target.value, 'a')}
              className="w-16 h-12 bg-slate-800/60 border border-slate-600/50 text-center font-mono font-bold text-lg text-cyan-400 focus:border-cyan-500 focus:outline-none focus:ring-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
              }}
              disabled={completed}
              placeholder="0"
            />

            {/* Game Number */}
            <div
              className="px-3 py-1 text-xs font-mono uppercase tracking-wider text-slate-500"
              style={{
                background: 'rgba(15, 23, 42, 0.4)',
                clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
              }}
            >
              G{i + 1}
            </div>

            {/* Team 2 Score Input */}
            <input
              type="number"
              min={0}
              onChange={(e) => handleChange(i, e.target.value, 'b')}
              className="w-16 h-12 bg-slate-800/60 border border-slate-600/50 text-center font-mono font-bold text-lg text-violet-400 focus:border-violet-500 focus:outline-none focus:ring-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
              }}
              disabled={completed}
              placeholder="0"
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <motion.button
        type="button"
        whileHover={{ scale: completed ? 1 : 1.02 }}
        whileTap={{ scale: completed ? 1 : 0.98 }}
        onClick={handleSave}
        disabled={completed || !match.team_1 || !match.team_2}
        className="w-full py-3 font-bold font-mono uppercase tracking-wider text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: completed 
            ? 'linear-gradient(135deg, #10b981, #059669)' 
            : 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
          color: '#020617',
          clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
          boxShadow: completed 
            ? '0 0 20px rgba(16, 185, 129, 0.4)' 
            : '0 0 20px rgba(6, 182, 212, 0.3)',
        }}
      >
        {completed ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle size={18} />
            Result Saved
          </span>
        ) : (
          'Save Result'
        )}
      </motion.button>
    </motion.div>
  )
}
