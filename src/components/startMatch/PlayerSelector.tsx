import React, { useState } from 'react'
import {  useSmashScoreStore } from '@/store/useSmashScoreStore'
import { Button } from '../ui/button'
import { v4 as uuidv4 } from 'uuid'
import { generateFixtures } from '@/lib/FixtureGenerator'
// import { generateFixtures } from '@/lib/FixtureGenerator'

interface TeamBuilderProps {
  allPlayers: { id: string; name: string; image?: string }[]
  onNext: () => void
}

export default function TeamBuilder({ onNext, allPlayers }: TeamBuilderProps) {
  const [selected, setSelected] = useState<string[]>([])
  console.log("🚀 ~ TeamBuilder ~ selected:", selected)
  const {
    addTeam,
    addMatch,
    currentTournamentId,
    assignPlayersToTournament,
  } = useSmashScoreStore()

  function handleSelect(player: string) {
    setSelected((prev) =>
      prev.includes(player)
        ? prev.filter((pid) => pid !== player)
        : [...prev, player]
    )
  }

  const handleNext = async () => {
    // Instead of creating manual teams for singles:
    const selectedPlayers = selected // already filtered
    const singleTeams = selectedPlayers.map((playerId) => {
      const player = allPlayers.find((p) => p.id === playerId)!
      return {
        id: uuidv4(),
        name: player.name,
        players_id: [playerId],
        totalPointsScored: 0,
      }
    })
    await Promise.all(singleTeams.map(addTeam))
    assignPlayersToTournament(
      currentTournamentId ?? '',
      singleTeams.map((t) => t.id)
    )

    // Generate fixtures
    const fixtures = generateFixtures('round-robin', singleTeams)

    const newMatches = fixtures.map((f) => ({
      id: '',
      tournamentId: currentTournamentId ?? '',
      team1Id: f.playerA.id,
      team2Id: f.playerB.id,
      team1_score: [],
      team2_score: [],
    }))

    await Promise.all(newMatches.map(addMatch))
    onNext()

  }

  return (
    <div className="flex flex-col  gap-4 ">
      <h2 className="text-lg font-semibold text-white mb-2">
        Select Players 
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-2xl">
        {allPlayers.map((player) => (
          <button
            key={player.id}
            type="button"
            onClick={() => handleSelect(player.id)}
            className={`group flex flex-col items-center gap-2 rounded-2xl p-3 border-2 transition-all duration-300 shadow-xl bg-gradient-to-br from-[#181f2a] to-[#232c3b] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 relative overflow-hidden
         ${
           selected.includes(player.id)
             ? '  from-lime-400 via-blue-500 to-purple-500  border-lime-300'
             : 'border-blue-400 hover:border-blue-400  '
         }
       `}
            // disabled={teams.flatMap((t) => t.players).includes(player.id)}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-lime-400 to-blue-500 transition-all duration-300 rounded-2xl z-0" />
            {/* <Image
         src={p.image || "/avatars/avatar1.gif"}
         alt={p.name}
         width={56}
         height={56}
         className="rounded-full w-14 h-14 object-cover border-2 border-blue-200 group-hover:border-lime-400 transition-all duration-300 z-10"
       /> */}
            <span className="font-medium text-base text-white mt-1 z-10 group-hover:text-lime-300 transition-colors duration-300">
              {player.name}
            </span>
          </button>
        ))}           
      </div>
      <Button type="button" onClick={handleNext}>
        Next
      </Button>
    </div>
  )
}
