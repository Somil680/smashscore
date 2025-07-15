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
//   function handleAddTeam() {
//     const p1 = allPlayers.filter((item) => item.id === selected[0])[0].name

//     const p2 =
//       selected.length === 1
//         ? ''
//         : '&' + allPlayers.filter((item) => item.id === selected[1])[0].name
//     setTeams([...teams, { id: `${p1}${p2} `, players: [...selected] }])
//     setSelected([])
//     if (selected.length === 2) {
//     }
//   }
//   function handleRemoveTeam(id: string) {
//     setTeams(teams.filter((t) => t.id !== id))
//   }
//   const availablePlayers = allPlayers.filter(
//     (p) => !teams.some((t) => t.players.includes(p.id))
//   )
//   const handleAutoGenerateTeams = () => {
//     // Auto-generate teams from availablePlayers
//     const newTeams = []
//     let ids = availablePlayers.map((p) => p.id)
//     ids = ids.sort(() => Math.random() - 0.5)
//     while (ids.length >= 2) {
//       const p1 = allPlayers.filter((item) => item.id === ids[0])[0].name
//       const p2 =
//         selected.length === 1
//           ? ''
//           : '&' + allPlayers.filter((item) => item.id === ids[1])[0].name
//       newTeams.push({
//         id: `${p1}${p2} `,
//         players: [ids[0], ids[1]],
//       })
//       ids = ids.slice(2)
//     }
//     // If one player left, make a single-player team
//     if (ids.length === 1) {
//       newTeams.push({
//         id: allPlayers.filter((item) => item.id === ids[0])[0].name,
//         players: [ids[0]],
//       })
//     }
//     setTeams([...teams, ...newTeams])
//     setSelected([])
//   }

//   const handleNext = async () => {
//       // 1. Create team IDs + new teams
//       const player = allPlayers.find((p) => p.id === playerId)!

//     const newTeams = teams.map((team) => ({
//       id: uuidv4(),
//       name: team.id,
//       players_id: team.players,
//       totalPointsScored: 0,
//     }))
//     // console.log('🚀 ~ newTeams ~ newTeams:', newTeams)

//     // 2. Add all teams in parallel
//     // await Promise.all(newTeams.map((team) => addTeam(team)))

//     // 3. Optional: Update tournament with team IDs
//     // const teamIds = newTeams.map((team) => team.id)
//     assignPlayersToTournament(currentTournamentId ?? '', selected)

//     // 4. Generate fixtures with actual teams
//     const fixtures = generateFixtures('round-robin', selected)

//     // 5. Create match objects from fixtures
//     const newMatches = fixtures.map((f) => ({
//       id: '',
//       tournamentId: currentTournamentId ?? '',
//       team1Id: f.playerA.id,
//       team2Id: f.playerB.id,
//       team1_score: [],
//       team2_score: [],
//     }))

//     // 6. Add all matches in parallel
//     await Promise.all(newMatches.map((match) => addMatch(match)))

//     // 7. Proceed
//     console.log('🚀 ~ handleNext ~ tournaments:', tournaments)
//     onNext()
//   }
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
      {/* <div className="flex justify-between gap-2">
        <Button
          className="flex-1"
          onClick={handleAddTeam}
          disabled={!(selected.length === 2 || availablePlayers.length === 1)}
        >
          Add Team {!(selected.length === 2 || availablePlayers.length === 1)}
        </Button>
        <Button
          onClick={handleAutoGenerateTeams}
          disabled={availablePlayers.length < 1}
          variant={'secondary'}
        >
          <Sparkles size={20} />
          Auto
        </Button>
      </div> */}
      {/* <div className="w-full mt-6">
        <h3 className="text-lg font-semibold text-white mb-2">Teams</h3>
        <div className="flex flex-wrap gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center gap-2 bg-[#232c3b] rounded-xl px-4 py-2"
            >
              {team.players.map((pid) => {
                const p = allPlayers.find((pl) => pl.id === pid)
                return (
                  <span
                    key={pid}
                    className="flex items-center gap-1 text-white font-medium"
                  >
                    {p?.name}
                  </span>
                )
              })}
              <button
                className="ml-2 text-xs text-red-400 hover:text-red-600"
                onClick={() => handleRemoveTeam(team.id)}
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div> */}
      <Button type="button" onClick={handleNext}>
        Next
      </Button>
    </div>
  )
}
