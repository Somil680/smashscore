// components/TeamCard.tsx
'use client'

import React from 'react'
import { BarChart2, Trophy, Hash, Calendar } from 'lucide-react'
import { TeamWithPlayers } from '@/store/type'
import Image from 'next/image'

// ============================================================================
// 1. TYPE DEFINITIONS
// ============================================================================

// The props for our TeamCard component.
// It expects the full team object with player details, plus the calculated stats.
interface TeamCardProps {
  team: TeamWithPlayers
  stats: {
    matchesPlayed: number
    totalWins: number
    totalScore: number
  }
}

// ============================================================================
// 2. THE TEAM CARD COMPONENT
// ============================================================================

export default function TeamCard({ team, stats }: TeamCardProps) {
  // Helper to get the team's display name
  const getTeamName = (team: TeamWithPlayers) => {
    if (team.player_2) {
      return `${team.player_1.name} & ${team.player_2.name}`
    }
    return team.player_1.name
  }

  const teamName = getTeamName(team)

  return (
    <div className="bg-white dark:bg-[#181f2a] rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105 duration-300">
      {/* Team Name and Players */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex -space-x-3">
          {team.player_1 && (
            <Image
              src={
                team.player_1.image_url ||
                `https://placehold.co/48x48/E2E8F0/4A5568?text=${team.player_1.name.charAt(
                  0
                )}`
              }
              width={48}
              height={48}
              alt={team.player_1.name}
              className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800"
              title={team.player_1.name}
            />
          )}
          {team.player_2 && (
            <Image
              src={
                team.player_2.image_url ||
                `https://placehold.co/48x48/A0AEC0/2D3748?text=${team.player_2.name.charAt(
                  0
                )}`
              }
              width={48}
              height={48}
              alt={team.player_2.name}
              className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800"
              title={team.player_2.name}
            />
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {teamName}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
            <Calendar size={12} />
            Formed on: {new Date(team.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700 my-4" />

      {/* Team Statistics */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
            <BarChart2 size={16} />
            <span className="text-xs font-medium">Played</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.matchesPlayed}
          </p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-2 text-green-500">
            <Trophy size={16} />
            <span className="text-xs font-medium">Wins</span>
          </div>
          <p className="text-2xl font-bold text-green-500 mt-1">
            {stats.totalWins}
          </p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-2 text-blue-500">
            <Hash size={16} />
            <span className="text-xs font-medium">Score</span>
          </div>
          <p className="text-2xl font-bold text-blue-500 mt-1">
            {stats.totalScore}
          </p>
        </div>
      </div>
    </div>
  )
}
