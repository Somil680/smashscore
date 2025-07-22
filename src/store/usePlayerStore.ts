import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import {  CreatePlayerDTO, PlayerState, PlayerActions } from './type' // Assuming your types are in a central file

const usePlayerStore = create<PlayerState & PlayerActions>((set) => ({
  // ============================================================================
  // STATE
  // ============================================================================
  players: [],
  loading: false,
  error: null,

  // ============================================================================
  // ACTIONS
  // ============================================================================

  /**
   * Fetches all players from the database and updates the state.
   */
  fetchPlayers: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.from('players').select('*')
      if (error) throw error
      set({ players: data || [], loading: false })
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      })
    }
  },

  /**
   * Adds a new player to the database and updates the state.
   * @param playerData - The data for the new player.
   * @returns The newly created player, or null if an error occurred.
   */
  addPlayer: async (playerData: CreatePlayerDTO) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('players')
        .insert([playerData])
        .select()
        .single()

      if (error) throw error
      if (data) {
        set((state) => ({
          players: [...state.players, data],
          loading: false,
        }))
        return data
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
}))

export default usePlayerStore
