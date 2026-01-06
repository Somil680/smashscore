'use client'
import Navbar from '@/components/Navbar'
import usePlayerStore from '@/store/usePlayerStore'
import React, { useEffect } from 'react'
// import "../../global.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { fetchPlayers, players } = usePlayerStore()
  useEffect(() => {

    fetchPlayers().then(() => {
      console.log('Fetched players:', players)
    })
  }, [])

  // useEffect(() =>
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
    <main className="min-h-screen bg-slate-950 flex flex-col hex-grid">
      <Navbar />
      {children}
    </main>
  )
}
