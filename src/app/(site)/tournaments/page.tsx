'use client'
import { TournamentPagination } from '@/components/Tournaments/TournamentsPagination'
import RealisticPulseLoader from '@/components/ui/loading'
import { getTeamDetails } from '@/hooks/helperFunction'
import { TournamentWithWinner } from '@/store/type'
import { useAuthStore } from '@/store/useAuthStore'
import useTournamentStore from '@/store/useTournamentStore'
import {
  Trophy,
  Calendar,
  Users,
  ListChecks,
  Tickets,
  Swords,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const TournamentPage = () => {
  const user = useAuthStore((s) => s.user)

  const { fetchTournaments, tournaments, loading } = useTournamentStore()
  console.log('🚀 ~ TournamentPage ~ tournaments:', tournaments)
  const router = useRouter()
  useEffect(() => {
    // Fetch all tournaments if no user, or user's tournaments if logged in
    fetchTournaments(user?.id || null, 0)
  }, [user, fetchTournaments])

  const handleOpenTournamentDetails = (item: TournamentWithWinner) => {
    router.push(`/tournaments/${item.id}`)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mb-2">
          <Swords className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Tournaments
        </h1>
      </div>
      {loading ? (
        <div>
          <RealisticPulseLoader />
        </div>
      ) : (
        <>
          {tournaments.map((item) => {
            const teamName = item.winner_team_id
              ? getTeamDetails(item.winner_team)
              : { teamName: 'Winner TBA', playerImages: [], teamId: null }
            return (
              <div
                key={item.id}
                className="bg-gradient-to-r from-lime-400 via-blue-500 to-purple-400 p-[2px] rounded-2xl"
                onClick={() => handleOpenTournamentDetails(item)}
              >
                <div className="bg-[#111827] rounded-2xl p-5 text-white">
                  <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Trophy size={20} color="gold" /> {teamName.teamName}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Tickets size={16} />{' '}
                      <span>
                        Name: {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        Created:{' '}
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>Type: {item.tournament_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ListChecks size={16} />
                      <span>Match Type: {item.match_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ListChecks size={16} />
                      <span>
                        Points/Game: <strong>{21}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ListChecks size={16} />
                      <span>
                        Max Game Sets: <strong>{1}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <TournamentPagination />
        </>
      )}
    </div>
  )
}

export default TournamentPage
