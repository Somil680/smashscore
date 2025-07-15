'use client'
import React, { useState } from 'react'
import TournamentFormatSelector, {
//   TournamentFormat,
//   MatchType,
} from '@/components/startMatch/TournamentFormatSelector'
// import PlayerSelector from '@/components/startMatch/PlayerSelector'
// import FixtureGenerator from '@/components/startMatch/FixtureGenerator'
// import ScoreEntryCard from '@/components/startMatch/ScoreEntryCard'
import ProgressStepper from '@/components/startMatch/ProgressStepper'
import { useSmashScoreStore } from '@/store/useSmashScoreStore'
import TeamBuilder from '@/components/startMatch/TeamBuilder'
import MatchCreate from '@/components/startMatch/MatchCreate'
import PlayerSelector from '@/components/startMatch/PlayerSelector'

const STEPS = ['Tournament', 'Players', 'Fixtures']

export default function StartMatchPage() {
    
    // const {teams}  = useSmashScoreStore()
    // console.log("🚀 ~ StartMatchPage ~ teams:", teams)
    // const teamsId = teams.map((item) =>  item.id)
    // console.log("🚀 ~ StartMatchPage ~ teamsId:", teamsId)


  const [step, setStep] = useState(0)
//  const {initialTournament} = useSmashScoreStore()
//   const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
//   const [fixtures, setFixtures] = useState<
//   { playerA: string; playerB: string }[]
//   >([])
//   const [results, setResults] = useState<
//     Record<string, { a: number[]; b: number[]; winnerId: string }>
//   >({})

  // Zustand store actions
//   const addTournament = useSmashScoreStore((s) => s.addTournament)
//   const addMatch = useSmashScoreStore((s) => s.addMatch)

//   // Step transitions
//   function handleTypeSelect(type: TournamentType) {
//     setTournamentType(type)
//     setTimeout(() => setStep(1), 400)
//   }
//   function handlePlayersSelect(ids: string[]) {
//     setSelectedPlayers(ids)
//   }
//   function handleFixturesGenerated(f: { playerA: string; playerB: string }[]) {
//     setFixtures(f)
//     setTimeout(() => setStep(2), 400)
//   }
//   function handleSaveResult(
//     idx: number,
//     scores: { a: number[]; b: number[] },
//     winnerId: string
//   ) {
//     setResults((prev) => ({
//       ...prev,
//       [idx]: { a: scores.a, b: scores.b, winnerId },
//     }))
//     // Optionally: addMatch({ ... })
//   }
//   function handleNext() {
//     setStep((s) => Math.min(s + 1, STEPS.length - 1))
//   }
//   function handlePrev() {
//     setStep((s) => Math.max(s - 1, 0))
//   }
//   function handleReset() {
//     setStep(0)
//     setTournamentType(null)
//     setSelectedPlayers([])
//     setFixtures([])
//     setResults({})
//   }
  const {players , tournaments} = useSmashScoreStore()

  return (
    <div className=" flex flex-col  py-4 px-4">
      <ProgressStepper step={step} total={STEPS.length} labels={STEPS} />
      <div className=" flex flex-col  transition-all duration-500">
        {step === 0 && <TournamentFormatSelector onNext={() => setStep(1)} />}
        {step === 1 && (
          <>
            {tournaments[0].match_type === 'doubles' ? (
              <TeamBuilder allPlayers={players} onNext={() => setStep(2)} />
            ) : (
              <PlayerSelector allPlayers={players} onNext={() => setStep(2)} />
            )}
          </>
        )}

        {step === 2 &&  (
          <MatchCreate />
        ) }
        {/* {step === 3 && fixtures.length > 0 && (
)} */}

        <>
          {/* <TeamBuilder allPlayers={players} setTeams={setTeams} teams={teams} key={teams.length} />              <PlayerSelector selected={selectedPlayers} onChange={handlePlayersSelect} /> */}
          {/* <button
                className="mt-8 px-10 py-3 rounded-2xl bg-gradient-to-tr from-lime-400 to-blue-500 text-white font-bold shadow-lg hover:scale-105 transition-transform text-lg disabled:opacity-50"
                onClick={() => setStep(2)}
                disabled={selectedPlayers.length < 2}
              >
                Generate Fixtures
              </button> */}
        </>
        {/* <FixtureGenerator
          type={tournamentType}
          playerIds={selectedPlayers}
          onGenerate={(f) => {
            setFixtures(f);
            setStep(3);
          }}
        /> */}
        {/* <div className="flex flex-col gap-8 w-full items-center">
              {fixtures.map((fx, idx) => (
                <ScoreEntryCard
                  key={idx}
                  playerA={fx.playerA}
                  playerB={fx.playerB}
                  onSave={(scores, winnerId) => handleSaveResult(idx, scores, winnerId)}
                />
              ))}
                      
              <button
                className="mt-8 px-10 py-3 rounded-2xl bg-gradient-to-tr from-lime-400 to-blue-500 text-white font-bold shadow-lg hover:scale-105 transition-transform text-lg"
                onClick={handleReset}
              >
                Reset
              </button>
            </div> */}
      </div>
    </div>
  )
}
