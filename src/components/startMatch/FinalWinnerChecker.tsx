// 'use client'
import { useEffect } from 'react'
import { generateTieBreakerFixtures } from './TieBreaker'
import { Team, useBadmintonStore } from '@/store/useBadmintonStore'

interface FinalWinnerCheckerProps {
  teamStats: { id: string; team: Team }[]
}

export default function FinalWinnerChecker({ teamStats }: FinalWinnerCheckerProps) {
  const { matches, addMatch, activeTournamentId } = useBadmintonStore()

  useEffect(() => {
    if (!matches.length || !activeTournamentId) return;

    // Check if all non-playoff matches are done
    const groupStageMatches = matches.filter(m => m.tag !== 'Semi-Final' && m.tag !== 'Final');
    const allCompleted = groupStageMatches.every((m) => m.winner_team_id);
    
    // Check if playoffs have already been created
    const playoffsExist = matches.some(m => m.tag === 'Semi-Final');

    if (!allCompleted || playoffsExist) return;

    // Generate the fixtures
    const tieMatches = generateTieBreakerFixtures(teamStats, activeTournamentId);

    // Add each new match to the database
    tieMatches.forEach(fixture => {
      addMatch({
        tournament_id: fixture.tournament_id,
        team_1_id: fixture.team_1_id,
        team_2_id: fixture.team_2_id, // This will be null for the final
        tag: fixture.tag,
      });
    });

  }, [matches, teamStats, addMatch, activeTournamentId]);

  return null; // This component only runs logic, it doesn't render anything
}