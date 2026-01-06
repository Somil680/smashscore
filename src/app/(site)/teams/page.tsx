'use client'
import TeamCard from '@/components/teams/TeamCard'
import { calculateTeamStats } from '@/hooks/calculateTeamsStats'
import useTeamStore from '@/store/useTeamStore'
import useTournamentStore from '@/store/useTournamentStore'
import { Users } from 'lucide-react'
import { useEffect } from 'react'
import { motion } from 'framer-motion'

const TeamListPage = () => {
  const { teams, fetchTeams } = useTeamStore()
  const { matches, fetchMatches } = useTournamentStore()

  useEffect(() => {
    fetchTeams()
    fetchMatches()
  }, [])

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
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
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
          [ {teams.length} TEAMS ACTIVE ] • PERFORMANCE MATRIX
        </p>
      </motion.div>

      {/* Teams Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {teams.map((team) => {
          const stats = calculateTeamStats(team.id, matches)
          return (
            <motion.div key={team.id} variants={itemVariants}>
              <TeamCard team={team} stats={stats} />
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default TeamListPage
