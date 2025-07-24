'use client'
import usePlayerStore from '@/store/usePlayerStore'
import HeroBanner from '../../components/HeroBanner'
import StatsCard from '../../components/StatsCard'
// import FloatingCTA from "../components/FloatingCTA";
import FloatingCTAWithModal from '@/components/FloatingCTAWithModal'
import { CreatePlayerDTO } from '@/store/type'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect } from 'react'

export default function Home() {
  const { addPlayer } = usePlayerStore()
  const fetchUser = useAuthStore((s) => s.fetchUser)
  
  useEffect(() => {
    fetchUser()
  }, [])
  const user = useAuthStore((s) => s.user)
  console.log("🚀 ~ Home ~ user:", user)
  
  const handleAddPlayer = async (data: {
    name: string
    image: string
  }): Promise<void> => {
    const playerData: CreatePlayerDTO = {
      name: data.name,
      image_url: data.image,
    }
    await addPlayer(playerData)
  }

  return (
    <div className="flex flex-col">
      <HeroBanner />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <StatsCard
          title="Player Stats"
          borderColor="border-lime-400"
          stats={[
            { label: 'Wins', value: '12', accent: 'text-lime-500' },
            { label: 'Matches Played', value: '20', accent: 'text-blue-500' },
          ]}
          linkText="View all players"
          linkHref="#"
          linkColor="text-blue-500"
        />
        <StatsCard
          title="Ongoing Tournaments"
          borderColor="border-blue-500"
          stats={[
            {
              label: 'Summer Smash 2025',
              value: 'Live',
              accent: 'text-lime-500',
            },
            {
              label: 'City League',
              value: 'Quarterfinals',
              accent: 'text-blue-500',
            },
          ]}
          linkText="See tournaments"
          linkHref="#"
          linkColor="text-lime-500"
        />
        <StatsCard
          title="Performance Analysis"
          borderColor="border-lime-400"
          stats={[
            { label: 'Win Rate', value: '60%', accent: 'text-lime-500' },
            {
              label: 'Avg. Points/Match',
              value: '21.3',
              accent: 'text-blue-500',
            },
          ]}
          linkText="View analytics"
          linkHref="#"
          linkColor="text-blue-500"
        />
      </main>
      <FloatingCTAWithModal onSubmit={handleAddPlayer} />{' '}
    </div>
  )
}
