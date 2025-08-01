// store/useAuthStore.ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

type User = {
  id: string
  email?: string
} | null

interface AuthState {
  user: User
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  // <-- Fix is here: added ()
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null })
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          set({ error: error.message, loading: false })
        } else {
          set({ user: data?.user ?? null, loading: false })
        }
      },

      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null })
      },

      fetchUser: async () => {
        // fetchUser is often called on app load to check for an existing session
        set({ loading: true })
        const { data, error } = await supabase.auth.getUser()
        if (error) {
          set({ error: error.message, loading: false })
        } else {
          set({ user: data.user, loading: false })
        }
      },
    }),
    {
      name: 'auth-store', // name of the item in storage
      storage: createJSONStorage(() => localStorage),
    }
  )
)
