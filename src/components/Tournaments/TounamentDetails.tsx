// components/TournamentDetails.tsx
'use client'

import React from 'react'
import {
  Trophy,
  Calendar,
  Users,
  ListChecks,
  Swords,
  Award,
  Tickets,
  Crown,
} from 'lucide-react'
import {
  TeamWithPlayers,
  MatchWithScoresAndDetails,
  TournamentWithDetails,
} from '@/store/type'
// import {
//   TournamentWithDetails,
//   MatchWithScoresAndDetails,
//   TeamWithPlayers,
// } from '@/' // Adjust path as needed

// ============================================================================
// 1. HELPER FUNCTIONS & COMPONENTS
// ============================================================================

/**
 * A small component to display the details of one team in a match.
 */
const TeamDisplay = ({
  team,
  className,
}: {
  team: TeamWithPlayers | null
  className: string
}) => {
  if (!team) {
    return <div className="text-gray-500">TBA</div>
  }
  const teamName = team.player_2
    ? `${team.player_1.name} & ${team.player_2.name}`
    : team.player_1.name

  return (
    <div className="flex flex-col items-center text-center">
      {/* <div className="flex -space-x-2">
        {team.player_1 && (
          <img
            src={
              team.player_1.image_url ||
              `https://placehold.co/40x40/E2E8F0/4A5568?text=${team.player_1.name.charAt(
                0
              )}`
            }
            alt={team.player_1.name}
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        )}
        {team.player_2 && (
          <img
            src={
              team.player_2.image_url ||
              `https://placehold.co/40x40/E2E8F0/4A5568?text=${team.player_2.name.charAt(
                0
              )}`
            }
            alt={team.player_2.name}
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        )}
      </div> */}
      <span className={className}>{teamName}</span>
    </div>
  )
}

/**
 * A component to render a single match card.
 */
const MatchCard = ({ match }: { match: MatchWithScoresAndDetails }) => {
  const winnerTeam = match.winner_team_id
    ? match.team_1?.id === match.winner_team_id
      ? match.team_1
      : match.team_2
    : null
  console.log('🚀 ~ MatchCard ~ winnerTeam:', winnerTeam)

  return (
    <div className="bg-white/90 dark:bg-[#181f2a] p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-lg">{match.tag || 'Match'}</h4>
        {winnerTeam && (
          <div className="flex items-center gap-2 text-sm font-semibold text-yellow-500">
            <Trophy size={16} />
            <span>Winner</span>
            <span>{}</span>
          </div>
        )}
      </div>

      <div className="flex items-end justify-around mb-4 h-16">
        <div
          className={`w-2/5  flex flex-col items-center ${
            winnerTeam?.id === match.team_1?.id ? 'font-bold ' : ''
          }`}
        >
          {winnerTeam?.id === match.team_1?.id && (
            <Crown size={21} color="gold" className="" />
          )}
          <TeamDisplay team={match.team_1} className=" text-sm font-semibold" />
        </div>
        <div className="text-gray-400 font-bold text-xl">VS</div>
        <div
          className={`w-2/5 flex flex-col items-center ${
            winnerTeam?.id === match.team_2?.id ? 'font-bold' : ''
          }`}
        >
          {winnerTeam?.id === match.team_2?.id && (
            <Crown size={21} color="gold" className="" />
          )}

          <TeamDisplay team={match.team_2} className=" text-sm font-semibold" />
        </div>
      </div>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400 space-y-1">
        {match.match_scores.map((score, index) => (
          <div key={index}>
            Game {index + 1}:{' '}
            <span className="font-mono font-bold text-black dark:text-white">
              {score.team_1_score} - {score.team_2_score}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 2. MAIN TOURNAMENT DETAILS COMPONENT
// ============================================================================

interface TournamentDetailsProps {
  tournament: TournamentWithDetails
}

const TournamentDetails = ({ tournament }: TournamentDetailsProps) => {
  if (!tournament) {
    return <div>Select a tournament to see the details.</div>
  }

  const winnerTeam = tournament.winner_team

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <div className="bg-gradient-to-r from-lime-400 via-blue-500 to-purple-400 p-1 rounded-2xl shadow-lg">
        {/* <div className="bg-[#111827] rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Trophy size={24} /> {tournament.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                {new Date(tournament.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{tournament.tournament_type}</span>
            </div>
            <div className="flex items-center gap-2">
              <ListChecks size={16} />
              <span>{tournament.match_type}</span>
            </div>
          </div>
        </div> */}
        <div className="bg-[#111827] rounded-2xl p-5 text-white">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Trophy size={20} color="gold" /> {tournament.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Tickets size={16} />{' '}
              <span>
                Name: {new Date(tournament.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                Created: {new Date(tournament.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Type: {tournament.tournament_type}</span>
            </div>
            <div className="flex items-center gap-2">
              <ListChecks size={16} />
              <span>Match Type: {tournament.match_type}</span>
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

      {/* Tournament Winner Display */}
      {winnerTeam && (
        <div className="p-6 bg-yellow-400 text-gray-900 rounded-2xl text-center shadow-lg">
          <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Award size={28} /> Tournament Champion! <Award size={28} />
          </h3>
          <div className="mt-4 -">
            <TeamDisplay team={winnerTeam} className="text-xl font-bold" />
          </div>
        </div>
      )}

      {/* Matches Section */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Swords size={20} /> All Matches
        </h3>
        <div className="space-y-4">
          {tournament.matches.length > 0 ? (
            tournament.matches
              .sort(
                (a, b) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
              ) // Sort matches by creation date
              .map((match) => <MatchCard key={match.id} match={match} />)
          ) : (
            <p className="text-gray-500">
              No matches have been played in this tournament yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TournamentDetails
