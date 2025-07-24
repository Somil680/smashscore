'use client'
import { User } from 'lucide-react'
import PlayerCard from '../../../components/Player/Playercard'
import usePlayerStore from '@/store/usePlayerStore'

const PlayerList = () => {
  const { players } = usePlayerStore()

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
      <div className="mb-4 text-center">
        <div className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mb-2">
          <User className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Players
        </h1>
      </div>
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  )
}
export default PlayerList
