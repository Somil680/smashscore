'use client'
import { User } from 'lucide-react'
import PlayerCard from '../../../components/Player/Playercard'
import usePlayerStore from '@/store/usePlayerStore'
import { motion } from 'framer-motion'

const PlayerList = () => {
  const { players } = usePlayerStore()

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
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
          }}
        >
          <User className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-mono uppercase tracking-wider">
          <span className="text-gradient">Players</span>
        </h1>
        <p className="mt-2 text-slate-400 font-mono text-sm">
          [ TOTAL: {players.length} REGISTERED ]
        </p>
      </motion.div>

      {/* Players Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {players.map((player) => (
          <motion.div key={player.id} variants={itemVariants}>
            <PlayerCard player={player} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default PlayerList
