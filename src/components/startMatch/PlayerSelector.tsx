import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { Player, Team, useBadmintonStore } from '@/store/useBadmintonStore'
import { createAndRegisterTeam } from '@/hooks/createAndRegisterTeam'
import { generateFixtures } from '@/lib/FixtureGenerator'
import Image from 'next/image'
interface TeamBuilderProps {
  allPlayers: Player[]
    onNext: () => void
}

export default function PlayerSelector({ onNext, allPlayers }: TeamBuilderProps) {
  const { activeTournamentId, setActiveTeams, addMatch , tournaments ,loading } =
    useBadmintonStore()
  console.log("🚀 ~ TeamBuilder ~ tournaments:", tournaments)
  const [selected, setSelected] = useState<string[]>([])
  const [team, setTeams] = useState<string[][]>([])

  function handleSelect(player: string) {
    setSelected((prev) =>
      prev.includes(player)
        ? prev.filter((pid) => pid !== player)
        : [...prev, player]
    )
  }
//   const handleAddTeam = async () => {
//     setTeams([...team, selected])
//     setSelected([])
//   }

  const handleRemoveTeam = (rowIndex: number) => {
    setTeams(team.filter((_, index) => index !== rowIndex))
  }

  // const availablePlayers = allPlayers.filter(
  //   (p) => !teams.some((t) => t.players.includes(p.id))
  //   )
  const availablePlayers = allPlayers.filter(
    (num) => !team.flat().includes(num.id)
  )

  // const handleAutoGenerateTeams = () => {
  //   // Auto-generate teams from availablePlayers
  //   const newTeams = []
  //   let ids = availablePlayers.map((p) => p.id)
  //   ids = ids.sort(() => Math.random() - 0.5)
  //   while (ids.length >= 2) {
  //     const p1 = allPlayers.filter((item) => item.id === ids[0])[0].name
  //     const p2 =
  //       selected.length === 1
  //         ? ''
  //         : '&' + allPlayers.filter((item) => item.id === ids[1])[0].name
  //     newTeams.push({
  //       id: `${p1}${p2} `,
  //       players: [ids[0], ids[1]],
  //     })
  //     ids = ids.slice(2)
  //   }
  //   // If one player left, make a single-player team
  //   if (ids.length === 1) {
  //     newTeams.push({
  //       id: allPlayers.filter((item) => item.id === ids[0])[0].name,
  //       players: [ids[0]],
  //     })
  //   }
  //   setTeams([...teams, ...newTeams])
  //   setSelected([])
  // }
  // const activeTeams = useActiveTournamentTeams()
  // console.log("🚀 ~ TeamBuilder ~ activeTeams:", activeTeams)

    const handleNext = async () => {
        console.log('🚀 ~ TeamBuilder ~ team:', team)

    if (!activeTournamentId) return
    const createdTeams = await Promise.all(
      selected.map(([player1, player2]) => {
        return createAndRegisterTeam(activeTournamentId, player1, player2)
      })
    )
        console.log('🚀 ~ createdTeams ~ createdTeams:', createdTeams)
        setActiveTeams(
          (createdTeams ?? []).filter((team): team is Team => team !== null)
        )
        const fixtures = generateFixtures('round-robin', createdTeams)

    // 5. Create match objects from fixtures
    const newMatches = fixtures.map((f, i) => ({
      tournament_id: activeTournamentId ,
      team_1_id: f.playerA,
      team_2_id: f.playerB,
      tag: `Match ${i + 1}`,
    }))
    console.log('🚀 ~ newMatches ~ newMatches:', newMatches)
    await Promise.all(newMatches.map((match) => addMatch(match)))
   
    onNext()
  }

  return (
    <div className="flex flex-col  gap-4 ">
      <h2 className="text-lg font-semibold text-white mb-2">
        Select Single Player
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-2xl">
        {availablePlayers.map((player) => (
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
            disabled={team.flatMap((t) => t).includes(player.id)}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-lime-400 to-blue-500 transition-all duration-300 rounded-2xl z-0" />
            <Image
              src={player.image_url || '/avatars/avatar1.gif'}
              alt={player.name}
              width={56}
              height={56}
              className="rounded-full w-14 h-14 object-cover border-2 border-blue-200 group-hover:border-lime-400 transition-all duration-300 z-10"
            />
            <span className="font-medium text-base text-white mt-1 z-10 group-hover:text-lime-300 transition-colors duration-300">
              {player.name}
            </span>
          </button>
        ))}
      </div>
      <div className="flex justify-between gap-2">
        {/* <Button
          className="flex-1"
          onClick={handleAddTeam}
          disabled={availablePlayers.length === 0}
        >
          Add Team {!(selected.length === 2 || availablePlayers.length === 1)}
        </Button> */}
        {/* {tournaments[0].match_type === 'doubles' && (
          <Button
            //   onClick={handleAutoGenerateTeams}
            disabled={availablePlayers.length < 1}
            variant={'secondary'}
          >
            <Sparkles size={20} />
            Auto
          </Button>
        )} */}
      </div>
      <div className="w-full mt-6">
        <h3 className="text-lg font-semibold text-white mb-2">Teams</h3>
        <div className="flex flex-wrap gap-4">
          {selected.map((team, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-[#232c3b] rounded-xl px-4 py-2"
            >
              {selected.map((pid) => {
                const p = allPlayers.find((pl) => pl.id === pid)
                return (
                  <span
                    key={pid}
                    className="flex items-center gap-1 text-white font-medium"
                  >
                    <Image
                      src={p?.image_url ?? ''}
                      alt={p?.name || 'Player'}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    {p?.name}
                  </span>
                )
              })}
              <button
                className="ml-2 text-xs text-red-400 hover:text-red-600"
                onClick={() => handleRemoveTeam(index)}
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button
        type="button"
        onClick={handleNext}
        disabled={selected.length === 0 || loading}
      >
        {loading ? <Loader2 size={25} className=" animate-spin" /> : 'Next'}
      </Button>
    </div>
  )
}
