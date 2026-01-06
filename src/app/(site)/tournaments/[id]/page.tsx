'use client'

import TournamentDetails from '@/components/Tournaments/TounamentDetails'
import RealisticPulseLoader from '@/components/ui/loading'
import useTournamentStore from '@/store/useTournamentStore'
import React, { use, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Database, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params)
  const { id } = resolvedParams
  const { activeTournament, fetchTournamentDetails } = useTournamentStore()

  useEffect(() => {
    fetchTournamentDetails(id)
  }, [fetchTournamentDetails, id])

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 hex-grid opacity-30 pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/tournaments"
            className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Tournaments
          </Link>
        </motion.div>

        {activeTournament ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <TournamentDetails tournament={activeTournament} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div
              className="p-4 mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
                clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
              }}
            >
              <Database className="w-8 h-8 text-cyan-400" />
            </div>
            <RealisticPulseLoader />
            <p className="mt-4 text-slate-400 font-mono text-sm uppercase tracking-wider">
              [ Loading Tournament Data... ]
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Page
