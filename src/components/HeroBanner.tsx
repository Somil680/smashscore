'use client'
import { useAuthStore } from '@/store/useAuthStore'
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'

// Wireframe Badminton Racket SVG Component
const WireframeRacket = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 120 280"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    {/* Racket Head - Wireframe */}
    <ellipse cx="60" cy="70" rx="45" ry="60" stroke="url(#cyberGradient)" strokeWidth="1.5" fill="none" opacity="0.8" />
    <ellipse cx="60" cy="70" rx="40" ry="54" stroke="url(#cyberGradient)" strokeWidth="0.5" fill="none" opacity="0.4" />
    {/* Strings - Horizontal */}
    {[25, 40, 55, 70, 85, 100, 115].map((y) => (
      <line key={`h-${y}`} x1="18" y1={y} x2="102" y2={y} stroke="url(#cyberGradient)" strokeWidth="0.3" opacity="0.5" />
    ))}
    {/* Strings - Vertical */}
    {[30, 40, 50, 60, 70, 80, 90].map((x) => (
      <line key={`v-${x}`} x1={x} y1="12" x2={x} y2="128" stroke="url(#cyberGradient)" strokeWidth="0.3" opacity="0.5" />
    ))}
    {/* Shaft */}
    <rect x="56" y="130" width="8" height="100" stroke="url(#cyberGradient)" strokeWidth="1" fill="none" />
    <line x1="60" y1="130" x2="60" y2="230" stroke="url(#cyberGradient)" strokeWidth="0.5" opacity="0.5" />
    {/* Handle */}
    <rect x="52" y="230" width="16" height="45" stroke="url(#cyberGradient)" strokeWidth="1.5" fill="none" />
    {/* Tech details */}
    <circle cx="60" cy="250" r="3" stroke="url(#cyberGradient)" strokeWidth="0.5" fill="none" />
    <line x1="52" y1="240" x2="68" y2="240" stroke="url(#cyberGradient)" strokeWidth="0.5" opacity="0.6" />
    <line x1="52" y1="260" x2="68" y2="260" stroke="url(#cyberGradient)" strokeWidth="0.5" opacity="0.6" />
  </svg>
)

// Wireframe Shuttlecock SVG Component with glitch effect
const WireframeShuttlecock = ({ className, glitch }: { className?: string; glitch?: boolean }) => (
  <svg
    viewBox="0 0 80 120"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={glitch ? { filter: 'url(#glitch)' } : {}}
  >
    <defs>
      <linearGradient id="shuttleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <filter id="glitch">
        <feOffset in="SourceGraphic" dx="2" dy="0" result="r" />
        <feOffset in="SourceGraphic" dx="-2" dy="0" result="b" />
        <feBlend in="r" in2="b" mode="screen" />
      </filter>
    </defs>
    {/* Cork Base - Wireframe */}
    <ellipse cx="40" cy="105" rx="15" ry="10" stroke="url(#shuttleGradient)" strokeWidth="1.5" fill="none" />
    <ellipse cx="40" cy="103" rx="12" ry="7" stroke="url(#shuttleGradient)" strokeWidth="0.5" fill="none" opacity="0.5" />
    {/* Feathers - Wireframe lines */}
    {[-30, -18, -6, 6, 18, 30].map((angle, i) => (
      <g key={i}>
        <path
          d={`M40 95 Q${40 + angle * 1.2} 50 ${40 + angle * 0.8} 10`}
          stroke="url(#shuttleGradient)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d={`M40 95 Q${40 + angle * 1.0} 55 ${40 + angle * 0.6} 15`}
          stroke="url(#shuttleGradient)"
          strokeWidth="0.3"
          fill="none"
          opacity="0.4"
        />
      </g>
    ))}
    {/* Feather tips connection */}
    <ellipse cx="40" cy="10" rx="28" ry="8" stroke="url(#shuttleGradient)" strokeWidth="1" fill="none" opacity="0.6" />
    {/* Tech ring */}
    <circle cx="40" cy="105" r="5" stroke="url(#shuttleGradient)" strokeWidth="0.5" fill="none" opacity="0.8" />
  </svg>
)

// Laser Court Lines Component
const LaserCourtLines = () => {
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      pathLength: 1,
      opacity: 1,
      transition: { duration: 2, ease: [0.16, 1, 0.3, 1] },
    })
  }, [controls])

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 500 700"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="laserGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Outer boundary - Laser beam */}
      <motion.rect
        x="30"
        y="30"
        width="440"
        height="640"
        stroke="url(#laserGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={controls}
      />
      {/* Center line */}
      <motion.line
        x1="250"
        y1="30"
        x2="250"
        y2="670"
        stroke="url(#laserGradient)"
        strokeWidth="1.5"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={controls}
        transition={{ delay: 0.3 }}
      />
      {/* Service lines */}
      <motion.line
        x1="30"
        y1="200"
        x2="470"
        y2="200"
        stroke="url(#laserGradient)"
        strokeWidth="1"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={controls}
        transition={{ delay: 0.5 }}
      />
      <motion.line
        x1="30"
        y1="500"
        x2="470"
        y2="500"
        stroke="url(#laserGradient)"
        strokeWidth="1"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={controls}
        transition={{ delay: 0.5 }}
      />
      {/* Side boxes */}
      <motion.line
        x1="90"
        y1="30"
        x2="90"
        y2="200"
        stroke="url(#laserGradient)"
        strokeWidth="0.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={controls}
        transition={{ delay: 0.7 }}
      />
      <motion.line
        x1="410"
        y1="30"
        x2="410"
        y2="200"
        stroke="url(#laserGradient)"
        strokeWidth="0.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={controls}
        transition={{ delay: 0.7 }}
      />
    </svg>
  )
}

// Hexagonal Grid Pattern
const HexGrid = () => (
  <div
    className="absolute inset-0 opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }}
  />
)

export default function HeroBanner() {
  const user = useAuthStore((s) => s.user)
  const [glitchActive, setGlitchActive] = useState(false)

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 150)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 bg-slate-950 overflow-hidden">
      {/* Hexagonal Grid Background */}
      <HexGrid />

      {/* Laser Court Lines Background */}
      <LaserCourtLines />

      {/* Wireframe Racket - Left */}
      <motion.div
        className="absolute left-4 md:left-20 top-1/2 -translate-y-1/2 opacity-30"
        initial={{ x: -100, opacity: 0, rotate: -30 }}
        animate={{ x: 0, opacity: 0.3, rotate: -15 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      >
        <WireframeRacket className="w-24 h-56 md:w-32 md:h-72" />
      </motion.div>

      {/* Wireframe Shuttlecock - Flying in with mechanical easing */}
      <motion.div
        className="absolute top-20 right-10 md:right-32"
        initial={{ x: 200, y: -100, opacity: 0, rotate: 45 }}
        animate={{
          x: 0,
          y: 0,
          opacity: 1,
          rotate: 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.1, 0, 1], // Mechanical easing - fast then sudden stop
          delay: 1,
        }}
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <WireframeShuttlecock className="w-16 h-24 md:w-20 md:h-30" glitch={glitchActive} />
        </motion.div>
      </motion.div>

      {/* Main Content - Mechanical Assembly Animation */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Top HUD Element */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          <div className="px-6 py-2 border border-cyan-500/30 bg-slate-900/50 backdrop-blur-sm font-mono text-xs text-cyan-400 tracking-widest uppercase">
            [ System Online ] • SmashScore v2.0
          </div>
        </motion.div>

        {/* Headline with Gradient */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter font-mono"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
        >
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
            DOMINATE
          </span>
          <br />
          <span className="text-white">THE COURT</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-mono tracking-wide"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
        >
          Next-gen badminton analytics. Track <span className="text-cyan-400">[ SMASH VELOCITY ]</span>,
          analyze <span className="text-blue-400">[ COURT COVERAGE ]</span>, dominate matches.
        </motion.p>

        {/* Mecha Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
        >
          {/* Primary Button - Chamfered corners with gradient */}
          <Link href={user ? '/start-match' : '/login'}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-10 py-4 font-bold font-mono text-lg uppercase tracking-widest text-slate-950 overflow-hidden group"
              style={{
                clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
              }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4)',
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">Start Match</span>
            </motion.button>
          </Link>

          {/* Secondary Button - Outline with chamfered corners */}
          <Link href="/teams">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              className="relative px-10 py-4 font-bold font-mono text-lg uppercase tracking-widest text-cyan-400 border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-300"
              style={{
                clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
              }}
            >
              View Players
            </motion.button>
          </Link>
        </motion.div>

        {/* Bottom HUD Element */}
        <motion.div
          className="flex justify-center mt-12 gap-8 font-mono text-xs text-slate-500"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.3 }}
        >
          <span>◆ REAL-TIME TRACKING</span>
          <span>◆ AI ANALYTICS</span>
          <span>◆ TOURNAMENT MODE</span>
        </motion.div>
      </motion.div>

      {/* Flying Shuttlecock Arc Animation */}
      <motion.div
        className="absolute bottom-40 left-0 hidden md:block"
        initial={{ x: -50, y: 0, opacity: 0 }}
        animate={{
          x: [null, 300, 600],
          y: [null, -200, 0],
          opacity: [0, 1, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 4,
          ease: [0.25, 0.1, 0, 1],
        }}
      >
        <WireframeShuttlecock className="w-8 h-12 opacity-40" />
      </motion.div>
    </section>
  )
}
