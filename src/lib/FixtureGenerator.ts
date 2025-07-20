// utils/generateFixtures.ts


export interface Team {
  id: string
  player_1_id: string
  player_2_id?: string
  created_at: string
}
export interface Fixture {
  playerA : string
  playerB: string
}
/**
 * Generate match fixtures based on tournament type and teams
 * @param type - Tournament type: 'knockout', 'league', or 'round-robin'
 * @param teams - Array of team objects with at least a `name` property
 * @returns Array of fixtures
*/
// const activeTeams = useActiveTournamentTeams()
export function generateFixtures(
  type: 'knockout' | 'league' | 'round-robin',
  teams: (Team| null)[] 
): Fixture[] {
  const validTeams = teams.filter((team): team is Team => team !== null)

  const fixtures: Fixture[] = []
  if (validTeams === null) return  fixtures


  if (validTeams.length < 2) return fixtures

  if (type === 'knockout') {
    for (let i = 0; i < validTeams.length; i += 2) {
      if (validTeams[i + 1]) {
        fixtures.push({
          playerA: validTeams[i].id   ,
          playerB: validTeams[i+1].id ,
        })
      }
    }
  } else if (type === 'league' || type === 'round-robin') {
    for (let i = 0; i < validTeams.length; i++) {
      for (let j = i + 1; j < validTeams.length; j++) {
        fixtures.push({
          playerA: validTeams[i].id,
          playerB: validTeams[j].id,
        })
      }
    }
  }

  return fixtures
}

