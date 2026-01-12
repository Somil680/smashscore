'use client'

import React from 'react'
import Image from 'next/image'
import { Player } from '@/store/type'
import { Button } from '../ui/button'
import { supabase } from '@/lib/supabase'
import usePlayerStore from '@/store/usePlayerStore'
import { motion } from 'framer-motion'

interface PlayerCardProps {
  player: Player
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const { fetchPlayers } = usePlayerStore()

  const handleActiveStatus = async (player: Player) => {
    const { error } = await supabase
      .from('players')
      .update({ active: !player.active })
      .eq('id', player.id)
    if (error) throw error
    if (!error) {
      fetchPlayers()
    }
  }

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)' }}
      className="relative bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-4 overflow-hidden group"
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

      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

      <div className="flex justify-between items-center relative z-10">
        {/* Player Image + Name */}
        <div className="flex items-center gap-4">
          <div
            className="relative"
            style={{
              padding: '2px',
              background: player.active
                ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)'
                : 'linear-gradient(135deg, #475569, #64748b)',
              clipPath:
                'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}
          >
            <Image
              src={player.image_url || '/profileImage/i1.png'}
              alt={player.name}
              width={56}
              height={56}
              className="object-cover bg-slate-800"
              style={{
                clipPath:
                  'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
              }}
            />
          </div>

          <div>
            <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-white">
              {player.name}
            </h2>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Joined: {new Date(player.created_at).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>

        {/* Status Button */}
        <Button
          variant={player.active ? 'default' : 'secondary'}
          size="sm"
          onClick={() => handleActiveStatus(player)}
        >
          {player.active ? 'Active' : 'Inactive'}
        </Button>
      </div>
    </motion.div>
  )
}

export default PlayerCard
