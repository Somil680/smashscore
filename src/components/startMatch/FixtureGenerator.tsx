import { useSmashScoreStore } from '@/store/useSmashScoreStore'
import React from 'react'

interface Fixture {
  playerA: string
  playerB: string
}

interface FixtureGeneratorProps {
  type: string
  onGenerate: (fixtures: Fixture[]) => void
}

export default function FixtureGenerator({
  type,
  onGenerate,
}: FixtureGeneratorProps) {
  const { teams } = useSmashScoreStore()

  // Simple fixture generation for demo
  React.useEffect(() => {
    if (teams.length < 2) return
    const fixtures: Fixture[] = []
    if (type === 'knockout') {
      for (let i = 0; i < teams.length; i += 2) {
        if (teams[i + 1])
          fixtures.push({ playerA: teams[i].name, playerB: teams[i + 1].name })
      }
    } else if (type === 'league' || type === 'round-robin') {
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          fixtures.push({ playerA: teams[i].name, playerB: teams[j].name })
        }
      }
    }
    onGenerate(fixtures)
  }, [type, teams, onGenerate])

  return null
}
