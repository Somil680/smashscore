'use client'
import usePlayerStore from '@/store/usePlayerStore'
import HeroBanner from '../../components/HeroBanner'
import FloatingCTAWithModal from '@/components/FloatingCTAWithModal'
import { CreatePlayerDTO } from '@/store/type'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Target, Activity, TrendingUp, Trophy, X } from 'lucide-react'
import useLocalTournamentStore from '@/store/useLocalTournamentStore'
import Link from 'next/link'

// Mecha Card Component with chamfered corners
const MechaCard = ({
  title,
  icon: Icon,
  stats,
  linkText,
  linkHref,
  accentColor,
  delay = 0,
}: {
  title: string
  icon: React.ElementType
  stats: { label: string; value: string; accent?: string }[]
  linkText: string
  linkHref: string
  accentColor: string
  delay?: number
}) => {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0, rotateY: -15 }}
      whileInView={{ x: 0, opacity: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
      className="relative bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-6 overflow-hidden group"
      style={{
        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
      }}
    >
      {/* Glow effect */}
      <div
        className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-all duration-500`}
        style={{ backgroundColor: accentColor }}
      />

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-5 h-5"
        style={{
          background: `linear-gradient(135deg, transparent 50%, ${accentColor} 50%)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-5 h-5"
        style={{
          background: `linear-gradient(-45deg, transparent 50%, ${accentColor} 50%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-3 border"
            style={{
              borderColor: `${accentColor}40`,
              backgroundColor: `${accentColor}10`,
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}
          >
            <Icon className="w-6 h-6" style={{ color: accentColor }} />
          </div>
          <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wide">{title}</h3>
        </div>

        <div className="space-y-4">
          {stats.map((stat, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-700/30">
              <span className="text-slate-400 font-mono text-sm uppercase tracking-wider">{stat.label}</span>
              <span
                className="text-2xl font-bold font-mono"
                style={{ color: stat.accent || '#fff' }}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <a
          href={linkHref}
          className="mt-6 inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest transition-colors hover:text-white"
          style={{ color: accentColor }}
        >
          {linkText} <span className="text-lg">→</span>
        </a>
      </div>
    </motion.div>
  )
}

// Active Tournament Card Component
const ActiveTournamentCard = () => {
  const {
    currentTournament,
    currentTournamentParticipants,
    currentMatches,
    clearLocalTournament,
  } = useLocalTournamentStore()

  if (!currentTournament) return null

  const completedMatches = currentMatches.filter((m) => m.winner_team_id).length
  const totalMatches = currentMatches.length
  const matchTypeLabel = currentTournament.match_type === 'singles' ? 'Singles' : 'Doubles'

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this tournament? All progress will be lost.')) {
      clearLocalTournament()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl md:mx-auto px-4 mb-8"
    >
      <div
        className="relative bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-6 overflow-hidden group"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
        }}
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-all duration-500 bg-cyan-400" />

        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-5 h-5"
          style={{
            background: 'linear-gradient(135deg, transparent 50%, #06b6d4 50%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-5 h-5"
          style={{
            background: 'linear-gradient(-45deg, transparent 50%, #8b5cf6 50%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="p-3 border"
                style={{
                  borderColor: '#06b6d440',
                  backgroundColor: '#06b6d410',
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                }}
              >
                <Trophy className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wide">
                  {currentTournament.name}
                </h3>
                <p className="text-slate-400 font-mono text-xs uppercase tracking-wider mt-1">
                  Active Tournament
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCancel}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
              title="Cancel Tournament"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex flex-col">
              <span className="text-slate-400 font-mono text-xs uppercase tracking-wider mb-1">
                Match Type
              </span>
              <span className="text-white font-bold font-mono text-sm">{matchTypeLabel}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 font-mono text-xs uppercase tracking-wider mb-1">
                Participants
              </span>
              <span className="text-white font-bold font-mono text-sm">
                {currentTournamentParticipants.length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 font-mono text-xs uppercase tracking-wider mb-1">
                Matches
              </span>
              <span className="text-white font-bold font-mono text-sm">
                {completedMatches}/{totalMatches}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 font-mono text-xs uppercase tracking-wider mb-1">
                Points/Game
              </span>
              <span className="text-white font-bold font-mono text-sm">
                {currentTournament.points_per_game}
              </span>
            </div>
          </div>

          <Link href="/start-match">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-3 font-bold font-mono text-sm uppercase tracking-wider text-slate-950 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
              }}
            >
              Continue Tournament
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const { addPlayer } = usePlayerStore()
  const user = useAuthStore((s) => s.user)
  const fetchUser = useAuthStore((s) => s.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleAddPlayer = async (data: {
    name: string
    image: string
  }): Promise<void> => {
    const playerData: CreatePlayerDTO = {
      name: data.name,
      image_url: data.image,
    }
    await addPlayer(playerData)
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <HeroBanner />

      {/* Active Tournament Card */}
      <ActiveTournamentCard />

      {/* Stats Section */}
      <section className="relative py-24 px-4 bg-slate-950">
        {/* Hexagonal Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 relative z-10"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-px bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 mx-auto mb-6"
          />
          <h2 className="text-3xl md:text-5xl font-bold font-mono uppercase tracking-wider mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              Performance
            </span>
            <span className="text-white"> Matrix</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-mono">
            [ REAL-TIME ANALYTICS ] Track every metric. Optimize your game.
          </p>
        </motion.div>

        {/* Stats Cards Grid */}
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10">
          <MechaCard
            title="Smash Power"
            icon={Zap}
            accentColor="#06b6d4"
            stats={[
              { label: 'Max Speed', value: '380 km/h', accent: '#06b6d4' },
              { label: 'Avg Power', value: '85%', accent: '#fff' },
            ]}
            linkText="Analyze"
            linkHref="#"
            delay={0}
          />

          <MechaCard
            title="Coverage"
            icon={Target}
            accentColor="#3b82f6"
            stats={[
              { label: 'Distance', value: '1.2 km', accent: '#3b82f6' },
              { label: 'Efficiency', value: '94%', accent: '#fff' },
            ]}
            linkText="Heatmap"
            linkHref="#"
            delay={0.1}
          />

          <MechaCard
            title="Net Play"
            icon={Activity}
            accentColor="#8b5cf6"
            stats={[
              { label: 'Net Kills', value: '12', accent: '#8b5cf6' },
              { label: 'Errors', value: '3', accent: '#f87171' },
            ]}
            linkText="Details"
            linkHref="#"
            delay={0.2}
          />

          <MechaCard
            title="Win Rate"
            icon={TrendingUp}
            accentColor="#10b981"
            stats={[
              { label: 'Matches', value: '24', accent: '#10b981' },
              { label: 'Win %', value: '83%', accent: '#fff' },
            ]}
            linkText="History"
            linkHref="#"
            delay={0.3}
          />
        </div>

        {/* Bottom HUD */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-16 gap-8 font-mono text-xs text-slate-600"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            SYNC ACTIVE
          </span>
          <span>LAST UPDATE: 2.3s AGO</span>
          <span>SESSION: 00:42:17</span>
        </motion.div>
      </section>

      {user && <FloatingCTAWithModal onSubmit={handleAddPlayer} />}
    </div>
  )
}
