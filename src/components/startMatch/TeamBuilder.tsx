'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Loader2, Sparkles, Users, User } from 'lucide-react'
import { Player, TeamWithPlayers } from '@/store/type'
import { generateFixtures } from '@/lib/FixtureGenerator'
import Image from 'next/image'
import useLocalTournamentStore from '@/store/useLocalTournamentStore'
import useTeamStore from '@/store/useTeamStore'
import { motion } from 'framer-motion'

interface TeamBuilderProps {
  allPlayers: Player[]
  onNext: () => void
}

export default function TeamBuilder({ onNext, allPlayers }: TeamBuilderProps) {
  const {
    currentTournament,
    addLocalMatch,
    setLocalTournamentParticipants,
    loading,
  } = useLocalTournamentStore()

  const { getOrCreateTeam } = useTeamStore()
  const [selected, setSelected] = useState<string[]>([])
  const [team, setTeams] = useState<string[][]>([])

  const handleSelect = (player: string) => {
    setSelected((prev) =>
      prev.includes(player)
        ? prev.filter((pid) => pid !== player)
        : [...prev, player]
    )
  }
  const handleAddTeam = async () => {
    setTeams([...team, selected])
    setSelected([])
  }
  const handleRemoveTeam = (rowIndex: number) => {
    setTeams(team.filter((_, index) => index !== rowIndex))
  }
  const availablePlayers = allPlayers.filter(
    (num) => !team.flat().includes(num.id)
  )
  const handleCheckMatchTypeSingle =
    currentTournament?.match_type === 'singles' ? true : false

  const handleAutoGenerateTeams = () => {
    const newTeams: string[][] = []
    let ids = [...availablePlayers.map((p) => p.id)]
    ids = ids.sort(() => Math.random() - 0.5)

    while (ids.length >= 2) {
      const p1 = ids[0]
      const p2 = ids[1]
      newTeams.push([p1, p2])
      ids = ids.slice(2)
    }

    if (ids.length === 1) {
      newTeams.push([ids[0]])
    }

    setTeams((prev) => [...prev, ...newTeams])
    setSelected([])
  }

  const handleNext = async () => {
    if (!currentTournament) return

    const createdTeams = await Promise.all(
      team.map(async ([player1, player2]) => {
        const getTeam = await getOrCreateTeam(player1, player2)
        return getTeam
      })
    )
    console.log("🚀 ~ handleNext ~ createdTeams:", createdTeams)

    const validTeams = (createdTeams ?? []).filter(
      (team): team is TeamWithPlayers => team !== null
    )
    console.log("🚀 ~ handleNext ~ validTeams:", validTeams)

    const fixtures = generateFixtures('round-robin', validTeams)
    console.log("🚀 ~ handleNext ~ fixtures:", fixtures)

    setLocalTournamentParticipants(
      validTeams.map((t) => ({
        tournament_id: currentTournament.id,
        team_id: t.id,
        team: t,
      }))
    )

    fixtures.forEach((f, i) => {
      const team1 = validTeams.find((t) => t.id === f.playerA)
      const team2 = validTeams.find((t) => t.id === f.playerB)

      if (team1 && team2) {
        addLocalMatch({
          tournament_id: currentTournament.id,
          team_1_id: f.playerA,
          team_2_id: f.playerB,
          team_1: team1,
          team_2: team2,
          tag: `Match ${i + 1}`,
        })
      }
    })

    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 w-full max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="p-2"
          style={{
            background:
              'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
            clipPath:
              'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
          }}
        >
          {handleCheckMatchTypeSingle ? (
            <User className="w-6 h-6 text-cyan-400" />
          ) : (
            <Users className="w-6 h-6 text-cyan-400" />
          )}
        </div>
        <h2 className="text-xl font-bold font-mono uppercase tracking-wider text-white">
          {handleCheckMatchTypeSingle ? 'Select Players' : 'Build Teams'}
        </h2>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
        {availablePlayers.map((player) => {
          const isSelected = selected.includes(player.id)
          return (
            <motion.button
              key={player.id}
              type="button"
              onClick={() => handleSelect(player.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`group flex flex-col items-center gap-3 p-4 transition-all duration-300 relative overflow-hidden ${
                isSelected
                  ? 'border-cyan-400'
                  : 'border-slate-700/50 hover:border-slate-600'
              }`}
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))'
                  : 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${
                  isSelected
                    ? 'rgba(6, 182, 212, 0.5)'
                    : 'rgba(51, 65, 85, 0.5)'
                }`,
                clipPath:
                  'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                boxShadow: isSelected
                  ? '0 0 20px rgba(6, 182, 212, 0.3)'
                  : 'none',
              }}
              disabled={team.flatMap((t) => t).includes(player.id)}
            >
              {/* Corner accent */}
              <div
                className="absolute top-0 right-0 w-3 h-3 pointer-events-none"
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, transparent 50%, #06b6d4 50%)'
                    : 'linear-gradient(135deg, transparent 50%, #475569 50%)',
                }}
              />

              <div
                className="relative"
                style={{
                  padding: '2px',
                  background: isSelected
                    ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)'
                    : 'linear-gradient(135deg, #475569, #64748b)',
                  clipPath:
                    'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                }}
              >
                <Image
                  src={player.image_url || '/profileImage/i1.png'}
                  alt={player.name}
                  width={56}
                  height={56}
                  className="object-cover bg-slate-800"
                  style={{
                    clipPath:
                      'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
                  }}
                />
              </div>
              <span
                className={`font-mono text-sm uppercase tracking-wider ${
                  isSelected ? 'text-cyan-400' : 'text-slate-300'
                }`}
              >
                {player.name}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          className="flex-1"
          onClick={handleAddTeam}
          disabled={
            (handleCheckMatchTypeSingle
              ? selected.length !== 1
              : selected.length < 1 || selected.length > 2) ||
            selected.length === 0 ||
            availablePlayers.length === 0
          }
        >
          {handleCheckMatchTypeSingle ? 'Select Player' : 'Add Team'}
        </Button>
        {currentTournament?.match_type === 'doubles' && (
          <Button
            onClick={handleAutoGenerateTeams}
            disabled={availablePlayers.length < 1}
            variant="secondary"
          >
            <Sparkles size={18} />
            Auto Generate
          </Button>
        )}
      </div>

      {/* Created Teams */}
      {team.length > 0 && (
        <div className="w-full">
          <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-400 mb-4">
            [ {team.length} Teams Created ]
          </h3>
          <div className="flex flex-wrap gap-3">
            {team.map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 border border-slate-700/50"
                style={{
                  clipPath:
                    'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                }}
              >
                {t.map((pid) => {
                  const p = allPlayers.find((pl) => pl.id === pid)
                  return (
                    <span
                      key={pid}
                      className="flex items-center gap-2 text-white font-mono text-sm"
                    >
                      <Image
                        src={p?.image_url ?? '/profileImage/i1.png'}
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
                  className="ml-2 text-xs font-mono text-red-400 hover:text-red-300 uppercase tracking-wider"
                  onClick={() => handleRemoveTeam(index)}
                  type="button"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Next Button */}
      <Button
        type="button"
        onClick={handleNext}
        disabled={team.length === 0 || loading}
        className="mt-4"
      >
        {loading ? (
          <Loader2 size={24} className="animate-spin" />
        ) : (
          'Generate Fixtures →'
        )}
      </Button>
    </motion.div>
  )
}
