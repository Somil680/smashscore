'use client'

import { motion } from 'framer-motion'

export default function RealisticPulseLoader() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="relative w-12 h-12">
        <motion.span
          className="absolute inset-0 rounded-full bg-blue-500"
          initial={{ scale: 0.8, opacity: 1 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.span
          className="absolute inset-0 rounded-full bg-blue-500"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: [1, 1.15, 1], opacity: [1, 0.7, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  )
}
