import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { TeamWithPlayers, CreateTeamDTO, TeamState, TeamActions } from './type'
// Helper function to get the full team details from Supabase
const getTeamWithPlayers = async (
  teamId: string
): Promise<TeamWithPlayers | null> => {
  const { data, error } = await supabase
    .from('teams')
    .select(
      `
      *,
      player_1:players!teams_player_1_id_fkey(*),
      player_2:players!teams_player_2_id_fkey(*)
    `
    )
    .eq('id', teamId)
    .single()

  if (error) {
    console.error('Error fetching team details:', error)
    return null
  }
  return data as TeamWithPlayers
}

const useTeamStore = create<TeamState & TeamActions>((set, get) => ({
  // ============================================================================
  // STATE
  // ============================================================================
  teams: [],
  loading: false,
  error: null,

  // ============================================================================
  // ACTIONS
  // ============================================================================

  fetchTeams: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.from('teams').select(
        `
        *,
        player_1:players!teams_player_1_id_fkey(*),
        player_2:players!teams_player_2_id_fkey(*)
        `
      )
      console.log('🚀 ~ data:', data)
      if (error) throw error
      set({ teams: data || [], loading: false })
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      })
    }
  },

  addTeam: async (teamData: CreateTeamDTO) => {
    set({ loading: true, error: null })
    try {
      // 1. Insert the basic team data
      const { data: newTeam, error: insertError } = await supabase
        .from('teams')
        .insert([teamData])
        .select('id')
        .single()

      if (insertError) throw insertError
      if (!newTeam) return null

      // 2. Fetch the full details of the newly created team
      const detailedTeam = await getTeamWithPlayers(newTeam.id)
      if (detailedTeam) {
        set((state) => ({
          teams: [...state.teams, detailedTeam],
          loading: false,
        }))
        return detailedTeam
      }
      return null
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      })
      return null
    }
  },

  getOrCreateTeam: async (player1Id: string, player2Id?: string) => {
    set({ loading: true, error: null })
    try {
      let queryBuilder = supabase.from('teams').select('id')

      if (player2Id) {
        // Doubles team: check for both player orders
        const filter1 = `and(player_1_id.eq.${player1Id},player_2_id.eq.${player2Id})`
        const filter2 = `and(player_1_id.eq.${player2Id},player_2_id.eq.${player1Id})`
        queryBuilder = queryBuilder.or(`${filter1},${filter2}`)
      } else {
        // Singles team: check for player1 and ensure player2 is null
        // Use PostgREST filter syntax: and(player_1_id.eq.UUID,player_2_id.is.null)
        const singlesFilter = `and(player_1_id.eq.${player1Id},player_2_id.is.null)`
        queryBuilder = queryBuilder.or(singlesFilter)
      }

      const { data: existingTeam, error: findError } = await queryBuilder
        .limit(1)
        .maybeSingle() // Use maybeSingle() instead of single() to handle no results gracefully

      if (findError) throw findError // Handle actual errors

      if (existingTeam) {
        // If team exists, fetch its full details
        return await getTeamWithPlayers(existingTeam.id) // ✅ This satisfies the return type
      } else {
        // If team doesn't exist, create it
        return await get().addTeam({
          player_1_id: player1Id,
          player_2_id: player2Id,
        })
      }
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      })
      return null
    }
  },
}))

export default useTeamStore
