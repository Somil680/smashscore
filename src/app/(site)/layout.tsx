'use client'
import Navbar from '@/components/Navbar'
import usePlayerStore from '@/store/usePlayerStore'
import React, { useEffect } from 'react'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { fetchPlayers, players } = usePlayerStore()
  useEffect(() => {
    fetchPlayers().then(() => {})
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col hex-grid">
      <Navbar />
      {children}
    </main>
  )
}
