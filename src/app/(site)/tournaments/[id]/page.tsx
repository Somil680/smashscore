'use client'

import TournamentDetails from '@/components/Tournaments/TounamentDetails'
import { useBadmintonStore } from '@/store/useBadmintonStore'
import React, { use, useEffect } from 'react'

// The 'params' object is passed directly, not as a Promise.
const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  // Now you can directly destructure the id from params
    // The params object is a Promise, so we use React.use() to get its value
    // This is the fix: Unwrap the promise to get the params object
    const resolvedParams = use(params);
    const { id } = resolvedParams;
    const { activeTournament ,fetchTournamentDetails} = useBadmintonStore()
  
    
    useEffect(() => {
        fetchTournamentDetails(id)
    },[])

  return (
  
      <div className='p-4'>
        {activeTournament ? (
          <TournamentDetails tournament={activeTournament} />
        ) : (
          <div>Tournament not found or still loading.</div>
        )}
      </div>
 
  )
}

export default Page
