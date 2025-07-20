'use client'
import Navbar from '@/components/Navbar'
import { useBadmintonStore } from '@/store/useBadmintonStore'
// import { useSmashScoreStore } from '@/store/useSmashScoreStore'
import React, { useEffect } from 'react'
// import "../../global.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const fetchPlayers = useBadmintonStore((s) => s.fetchPlayers)
  useEffect(() => {
    fetchPlayers().then(() => {
      const players = useBadmintonStore.getState().players
      console.log('Fetched players:', players)
    })
  }, [fetchPlayers])

  // useEffect(() => {
  //   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  //     e.preventDefault()
  //     e.returnValue = '' // Required for Chrome to show alert
  //   }

  //   window.addEventListener('beforeunload', handleBeforeUnload)

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload)
  //   }
  // }, [])
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />
      {children}
    </main>
  )
}

