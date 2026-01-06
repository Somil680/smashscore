'use client'

import React, { useEffect, useState } from 'react'
import { LogIn, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const user = useAuthStore((s) => s.user)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { login, loading, error } = useAuthStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
    if (!error) {
      router.push('/')
    }
  }

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 hex-grid opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-8 relative"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
            boxShadow: '0 0 60px rgba(6, 182, 212, 0.1)',
          }}
        >
          {/* Corner Accents */}
          <div 
            className="absolute top-0 right-0 w-6 h-6 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, transparent 50%, #06b6d4 50%)' }}
          />
          <div 
            className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none"
            style={{ background: 'linear-gradient(-45deg, transparent 50%, #8b5cf6 50%)' }}
          />

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <div
                className="w-16 h-16 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
                  clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
                  boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)',
                }}
              >
                <Zap className="w-8 h-8 text-slate-950" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold font-mono uppercase tracking-wider">
              <span className="text-gradient">Smash</span>
              <span className="text-white">Score</span>
            </h1>
            <p className="mt-2 text-sm font-mono text-slate-400 uppercase tracking-wider">
              [ System Access ]
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Email Address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 text-white font-mono placeholder-slate-500 focus:border-cyan-500 focus:ring-0 focus:outline-none transition-all"
                  style={{
                    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                  }}
                  placeholder="admin@smashscore.com"
                />
              </div>

              <div>
                <label htmlFor="password-sr" className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Password
                </label>
                <input
                  id="password-sr"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 text-white font-mono placeholder-slate-500 focus:border-cyan-500 focus:ring-0 focus:outline-none transition-all"
                  style={{
                    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                  }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div
                className="p-3 text-center text-sm font-mono text-red-400 bg-red-500/10 border border-red-500/30"
                style={{
                  clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                }}
              >
                [ ERROR ] {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              <LogIn className="h-5 w-5" />
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-slate-800/50 text-center">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Secure Access • SmashScore v2.0
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
