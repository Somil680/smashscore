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
} from 'lucide-react'
import FinalWinnerCheckerLocal from './FinalWinnerCheckerLocal'
import { getTeamDetails } from '@/hooks/helperFunction'
import { useRouter } from 'next/navigation'
import { MatchWithDetails } from '@/store/type'
import useLocalTournamentStore from '@/store/useLocalTournamentStore'
import useTournamentStore from '@/store/useTournamentStore'

export interface Team {
  id: string
  // ... other team properties
}

export interface Match {
  id: string
  team_1_id: string
  team_2_id: string
  winner_team_id?: string
  tournament_id: string
  tag?: string
  // ... other match properties
}

export interface PlayoffFixture {
  teamA: Team
  teamB: Team | null // teamB can be null for a final (e.g., "Winner of Semi")
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
  } = useLocalTournamentStore()

  const { saveBatchTournamentToSupabase } = useTournamentStore()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const router = useRouter()

  // Remove unused finalMatch variable since it's not being used in the component
  // The FinalWinnerCheckerLocal handles the playoff logic now

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

    console.log('teamStats updated:', sortedStats)
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

    // Save result locally
    const scoresToSave = scoresMatch.map((s) => ({
      ...s,
      match_id: match.id,
    }))

    finishLocalMatch(match.id, winnerTeamId, scoresToSave)

    // Handle semi-final to final connectivity
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

      // Ensure tournament is not null before calling batch save
      if (!localData.tournament) {
        alert('No tournament data found to save.')
        return
      }

      const result = await saveBatchTournamentToSupabase(
        localData as Parameters<typeof saveBatchTournamentToSupabase>[0]
      )

      if (result.success) {
        setSaveSuccess(true)
        // Clear local data after successful save
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

  const TopTeams = teamStats
    .sort((a, b) => b.pointDifference - a.pointDifference)
    .map((team) => team.team.team)

  if (!currentTournament) {
    return <div>Loading or tournament not found...</div>
  }

  if (saveSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-green-400">
          Tournament Saved Successfully!
        </h2>
        <p className="text-gray-300">Redirecting to tournament details...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-lime-400 via-blue-500 to-purple-400 p-[2px] rounded-2xl">
        <div className="bg-[#111827] rounded-2xl p-5 text-white">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Trophy size={20} /> {currentTournament.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                Created:{' '}
                {new Date(currentTournament.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Type: {currentTournament.tournament_type}</span>
            </div>
            <div className="flex items-center gap-2">
              <ListChecks size={16} />
              <span>Match Type: {currentTournament.match_type}</span>
            </div>
            <div className="flex items-center gap-2">
              <ListChecks size={16} />
              <span>
                Points/Game:{' '}
                <strong>{currentTournament.points_per_game}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ListChecks size={16} />
              <span>
                Max Game Sets: <strong>{currentTournament.max_game_set}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {currentMatches.map((match) => (
        <ScoreEntryCard
          key={match.id}
          match={match}
          max_game_set={currentTournament.max_game_set}
          onSave={(match, scores, winnerId) => {
            handleSaveResult(match, scores, winnerId)
          }}
        />
      ))}

      {/* Save Tournament Button - Show when winner is declared */}
      {tournamentWinner && (
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-yellow-400 mb-2 flex-col">
              <span>🏆 Tournament Winner:</span>
              <span>{getTeamDetails(tournamentWinner).teamName}</span>
            </h3>
            <p className="text-gray-300">
              All matches completed! Ready to save tournament.
            </p>
          </div>
          <button
            onClick={handleSaveTournamentToSupabase}
            disabled={isSaving}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-colors"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving Tournament...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Tournament to Database
              </>
            )}
          </button>
        </div>
      )}

      <FinalWinnerCheckerLocal teamStats={TopTeams} />

      <div className="flex flex-wrap gap-4">
        {teamStats
          .sort((a, b) => b.pointDifference - a.pointDifference)
          .map(
            (team: { id: string; pointDifference: number; wins: number }) => {
              const participantInfo = currentTournamentParticipants.find(
                (p) => p.team_id === team.id
              )
              if (!participantInfo) return null
              const teamDetails = getTeamDetails(participantInfo.team)
              return (
                <div
                  key={team.id}
                  className="bg-transparent text-white p-[1px] rounded-xl w-full max-w-[190px]"
                >
                  <div className="bg-[#111827] rounded-xl px-3 py-2 flex flex-col border border-transparent bg-clip-padding">
                    <h3 className="text-sm font-semibold text-white">
                      {teamDetails.teamName}
                    </h3>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-lime-400 font-medium">
                        Points: {team.pointDifference}
                      </span>
                      <span className="text-xs text-blue-500 font-medium">
                        Wins: {team.wins}
                      </span>
                    </div>
                  </div>
                  <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-lime-400 via-blue-500 to-purple-400 z-[-1]" />
                </div>
              )
            }
          )}
      </div>
    </div>
  )
}

export default MatchCreateLocal
