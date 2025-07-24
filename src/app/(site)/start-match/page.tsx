'use client'
import React, { useEffect, useState } from 'react'
import TournamentFormatSelector from '@/components/startMatch/TournamentFormatSelector'
import ProgressStepper from '@/components/startMatch/ProgressStepper'
import TeamBuilder from '@/components/startMatch/TeamBuilder'
import MatchCreate from '@/components/startMatch/MatchCreate'
import usePlayerStore from '@/store/usePlayerStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'

const STEPS = ['Tournament', 'Players', 'Fixtures']
export default function StartMatchPage() {
  const [step, setStep] = useState(0)
  const { players } = usePlayerStore()
  const user = useAuthStore((s) => s.user)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user])

  if (!user) return null
  const activePlayers = players.filter((p) => p.active)
  return (
    <div className=" flex flex-col  py-4 px-4">
      <ProgressStepper step={step} total={STEPS.length} labels={STEPS} />
      <div className=" flex flex-col  transition-all duration-500">
        {step === 0 && <TournamentFormatSelector onNext={() => setStep(1)} />}
        {step === 1 && (
          <TeamBuilder allPlayers={activePlayers} onNext={() => setStep(2)} />
        )}
        {step === 2 && <MatchCreate />}
        {/* {step === 1 && (
          <>
            {tournaments[0].match_type === 'doubles' ? (
              <TeamBuilder allPlayers={players} onNext={() => setStep(2)} />
            ) : (
              <PlayerSelector allPlayers={players} onNext={() => setStep(2)} />
            )}
          </>
        )} */}
      </div>
    </div>
  )
}
