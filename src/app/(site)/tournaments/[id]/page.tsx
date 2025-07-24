'use client'

import TournamentDetails from '@/components/Tournaments/TounamentDetails'
import RealisticPulseLoader from '@/components/ui/loading'
import useTournamentStore from '@/store/useTournamentStore'
import React, { use, useEffect } from 'react'

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params)
  const { id } = resolvedParams
  const { activeTournament, fetchTournamentDetails } = useTournamentStore()

  useEffect(() => {
    fetchTournamentDetails(id)
  }, [fetchTournamentDetails, id])

  return (
    <div className="p-4 flex items-center justify-center">
      {activeTournament ? (
        <TournamentDetails tournament={activeTournament} />
      ) : (
        <div>
          <RealisticPulseLoader />
        </div>
      )}
    </div>
  )
}

export default Page
