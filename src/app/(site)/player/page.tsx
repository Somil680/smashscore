"use client"
import { useSmashScoreStore } from '@/store/useSmashScoreStore'
import PlayerCard from '../../../components/Player/Playercard'

const PlayerList = () => {
  const { players } = useSmashScoreStore()

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  )
}
export default PlayerList