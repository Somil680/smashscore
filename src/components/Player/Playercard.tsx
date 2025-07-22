'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Player } from '@/store/type'

interface PlayerCardProps {
  player: Player
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  console.log('🚀 ~ player:', player)
  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6 space-y-4">
        {/* Player Image + Name */}
        <div className="flex items-center space-x-4">
          <Image
            src={player.image_url || ''}
            alt={player.name}
            width={60}
            height={60}
            className="rounded-full object-cover border-2 border-blue-500"
          />

          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              {player.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Joined: {new Date(player.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-2 gap-4 text-sm">
          <Stat
            label="Matches"
            icon={<BarChart3 />}
            value={player.matchesPlayed}
          />
          <Stat label="Wins" icon={<Trophy />} value={player.matchesWon} />
          <Stat
            label="High Score"
            icon={<Activity />}
            value={player.highestScore}
          />
          <Stat
            label="Total Points"
            icon={<User2 />}
            value={player.totalPointsScored}
          />
        </div> */}

        {/* Sync Status */}
        {/* {!player.synced && (
          <div className="text-xs text-orange-500 font-medium mt-2">
            Not synced with server
          </div>
        )} */}
      </CardContent>
    </Card>
  )
}

// const Stat = ({
//   label,
//   value,
//   icon,
// }: {
//   label: string
//   value: number
//   icon: React.ReactNode
// }) => (
//   <div className="flex items-center space-x-2">
//     <div className="text-blue-500">{icon}</div>
//     <div>
//       <div className="text-gray-800 dark:text-gray-100 font-semibold">
//         {value}
//       </div>
//       <div className="text-gray-500 text-xs">{label}</div>
//     </div>
//   </div>
// )

export default PlayerCard
