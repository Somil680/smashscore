'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ProgressStepperProps {
  step: number
  total: number
  labels: string[]
}

export default function ProgressStepper({
  step,
  labels,
}: ProgressStepperProps) {
  return (
    <div className="w-full flex items-center justify-between gap-0 mb-8 relative">
      {/* Background line */}
      <div className="absolute top-4 left-0 right-0 h-px bg-slate-800 -z-10" />
      
      {labels.map((label, idx) => (
        <div key={label} className="flex-1 flex flex-col items-center">
          {/* Step indicator */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`w-8 h-8 flex items-center justify-center mb-2 font-mono text-sm font-bold transition-all duration-300 ${
              idx === step
                ? 'text-slate-950'
                : idx < step
                ? 'text-slate-950'
                : 'text-slate-500 border border-slate-700'
            }`}
            style={{
              background: idx <= step 
                ? 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)' 
                : 'transparent',
              clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
              boxShadow: idx === step ? '0 0 20px rgba(6, 182, 212, 0.4)' : 'none',
            }}
          >
            {idx + 1}
          </motion.div>
          
          {/* Label */}
          <span
            className={`text-xs font-mono uppercase tracking-wider transition-colors duration-300 ${
              idx === step ? 'text-cyan-400' : 'text-slate-500'
            }`}
          >
            {label}
          </span>
          
          {/* Active indicator bar */}
          {idx === step && (
            <motion.div
              layoutId="activeStep"
              className="h-0.5 w-12 mt-2"
              style={{
                background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)',
                boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
