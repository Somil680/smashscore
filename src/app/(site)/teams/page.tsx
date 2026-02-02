'use client'
import TeamCard from '@/components/teams/TeamCard'
import { calculateTeamStats } from '@/hooks/calculateTeamsStats'
import useTeamStore from '@/store/useTeamStore'
import useTournamentStore from '@/store/useTournamentStore'
import { Users, User, UserCheck } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

type TeamType = 'singles' | 'doubles'

const TeamListPage = () => {
  const { teams, fetchTeams } = useTeamStore()
  // const { matches, fetchMatches  } = useTournamentStore()

  const [activeTab, setActiveTab] = useState<TeamType>('singles')

  useEffect(() => {
    fetchTeams()
    // fetchMatches()
  }, [fetchTeams])

  // Filter and sort teams based on active tab and win rate
  const filteredAndSortedTeams = useMemo(() => {
    // First filter teams
    let filtered = []
    if (activeTab === 'singles') {
      filtered = teams.filter((team) => !team.player_2_id || !team.player_2)
    } else {
      filtered = teams.filter((team) => team.player_2_id && team.player_2)
    }
    return filtered.sort((a, b) => {
      return b.win_rate - a.win_rate
    })
  }, [teams, activeTab])


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header Section */}
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
          <Users className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-mono uppercase tracking-wider">
          <span className="text-gradient">Team</span>
          <span className="text-white"> Standings</span>
        </h1>
        <p className="mt-2 text-slate-400 font-mono text-sm">
          [ {filteredAndSortedTeams.length}{' '}
          {activeTab === 'singles' ? 'SINGLES' : 'DOUBLES'} TEAMS ] •
          PERFORMANCE MATRIX
        </p>
      </motion.div>

      {/* Tab Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex justify-center mb-8"
      >
        <div className="inline-flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1.5 gap-2">
          <motion.button
            onClick={() => setActiveTab('singles')}
            className={`relative px-6 py-3 rounded-full font-semibold text-sm font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'singles'
                ? 'text-black'
                : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeTab === 'singles' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-[#00f260] to-[#057516] rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <User className="w-4 h-4" />
              Single Player
            </span>
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('doubles')}
            className={`relative px-6 py-3 rounded-full font-semibold text-sm font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'doubles'
                ? 'text-black'
                : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeTab === 'doubles' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-[#00f260] to-[#057516] rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <Users className="w-4 h-4" />
              Double Players
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Teams Grid */}
      {filteredAndSortedTeams.length > 0 ? (
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAndSortedTeams.map((team) => {
            return (
              <motion.div key={team.id} variants={itemVariants}>
                <TeamCard team={team} />
              </motion.div>
            )
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="inline-flex items-center justify-center p-4 mb-4 bg-white/5 rounded-full border border-white/10">
            <Users className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400 font-mono uppercase tracking-wider">
            No {activeTab === 'singles' ? 'Singles' : 'Doubles'} Teams Found
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default TeamListPage
