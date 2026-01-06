'use client'

import { motion } from 'framer-motion'

export default function RealisticPulseLoader() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="relative w-16 h-16">
        {/* Outer pulsing ring */}
        <motion.span
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
          }}
          initial={{ scale: 0.8, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
        {/* Middle ring */}
        <motion.span
          className="absolute inset-1"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          }}
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1.3, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 0.2,
          }}
        />
        {/* Core element */}
        <motion.span
          className="absolute inset-2"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
          }}
          animate={{ 
            opacity: [1, 0.5, 1],
            boxShadow: [
              '0 0 20px rgba(6, 182, 212, 0.5)',
              '0 0 40px rgba(139, 92, 246, 0.5)',
              '0 0 20px rgba(6, 182, 212, 0.5)',
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-mono text-slate-950 font-bold">...</span>
        </div>
      </div>
    </div>
  )
}
