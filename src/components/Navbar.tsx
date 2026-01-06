'use client'

import React, { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navLinks = [
    { href: '/player', label: 'Players' },
    { href: '/tournaments', label: 'Tournaments' },
    { href: '/teams', label: 'Teams' },
  ]

  return (
    <nav
      className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl"
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-10">
        {/* Logo and Brand Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-10 h-10 flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
            }}
          >
            <Zap className="w-5 h-5 text-slate-950" />
          </motion.div>
          <span className="font-bold text-xl tracking-tight font-mono uppercase">
            <span className="text-gradient">Smash</span>
            <span className="text-white">Score</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-mono uppercase tracking-widest">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-violet-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                {user.email}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-6 py-2 text-sm font-mono uppercase tracking-wider border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all"
                style={{
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                }}
              >
                Logout
              </motion.button>
            </>
          ) : (
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 text-sm font-mono uppercase tracking-wider text-slate-950 font-bold"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
                }}
              >
                Login
              </motion.button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleMenu}
          className="md:hidden p-2 text-cyan-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-slate-800/50 bg-slate-950/95 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center gap-4 py-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-lg font-mono uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* User Section */}
              {user && (
                <>
                  <div className="w-32 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-2" />
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                    {user.email}
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="px-8 py-2 text-sm font-mono uppercase tracking-wider border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all"
                    style={{
                      clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                    }}
                  >
                    Logout
                  </motion.button>
                </>
              )}

              {!user && (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-2 text-sm font-mono uppercase tracking-wider text-slate-950 font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
                      clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                    }}
                  >
                    Login
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
