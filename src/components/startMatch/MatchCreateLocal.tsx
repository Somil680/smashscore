'use client'
import React, { useMemo, useState } from 'react'
import ScoreEntryCard from './ScoreEntryCard'
import {
  Trophy,
  Calendar,
  Users,
  ListChecks,
  Save,
  Loader2,
  Zap,
  Target,
} from 'lucide-react'
import FinalWinnerCheckerLocal from './FinalWinnerCheckerLocal'
import { getTeamDetails } from '@/hooks/helperFunction'
import { useRouter } from 'next/navigation'
import { MatchWithDetails } from '@/store/type'
import useLocalTournamentStore from '@/store/useLocalTournamentStore'
import useTournamentStore from '@/store/useTournamentStore'
import { motion } from 'framer-motion'

export interface Team {
  id: string
}

export interface Match {
  id: string
  team_1_id: string
  team_2_id: string
  winner_team_id?: string
  tournament_id: string
  tag?: string
}

export interface PlayoffFixture {
  teamA: Team
  teamB: Team | null
  tag: 'Semi-Final' | 'Final Match'
}

const MatchCreateLocal = () => {
  const {
    currentTournament,
    currentTournamentParticipants,
    currentMatches,
    currentMatchScores,
    finishLocalMatch,
    updateLocalMatch,
    tournamentWinner,
    getLocalTournamentData,
    clearLocalTournament,
    deleteMatchResult,
  } = useLocalTournamentStore()

  const { saveBatchTournamentToSupabase } = useTournamentStore()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const router = useRouter()

  const teamStats = useMemo(() => {
    if (currentTournamentParticipants.length === 0) return []

    const stats = currentTournamentParticipants.map((team) => ({
      id: team.team.id,
      wins: 0,
      pointDifference: 0,
      team,
    }))

    for (const match of currentMatches) {
      if (!match.winner_team_id) continue

      const winnerIndex = stats.findIndex((t) => t.id === match.winner_team_id)
      if (winnerIndex !== -1) {
        stats[winnerIndex].wins += 1
      }

      const matchScoresForThisMatch = currentMatchScores.filter(
        (s) => s.match_id === match.id
      )
      let totalPoints1 = 0
      let totalPoints2 = 0

      for (const game of matchScoresForThisMatch) {
        totalPoints1 += game.team_1_score
        totalPoints2 += game.team_2_score
      }

      const pointDiff = totalPoints1 - totalPoints2
      const team1Index = stats.findIndex((t) => t.id === match.team_1_id)
      const team2Index = stats.findIndex((t) => t.id === match.team_2_id)

      if (team1Index !== -1) stats[team1Index].pointDifference += pointDiff
      if (team2Index !== -1) stats[team2Index].pointDifference -= pointDiff
    }

    const sortedStats = stats.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins
      return b.pointDifference - a.pointDifference
    })

    return sortedStats
  }, [currentTournamentParticipants, currentMatches, currentMatchScores])

  const handleSaveResult = (
    match: MatchWithDetails | Match,
    scoresMatch: {
      game_number: number
      team_1_score: number
      team_2_score: number
    }[],
    winnerTeamId: string
  ) => {
    if (!currentTournament) return

    const scoresToSave = scoresMatch.map((s) => ({
      ...s,
      match_id: match.id,
    }))

    finishLocalMatch(match.id, winnerTeamId, scoresToSave)

    if (match.tag === 'Semi-Final') {
      const finalMatch = currentMatches.find(
        (m) => m.tag === 'Final Match' && m.team_2_id === null
      )

      if (finalMatch) {
        updateLocalMatch(finalMatch.id, { team_2_id: winnerTeamId })
      }
    }
  }

  const handleSaveTournamentToSupabase = async () => {
    if (!currentTournament) return

    setIsSaving(true)
    try {
      const localData = getLocalTournamentData()

      if (!localData.tournament) {
        alert('No tournament data found to save.')
        return
      }

      const result = await saveBatchTournamentToSupabase(
        localData as Parameters<typeof saveBatchTournamentToSupabase>[0]
      )

      if (result.success) {
        setSaveSuccess(true)
        setTimeout(() => {
          clearLocalTournament()
          router.push(`/tournaments/${result.tournamentId}`)
        }, 2000)
      } else {
        alert(`Failed to save tournament: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving tournament:', error)
      alert('Failed to save tournament. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Function to get all player IDs from a match
  const getPlayerIdsFromMatch = (
    match: (typeof currentMatches)[0]
  ): Set<string> => {
    const playerIds = new Set<string>()
    if (match.team_1?.player_1?.id) {
      playerIds.add(match.team_1.player_1.id)
      if (match.team_1.player_2?.id) {
        playerIds.add(match.team_1.player_2.id)
      }
    }
    if (match.team_2?.player_1?.id) {
      playerIds.add(match.team_2.player_1.id)
      if (match.team_2.player_2?.id) {
        playerIds.add(match.team_2.player_2.id)
      }
    }
    return playerIds
  }

  const TopTeams = teamStats
    .sort((a, b) => b.pointDifference - a.pointDifference)
    .map((team) => team.team.team)

  if (!currentTournament) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400 font-mono text-sm uppercase tracking-wider">
          [ Loading Tournament Data... ]
        </div>
      </div>
    )
  }

  if (saveSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 space-y-4"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="text-6xl"
        >
          �
        </motion.div>
        <h2 className="text-2xl font-bold font-mono uppercase tracking-wider text-gradient">
          Tournament Saved!
        </h2>
        <p className="text-slate-400 font-mono text-sm">
          Redirecting to tournament details...
        </p>
      </motion.div>
    )
  }

  return (
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 w-full max-w-lg mx-auto"
    >

      {/* Tournament Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-6 overflow-hidden"
        style={{
          clipPath:
            'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
        }}
      >
        {/* Corner Accents */}
        <div
          className="absolute top-0 right-0 w-5 h-5 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 50%, #06b6d4 50%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-5 h-5 pointer-events-none"
          style={{
            background: 'linear-gradient(-45deg, transparent 50%, #8b5cf6 50%)',
          }}
        />

        <div className="flex items-center gap-3 mb-4">
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
            <Trophy size={20} className="text-yellow-400" />
          </div>
          <h2 className="text-xl font-bold font-mono uppercase tracking-wider text-white">
            {currentTournament.name}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={14} className="text-cyan-400" />
            <span>
              {new Date(currentTournament.created_at).toLocaleDateString(
                'en-GB'
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Users size={14} className="text-blue-400" />
            <span className="uppercase">
              {currentTournament.tournament_type}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ListChecks size={14} className="text-violet-400" />
            <span className="uppercase">{currentTournament.match_type}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Zap size={14} className="text-cyan-400" />
            <span>
              Points:{' '}
              <strong className="text-white">
                {currentTournament.points_per_game}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Target size={14} className="text-violet-400" />
            <span>
              Sets:{' '}
              <strong className="text-white">
                {currentTournament.max_game_set}
              </strong>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Match Cards */}
      <div className="space-y-4">
        {currentMatches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ScoreEntryCard
              match={match}
              max_game_set={currentTournament.max_game_set}
              matchScores={currentMatchScores.filter(
                (s) => s.match_id === match.id
              )}
              onSave={(match, scores, winnerId) => {
                handleSaveResult(match, scores, winnerId)
              }}
              onDelete={() => {
                deleteMatchResult(match.id)
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Tournament Winner & Save Button */}
      {tournamentWinner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 p-8 text-center"
          style={{
            clipPath:
              'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.2)',
          }}
        >
          <div
            className="absolute top-0 right-0 w-6 h-6 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, transparent 50%, #06b6d4 50%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none"
            style={{
              background:
                'linear-gradient(-45deg, transparent 50%, #8b5cf6 50%)',
            }}
          />

          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-4"
          >
            🏆
          </motion.div>
          <h3 className="text-2xl font-bold font-mono uppercase tracking-wider mb-2">
            <span className="text-gradient">Tournament Winner</span>
          </h3>
          <p className="text-xl font-bold text-white mb-4">
            {getTeamDetails(tournamentWinner).teamName}
          </p>
          <p className="text-slate-400 font-mono text-sm mb-6">
            [ All matches completed • Ready to save ]
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveTournamentToSupabase}
            disabled={isSaving}
            className="px-8 py-4 font-bold font-mono uppercase tracking-wider text-slate-950 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              clipPath:
                'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
            }}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={20} />
                Save Tournament
              </span>
            )}
          </motion.button>
        </motion.div>
      )}

      <FinalWinnerCheckerLocal teamStats={TopTeams} />

      {/* Team Stats Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-400">
          [ Team Rankings ]
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {teamStats
            .sort((a, b) => b.pointDifference - a.pointDifference)
            .map((team, index) => {
              const participantInfo = currentTournamentParticipants.find(
                (p) => p.team_id === team.id
              )
              if (!participantInfo) return null
              const teamDetails = getTeamDetails(participantInfo.team)

              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-3"
                  style={{
                    clipPath:
                      'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                  }}
                >
                  {/* Rank Badge */}
                  <div
                    className="absolute -top-1 -left-1 w-6 h-6 flex items-center justify-center text-xs font-bold font-mono"
                    style={{
                      background:
                        index === 0
                          ? 'linear-gradient(135deg, #eab308, #f59e0b)'
                          : index === 1
                          ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                          : index === 2
                          ? 'linear-gradient(135deg, #d97706, #b45309)'
                          : 'linear-gradient(135deg, #475569, #334155)',
                      clipPath:
                        'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
                      color: '#020617',
                    }}
                  >
                    {index + 1}
                  </div>

                  <h4 className="text-sm font-bold font-mono text-white mt-2 truncate">
                    {teamDetails.teamName}
                  </h4>
                  <div className="flex justify-between mt-2 text-xs font-mono">
                    <span className="text-cyan-400">
                      PTS: {team.pointDifference > 0 ? '+' : ''}
                      {team.pointDifference}
                    </span>
                    <span className="text-violet-400">W: {team.wins}</span>
                  </div>
                </motion.div>
              )
            })}
        </div>
      </div>
    </motion.div>
  )
}

export default MatchCreateLocal
