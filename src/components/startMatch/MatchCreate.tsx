'use client'
import React, { useEffect, useMemo } from 'react'
import ScoreEntryCard from './ScoreEntryCard'
import { useBadmintonStore } from '@/store/useBadmintonStore'
import { Trophy, Calendar, Users, ListChecks } from 'lucide-react'
import FinalWinnerChecker from './FinalWinnerChecker'
import { getTeamDetails } from '@/hooks/helperFunction'
import { useRouter } from 'next/navigation'
import { MatchWithDetails, MatchScore } from '@/store/type'
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

const MatchCreate = () => {
  const {
    tournaments,
    activeTournamentId,
    activeTeams,
    matches,
    activeTournamentParticipants,
    fetchMatchesForTournament,
    finishMatch,
    updateMatch,
    matchScores,
    fetchTournamentsParticipants,
    setTournamentWinner,
  } = useBadmintonStore()
  console.log('🚀 ~ MatchCreate ~ matches:', matches)
  const router = useRouter()
  useEffect(() => {
    if (!activeTournamentId || activeTeams.length === 0) return
    fetchMatchesForTournament(activeTournamentId)
    fetchTournamentsParticipants(activeTournamentId)
  }, [activeTournamentId, fetchMatchesForTournament])

  const { finalMatch } = useMemo(() => {
    if (matches.length === 0)
      return {
        groupStageCompleted: false,
        playoffsExist: false,
        finalMatch: null,
      }

    const groupStageMatches = matches.filter(
      (m) => m.tag !== 'Semi-Final' && m.tag !== 'Final Match'
    )
    const semiFinalMatch = matches.find((m) => m.tag === 'Semi-Final')
    const finalMatch = matches.find((m) => m.tag === 'Final Match')

    return {
      groupStageCompleted: groupStageMatches.every(
        (match) => !!match.winner_team_id
      ),
      playoffsExist: !!semiFinalMatch,
      finalMatch: finalMatch || null,
    }
  }, [matches])

  const teamStats = useMemo(() => {
    if (activeTeams.length === 0) return []

    // This logic is similar to your generatePlayoffFixtures function
    const stats = activeTeams.map((team) => ({
      id: team.id,
      wins: 0,
      pointDifference: 0,
      team,
    }))

    for (const match of matches) {
      if (!match.winner_team_id) continue

      const winnerIndex = stats.findIndex((t) => t.id === match.winner_team_id)
      if (winnerIndex !== -1) {
        stats[winnerIndex].wins += 1
      }

      const matchScoresForThisMatch = matchScores.filter(
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

    // Sort the stats for display
    return stats.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins
      return b.pointDifference - a.pointDifference
    })
  }, [matches, matchScores, activeTeams])

  const allMatchesCompleted = useMemo(() => {
    if (matches.length === 0) return false
    // We only check for matches without a playoff tag
    const groupStageMatches = matches.filter(
      (m) => m.tag !== 'Semi-Final' && m.tag !== 'Final Match'
    )
    return groupStageMatches.every((match) => !!match.winner_team_id)
  }, [matches])
  console.log(
    '🚀 ~ allMatchesCompleted ~ allMatchesCompleted:',
    allMatchesCompleted
  )

  const handleSaveResult = (
    match: MatchWithDetails | Match,
    scoresMatch: {
      game_number: number
      team_1_score: number
      team_2_score: number
    }[],
    winnerTeamId: string
  ) => {
    if (!activeTournamentId) return
    // First, save the result of the match that was just played
    const scoresToSave: Omit<MatchScore, 'id'>[] = scoresMatch.map((s) => ({
      ...s,
      match_id: match.id,
      tournament_id: activeTournamentId,
    }))
    finishMatch(match.id, winnerTeamId, scoresToSave)

    // --- THIS IS THE NEW CONNECTIVITY LOGIC ---
    // If the match that just finished was a semi-final...
    if (match.tag === 'Semi-Final') {
      // Find the final match (the one with a null opponent)
      const finalMatch = matches.find(
        (m) => m.tag === 'Final Match' && m.team_2_id === null
      )

      if (finalMatch) {
        console.log(
          `Updating Final Match (${finalMatch.id}) with winner: ${winnerTeamId}`
        )
        // Update the final match to set team_2_id to the winner of the semi-final
        updateMatch(finalMatch.id, { team_2_id: winnerTeamId })
      }
    }
  }

  const handleDeclareWinner = () => {
    if (finalMatch && finalMatch.winner_team_id && activeTournamentId) {
      setTournamentWinner(activeTournamentId, finalMatch.winner_team_id)
      router.replace(`tournaments/${activeTournamentId}`)
    } else {
      alert('Final match is not yet complete.')
    }
  }

  const activeTournament = tournaments.find((t) => t.id === activeTournamentId)

  if (!activeTournament) {
    return <div>Loading or tournament not found...</div>
  }
  return (
    <div className="space-y-4 ">
      <div className="bg-gradient-to-r from-lime-400 via-blue-500 to-purple-400 p-[2px] rounded-2xl">
        <div className="bg-[#111827] rounded-2xl p-5 text-white">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Trophy size={20} /> {activeTournament.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                Created:{' '}
                {new Date(activeTournament.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Type: {activeTournament.tournament_type}</span>
            </div>
            <div className="flex items-center gap-2">
              <ListChecks size={16} />
              <span>Match Type: {activeTournament.match_type}</span>
            </div>
            <div className="flex items-center gap-2">
              <ListChecks size={16} />
              <span>
                Points/Game: <strong>{21}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ListChecks size={16} />
              <span>
                Max Game Sets: <strong>{1}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
      {matches.map((match) => (
        <ScoreEntryCard
          key={match.id}
          match={match}
          max_game_set={1}
          onSave={(match, scores, winnerId) => {
            handleSaveResult(match, scores, winnerId)
          }}
        />
      ))}
      {/* Render the button to generate playoffs */}
      {finalMatch &&
        finalMatch.winner_team_id &&
        !activeTournament.winner_team_id && (
          <div className="flex justify-center py-4">
            <button
              onClick={handleDeclareWinner}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg"
            >
              <Trophy size={20} />
              Declare Final Tournament Winner
            </button>
          </div>
        )}

      <FinalWinnerChecker teamStats={teamStats} />
      <div className="flex  flex-wrap gap-4">
        {teamStats
          .sort((a, b) => b.pointDifference - a.pointDifference)
          .map((team) => {
            const participantInfo = activeTournamentParticipants.find(
              (p) => p.team_id === team.id
            )
            const teamDetails = getTeamDetails(participantInfo?.team)
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
          })}
      </div>
    </div>
  )
}

export default MatchCreate
