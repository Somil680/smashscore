'use client'

import { TournamentPagination } from '@/components/Tournaments/TournamentsPagination'
import RealisticPulseLoader from '@/components/ui/loading'
import { getTeamDetails } from '@/hooks/helperFunction'
import { TournamentWithWinner } from '@/store/type'
import { useAuthStore } from '@/store/useAuthStore'
import useTournamentStore from '@/store/useTournamentStore'
import {
  Trophy,
  Calendar,
  Users,
  ListChecks,
  Swords,
  ChevronRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

const TournamentPage = () => {
  const user = useAuthStore((s) => s.user)
  const { fetchTournaments, tournaments, loading } = useTournamentStore()
  const router = useRouter()

  useEffect(() => {
    fetchTournaments(user?.id || null, 0)
  }, [user, fetchTournaments])

  const handleOpenTournamentDetails = (item: TournamentWithWinner) => {
    router.push(`/tournaments/${item.id}`)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 text-center"
      >
        <div
          className="inline-flex items-center justify-center p-3 mb-4"
          style={{
            background:
              'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
            clipPath:
              'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
          }}
        >
          <Swords className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-mono uppercase tracking-wider">
          <span className="text-gradient">Tournament</span>
          <span className="text-white"> Archive</span>
        </h1>
        <p className="mt-2 text-slate-400 font-mono text-sm">
          [ {tournaments.length} TOURNAMENTS ] • MATCH HISTORY
        </p>
      </motion.div>

      {loading ? (
        <RealisticPulseLoader />
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 max-w-4xl mx-auto"
          >
            {tournaments.map((item) => {
              const teamName = item.winner_team_id
                ? getTeamDetails(item.winner_team)
                : { teamName: 'Winner TBA', playerImages: [], teamId: null }

              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{
                    x: 8,
                    boxShadow: '0 0 30px rgba(6, 182, 212, 0.2)',
                  }}
                  onClick={() => handleOpenTournamentDetails(item)}
                  className="relative cursor-pointer bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-5 overflow-hidden group"
                  style={{
                    clipPath:
                      'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                  }}
                >
                  {/* Corner Accents */}
                  <div
                    className="absolute top-0 right-0 w-5 h-5 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(135deg, transparent 50%, #06b6d4 50%)',
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-5 h-5 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(-45deg, transparent 50%, #8b5cf6 50%)',
                    }}
                  />

                  {/* Glow effect */}
                  <div className="absolute top-0 right-0 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

                  <div className="relative z-10">
                    {/* Winner */}
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold font-mono uppercase tracking-wider text-white flex items-center gap-3">
                        <Trophy size={20} className="text-yellow-400" />
                        {teamName.teamName}
                      </h2>
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm font-mono">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={14} className="text-cyan-400" />
                        <span>
                          {new Date(item.created_at).toLocaleDateString(
                            'en-GB'
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users size={14} className="text-blue-400" />
                        <span className="uppercase">
                          {item.tournament_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <ListChecks size={14} className="text-violet-400" />
                        <span className="uppercase">{item.match_type}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
          <TournamentPagination />
        </>
      )}
    </div>
  )
}

export default TournamentPage
