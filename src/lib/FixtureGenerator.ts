// utils/generateFixtures.ts

export interface Team {
  id: string
  name: string
}
export interface Player {
    id: string
  name: string
}
 
export interface Fixture {
  playerA : Player
  playerB: Player
}
/**
 * Generate match fixtures based on tournament type and teams
 * @param type - Tournament type: 'knockout', 'league', or 'round-robin'
 * @param teams - Array of team objects with at least a `name` property
 * @returns Array of fixtures
 */
export function generateFixtures(
  type: 'knockout' | 'league' | 'round-robin',
  teams: Team[] 
): Fixture[] {
  const fixtures: Fixture[] = []

  if (teams.length < 2) return fixtures

  if (type === 'knockout') {
    for (let i = 0; i < teams.length; i += 2) {
      if (teams[i + 1]) {
        fixtures.push({
          playerA: { name: teams[i].name, id: teams[i].id },
          playerB: { name: teams[i + 1].name, id: teams[i + 1].id },
        })
      }
    }
  } else if (type === 'league' || type === 'round-robin') {
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        fixtures.push({
          playerA: { name: teams[i].name, id: teams[i].id },
          playerB: { name: teams[j].name, id: teams[j].id },
        })
      }
    }
  }

  return fixtures
}

