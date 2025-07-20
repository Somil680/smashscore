'use client'
import { TournamentPagination } from '@/components/Tournaments/TournamentsPagination'
import { Button } from '@/components/ui/button'
import { getTeamDetails } from '@/hooks/helperFunction'
import { TournamentWithWinner } from '@/lib/type'
import { useBadmintonStore } from '@/store/useBadmintonStore'
import { Trophy, Calendar, Users, ListChecks, Tickets } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const TournamentPage = () => {
  const { fetchTournaments, tournaments, loading } = useBadmintonStore()
  console.log('🚀 ~ TournamentPage ~ tournaments:', tournaments)
 const router = useRouter()
  useEffect(() => {
    fetchTournaments(0)
  }, [])

  const handleOpenTournamentDetails = (item :TournamentWithWinner) => {
      router.push(`/tournaments/${item.id}`)
   }


   
  return (
    <div className="p-4 space-y-4">
      <div>
        <h2>Tournaments</h2>
        {/* <Link href={`/blog/${post.slug}`}>{post.title}</Link> */}
      </div>
      {loading ? (
        <div>loading</div>
      ) : (
        tournaments.map((item) => {
          const teamName = getTeamDetails(item.winner_team)
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
                      Created: {new Date(item.created_at).toLocaleDateString()}
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
        })
      )}
      <div>
        <TournamentPagination />
      </div>
    </div>
  )
}

export default TournamentPage
