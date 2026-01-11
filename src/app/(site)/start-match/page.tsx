'use client'
import React, { useState, useEffect } from 'react'
import TournamentFormatSelector from '@/components/startMatch/TournamentFormatSelector'
import ProgressStepper from '@/components/startMatch/ProgressStepper'
import TeamBuilder from '@/components/startMatch/TeamBuilder'
import usePlayerStore from '@/store/usePlayerStore'
import useLocalTournamentStore from '@/store/useLocalTournamentStore'
// import { useAuthStore } from '@/store/useAuthStore'
// import { useRouter } from 'next/navigation'
import MatchCreateLocal from '@/components/startMatch/MatchCreateLocal'

const STEPS = ['Tournament', 'Players', 'Fixtures']
export default function StartMatchPage() {
  const [step, setStep] = useState(0)
  const { players } = usePlayerStore()
  const { currentTournament, currentTournamentParticipants, currentMatches } =
    useLocalTournamentStore()
  // const user = useAuthStore((s) => s.user)
  // const router = useRouter()

  // Restore step from localStorage on mount and when data changes
  useEffect(() => {
    // Determine step based on what data exists in localStorage
    if (currentMatches && currentMatches.length > 0) {
      // Step 2: Matches exist, go to fixtures/match creation
      setStep(2)
    } else if (currentTournament && currentTournamentParticipants.length > 0) {
      // Step 2: Tournament created with participants, but matches might not be created yet
      // If participants exist, they should be on step 2 (matches page)
      setStep(2)
    } else if (currentTournament) {
      // Step 1: Tournament created, but no participants yet
      setStep(1)
    } else {
      // Step 0: No tournament created yet
      setStep(0)
    }
  }, [currentTournament, currentTournamentParticipants, currentMatches])

  // useEffect(() => {
  //   if (!user) {
  //     router.push('/')
  //   }
  // }, [user])

  // if (!user) return null
  const activePlayers = players.filter((p) => p.active)
  return (
    <div className=" flex flex-col  py-4 px-4">
      <ProgressStepper step={step} total={STEPS.length} labels={STEPS} />
      <div className=" flex flex-col  transition-all duration-500">
        {step === 0 && <TournamentFormatSelector onNext={() => setStep(1)} />}
        {step === 1 && (
          <TeamBuilder allPlayers={activePlayers} onNext={() => setStep(2)} />
        )}
        {step === 2 && <MatchCreateLocal />}
      </div>
    </div>
  )
}
