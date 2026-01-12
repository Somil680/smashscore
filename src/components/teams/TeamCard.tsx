// components/TeamCard.tsx
'use client'

import React from 'react'
import { BarChart2, Trophy, Hash, Calendar } from 'lucide-react'
import { TeamWithPlayers } from '@/store/type'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface TeamCardProps {
  team: TeamWithPlayers
  stats: {
    matchesPlayed: number
    totalWins: number
    winProbability: number
  }
}

export default function TeamCard({ team, stats }: TeamCardProps) {
  const getTeamName = (team: TeamWithPlayers) => {
    if (team.player_2) {
      return `${team.player_1.name} & ${team.player_2.name}`
    }
    return team.player_1.name
  }

  const teamName = getTeamName(team)

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)' }}
      className="relative bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-6 overflow-hidden group"
      style={{
        clipPath:
          'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
      }}
    >
      {/* Corner Accents */}
      <div
        className="absolute top-0 right-0 w-5 h-5 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 50%, #06b6d4 50%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-5 h-5 pointer-events-none"
        style={{
          background: 'linear-gradient(-45deg, transparent 50%, #8b5cf6 50%)',
        }}
      />

      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

      {/* Team Name and Players */}
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="flex -space-x-3">
          {team.player_1 && (
            <div
              className="relative"
              style={{
                padding: '2px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                clipPath:
                  'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
              }}
            >
              <Image
                src={team.player_1.image_url || `/profileImage/i1.png`}
                width={48}
                height={48}
                alt={team.player_1.name}
                className="w-12 h-12 object-cover bg-slate-800"
                style={{
                  clipPath:
                    'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
                }}
                title={team.player_1.name}
              />
            </div>
          )}
          {team.player_2 && (
            <div
              className="relative"
              style={{
                padding: '2px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                clipPath:
                  'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
              }}
            >
              <Image
                src={team.player_2.image_url || `/profileImage/i2.png`}
                width={48}
                height={48}
                alt={team.player_2.name}
                className="w-12 h-12 object-cover bg-slate-800"
                style={{
                  clipPath:
                    'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
                }}
                title={team.player_2.name}
              />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-white">
            {teamName}
          </h3>
          <p className="text-xs font-mono text-slate-500 flex items-center gap-1.5 mt-1 uppercase tracking-wider">
            <Calendar size={12} />
            {new Date(team.created_at).toLocaleDateString('en-GB')}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-px w-full mb-4"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.3), transparent)',
        }}
      />

      {/* Team Statistics */}
      <div className="grid grid-cols-3 gap-4 text-center relative z-10">
        <div>
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <BarChart2 size={14} />
            <span className="text-xs font-mono uppercase tracking-wider">
              Played
            </span>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-1">
            {stats.matchesPlayed}
          </p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-2 text-cyan-400">
            <Trophy size={14} />
            <span className="text-xs font-mono uppercase tracking-wider">
              Wins
            </span>
          </div>
          <p className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {stats.totalWins}
          </p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-2 text-violet-400">
            <Hash size={14} />
            <span className="text-xs font-mono uppercase tracking-wider">
              Rate
            </span>
          </div>
          <p className="text-2xl font-bold font-mono text-violet-400 mt-1">
            {stats.winProbability}%
          </p>
        </div>
      </div>
    </motion.div>
  )
}
