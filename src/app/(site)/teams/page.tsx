'use client'
import TeamCard from '@/components/teams/TeamCard'
import { calculateTeamStats } from '@/hooks/calculateTeamsStats'
import useTeamStore from '@/store/useTeamStore'
import useTournamentStore from '@/store/useTournamentStore'
import { Users } from 'lucide-react'
import { useEffect } from 'react'

const TeamListPage = () => {
  const { teams, fetchTeams } = useTeamStore()
  const {
    matches,
    matchScores,
    fetchMatchesForTournament,
    activeTournamentId,
  } = useTournamentStore()
  useEffect(() => {
    fetchTeams()
    if (activeTournamentId) {
      fetchMatchesForTournament(activeTournamentId)
    }
  }, [fetchTeams, fetchMatchesForTournament, activeTournamentId])
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mb-4">
          <Users className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Team Standings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          An overview of all participating teams and their performance.
        </p>
      </div>
      {teams.map((team) => {
        // Calculate stats for each team before rendering the card
              console.log('🚀 ~ {teams.map ~ team:', team)

        const stats = calculateTeamStats(team.id, matches, matchScores)
        console.log("🚀 ~ {teams.map ~ stats:", stats)
        return <TeamCard key={team.id} team={team} stats={stats} />
      })}
    </div>
  )
}
export default TeamListPage
