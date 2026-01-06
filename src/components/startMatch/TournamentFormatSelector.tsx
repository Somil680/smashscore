'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Loader2, Trophy, Users, Zap } from 'lucide-react'
import { generateTournamentName } from '@/hooks/generateTournamentName'
import useLocalTournamentStore from '@/store/useLocalTournamentStore'
import { useAuthStore } from '@/store/useAuthStore'
import { Checkbox } from '../ui/checkbox'

export type MatchType = 'singles' | 'doubles'

interface TournamentFormatSelectorProps {
  onNext: () => void
}

const MATCH_TYPES = [
  { type: 'singles', label: 'Singles', icon: Zap, color: 'cyan' },
  { type: 'doubles', label: 'Doubles', icon: Users, color: 'violet' },
]

export default function TournamentFormatSelector({
  onNext,
}: TournamentFormatSelectorProps) {
  const { createLocalTournament, loading, error } = useLocalTournamentStore()
  const newName = generateTournamentName()
  const user = useAuthStore((s) => s.user)

  const [inputData, setInputData] = useState<{
    name: string
    match_type: MatchType | null
    max_game_set: number
    points_per_game: number
    final_match: boolean
  }>({
    name: newName,
    match_type: 'singles',
    max_game_set: 1,
    points_per_game: 21,
    final_match: false,
  })

  const handleNext = () => {
    createLocalTournament({
      name: inputData.name,
      tournament_type: 'round-robin',
      match_type: inputData.match_type ?? 'singles',
      max_game_set: inputData.max_game_set,
      points_per_game: inputData.points_per_game,
      final_match: inputData.final_match,
      user_id: user?.id || '',
    })
    onNext()
  }

  return (
    <>
      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-sm">
          [ ERROR ] Failed to create tournament. Please try again.
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 w-full max-w-lg mx-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="p-2"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
                clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
              }}
            >
              <Trophy className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold font-mono uppercase tracking-wider text-white">
              Create Tournament
            </h2>
          </div>

          {/* Tournament Name */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Tournament Name
            </label>
            <input
              className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 text-white font-mono placeholder-slate-500 focus:border-cyan-500 focus:ring-0 focus:outline-none transition-all"
              style={{
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
              }}
              placeholder="Enter tournament name"
              value={inputData.name}
              onChange={(e) => {
                setInputData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }}
            />
          </div>

          {/* Match Format */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
              Match Format
            </label>
            <div className="flex flex-row gap-4 w-full">
              {MATCH_TYPES.map((m) => {
                const Icon = m.icon
                const isSelected = inputData.match_type === m.type
                return (
                  <motion.button
                    key={m.type}
                    onClick={() =>
                      setInputData((prev) => ({
                        ...prev,
                        match_type: m.type as MatchType,
                      }))
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-mono uppercase tracking-wider font-bold transition-all duration-300 ${
                      isSelected
                        ? 'text-slate-950'
                        : 'text-slate-400 border border-slate-700/50 hover:border-slate-600'
                    }`}
                    style={{
                      background: isSelected
                        ? m.color === 'cyan'
                          ? 'linear-gradient(135deg, #06b6d4, #3b82f6)'
                          : 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
                        : 'transparent',
                      clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                      boxShadow: isSelected ? '0 0 30px rgba(6, 182, 212, 0.3)' : 'none',
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    {m.label}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Settings */}
          <div
            className="p-4 bg-slate-900/40 border border-slate-700/30"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
          >
            <p className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-4">
              [ Settings ]
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-slate-300">Max Games (Sets)</span>
                <Select
                  defaultValue={inputData.max_game_set.toString()}
                  onValueChange={(value) =>
                    setInputData((prev) => ({
                      ...prev,
                      max_game_set: Number(value),
                    }))
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-slate-300">Points per Game</span>
                <Select
                  defaultValue={inputData.points_per_game.toString()}
                  onValueChange={(value) =>
                    setInputData((prev) => ({
                      ...prev,
                      points_per_game: Number(value),
                    }))
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {[11, 15, 21, 25, 30].map((p) => (
                      <SelectItem key={p} value={p.toString()}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-slate-300">Final Match</span>
                <Checkbox
                  id="final_match"
                  checked={inputData.final_match}
                  onCheckedChange={(checked) =>
                    setInputData((prev) => ({
                      ...prev,
                      final_match: checked === true,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 px-10 py-4 flex items-center justify-center text-slate-950 font-bold font-mono uppercase tracking-wider disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
              clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)',
            }}
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : 'Next →'}
          </motion.button>
        </motion.div>
      )}
    </>
  )
}
