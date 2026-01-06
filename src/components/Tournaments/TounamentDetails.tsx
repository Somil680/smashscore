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
  Zap,
  Crown,
  Target,
} from 'lucide-react'
import {
  TeamWithPlayers,
  MatchWithScoresAndDetails,
  TournamentWithDetails,
} from '@/store/type'
import { motion } from 'framer-motion'

// ============================================================================
// 1. HELPER FUNCTIONS & COMPONENTS
// ============================================================================

const TeamDisplay = ({
  team,
  isWinner = false,
}: {
  team: TeamWithPlayers | null
  className?: string
  isWinner?: boolean
}) => {
  if (!team) {
    return <div className="text-slate-500 font-mono text-sm">TBA</div>
  }
  const teamName = team.player_2
    ? `${team.player_1.name} & ${team.player_2.name}`
    : team.player_1.name

  return (
    <div
      className={`px-4 py-2 font-mono font-bold text-sm uppercase tracking-wider text-center transition-all ${
        isWinner ? 'text-yellow-400' : 'text-white'
      }`}
      style={{
        background: isWinner
          ? 'linear-gradient(135deg, rgba(250, 204, 21, 0.1), rgba(245, 158, 11, 0.1))'
          : 'rgba(15, 23, 42, 0.4)',
        clipPath:
          'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        border: isWinner
          ? '1px solid rgba(250, 204, 21, 0.3)'
          : '1px solid rgba(51, 65, 85, 0.5)',
      }}
    >
      {teamName}
    </div>
  )
}

const MatchCard = ({ match, index }: { match: MatchWithScoresAndDetails; index: number }) => {
  const winnerTeam = match.winner_team_id
    ? match.team_1?.id === match.winner_team_id
      ? match.team_1
      : match.team_2
    : null

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-5 overflow-hidden"
      style={{
        clipPath:
          'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
      }}
    >
      {/* Corner Accents */}
      <div
        className="absolute top-0 right-0 w-4 h-4 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 50%, #06b6d4 50%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-4 h-4 pointer-events-none"
        style={{
          background: 'linear-gradient(-45deg, transparent 50%, #8b5cf6 50%)',
        }}
      />

      {/* Match Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            {match.tag || 'Match'}
          </span>
        </div>
        {winnerTeam && (
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-yellow-400">
              Winner Declared
            </span>
          </div>
        )}
      </div>

      {/* Teams Display */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="flex flex-col items-center gap-2 flex-1 relative">
          {winnerTeam?.id === match.team_1?.id && (
            <Crown
              size={20}
              className="text-yellow-400 absolute -top-6 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
            />
          )}
          <TeamDisplay
            team={match.team_1}
            isWinner={winnerTeam?.id === match.team_1?.id}
          />
        </div>

        <div
          className="px-3 py-1 text-xs font-mono font-bold text-slate-500"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            clipPath:
              'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
          }}
        >
          VS
        </div>

        <div className="flex flex-col items-center gap-2 flex-1 relative">
          {winnerTeam?.id === match.team_2?.id && (
            <Crown
              size={20}
              className="text-yellow-400 absolute -top-6 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
            />
          )}
          <TeamDisplay
            team={match.team_2}
            isWinner={winnerTeam?.id === match.team_2?.id}
          />
        </div>
      </div>

      {/* Scores */}
      <div className="flex justify-center gap-4 text-sm font-mono">
        {match.match_scores.map((score, idx) => (
          <div
            key={idx}
            className="px-4 py-2 bg-slate-800/40 border border-slate-700/30"
            style={{
              clipPath:
                'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
            }}
          >
            <span className="text-slate-500 text-xs">G{idx + 1}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-cyan-400 font-bold">{score.team_1_score}</span>
              <span className="text-slate-600">-</span>
              <span className="text-violet-400 font-bold">{score.team_2_score}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
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
    return (
      <div className="text-slate-400 font-mono text-center py-12">
        [ Select a tournament to view details ]
      </div>
    )
  }

  const winnerTeam = tournament.winner_team

  return (
    <div className="space-y-6">
      {/* Tournament Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-6 overflow-hidden"
        style={{
          clipPath:
            'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
        }}
      >
        {/* Corner Accents */}
        <div
          className="absolute top-0 right-0 w-6 h-6 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 50%, #06b6d4 50%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none"
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
            <Trophy size={24} className="text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold font-mono uppercase tracking-wider text-white">
            {tournament.name}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={14} className="text-cyan-400" />
            <span>{new Date(tournament.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Users size={14} className="text-blue-400" />
            <span className="uppercase">{tournament.tournament_type}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ListChecks size={14} className="text-violet-400" />
            <span className="uppercase">{tournament.match_type}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Zap size={14} className="text-cyan-400" />
            <span>
              Points:{' '}
              <strong className="text-white">
                {tournament.points_per_game || 21}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Target size={14} className="text-violet-400" />
            <span>
              Sets:{' '}
              <strong className="text-white">
                {tournament.max_game_set || 1}
              </strong>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tournament Champion */}
      {winnerTeam && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-slate-900/80 backdrop-blur-md border border-yellow-500/30 p-8 text-center overflow-hidden"
          style={{
            clipPath:
              'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
            boxShadow: '0 0 40px rgba(250, 204, 21, 0.15)',
          }}
        >
          <div
            className="absolute top-0 right-0 w-6 h-6 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 50%, #eab308 50%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none"
            style={{
              background: 'linear-gradient(-45deg, transparent 50%, #eab308 50%)',
            }}
          />

          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center gap-3 mb-4"
          >
            <Award size={32} className="text-yellow-400" />
            <Trophy size={32} className="text-yellow-400" />
            <Award size={32} className="text-yellow-400" />
          </motion.div>

          <h3 className="text-xl font-bold font-mono uppercase tracking-wider text-yellow-400 mb-4">
            Tournament Champion
          </h3>

          <div
            className="inline-block px-6 py-3"
            style={{
              background:
                'linear-gradient(135deg, rgba(250, 204, 21, 0.2), rgba(245, 158, 11, 0.2))',
              clipPath:
                'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
              border: '2px solid rgba(250, 204, 21, 0.5)',
            }}
          >
            <span className="text-xl font-bold font-mono text-white">
              {winnerTeam.player_2
                ? `${winnerTeam.player_1.name} & ${winnerTeam.player_2.name}`
                : winnerTeam.player_1.name}
            </span>
          </div>
        </motion.div>
      )}

      {/* Matches Section */}
      <div>
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
            <Swords size={18} className="text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-white">
            All Matches
          </h3>
          <span className="text-xs font-mono text-slate-500">
            [ {tournament.matches.length} Total ]
          </span>
        </div>

        <div className="space-y-4">
          {tournament.matches.length > 0 ? (
            tournament.matches
              .sort(
                (a, b) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
              )
              .map((match, index) => (
                <MatchCard key={match.id} match={match} index={index} />
              ))
          ) : (
            <div className="text-center py-8 text-slate-500 font-mono text-sm">
              [ No matches have been played yet ]
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TournamentDetails
