'use client'
import PlayerCard from '../../../components/Player/Playercard'
import usePlayerStore from '@/store/usePlayerStore'

const PlayerList = () => {
  const { players } = usePlayerStore()

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  )
}
export default PlayerList
