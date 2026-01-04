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

// Helper function to save user ID to localStorage
const saveUserIdToLocalStorage = (userId: string | null) => {
  if (userId) {
    localStorage.setItem('smashscore_user_id', userId)
  } else {
    localStorage.removeItem('smashscore_user_id')
  }
}

// Helper function to get user ID from localStorage
const getUserIdFromLocalStorage = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('smashscore_user_id')
  }
  return null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) {
            set({ error: error.message, loading: false })
            saveUserIdToLocalStorage(null)
          } else if (data?.user) {
            const userData = {
              id: data.user.id,
              email: data.user.email,
            }
            set({ user: userData, loading: false, error: null })

            // Save user ID to localStorage on first login
            saveUserIdToLocalStorage(data.user.id)

            // Set up auth state listener to keep user in sync
            supabase.auth.onAuthStateChange((_event, session) => {
              if (session?.user) {
                const userData = {
                  id: session.user.id,
                  email: session.user.email,
                }
                set({ user: userData })
                saveUserIdToLocalStorage(session.user.id)
              } else {
                set({ user: null })
                saveUserIdToLocalStorage(null)
              }
            })
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Login failed'
          set({ error: errorMessage, loading: false })
          saveUserIdToLocalStorage(null)
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut()
          set({ user: null, error: null })
          saveUserIdToLocalStorage(null)
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Logout failed'
          set({ error: errorMessage })
        }
      },

      fetchUser: async () => {
        set({ loading: true })
        try {
          // First, check if we have a user ID in localStorage (for quick restore)
          const savedUserId = getUserIdFromLocalStorage()

          // Try to get user from Supabase session
          const { data, error } = await supabase.auth.getUser()

          if (error) {
            // If Supabase session is invalid but we have saved user ID, clear it
            if (savedUserId) {
              saveUserIdToLocalStorage(null)
            }
            set({ error: error.message, loading: false, user: null })
          } else if (data?.user) {
            // User session is valid
            const userData = {
              id: data.user.id,
              email: data.user.email,
            }
            set({ user: userData, loading: false, error: null })

            // Ensure user ID is saved to localStorage
            saveUserIdToLocalStorage(data.user.id)

            // Set up auth state listener
            supabase.auth.onAuthStateChange((_event, session) => {
              if (session?.user) {
                const userData = {
                  id: session.user.id,
                  email: session.user.email,
                }
                set({ user: userData })
                saveUserIdToLocalStorage(session.user.id)
              } else {
                set({ user: null })
                saveUserIdToLocalStorage(null)
              }
            })
          } else {
            // No user session
            set({ user: null, loading: false, error: null })
            saveUserIdToLocalStorage(null)
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to fetch user'
          set({ error: errorMessage, loading: false, user: null })
          saveUserIdToLocalStorage(null)
        }
      },
    }),
    {
      name: 'auth-store', // name of the item in storage
      storage: createJSONStorage(() => localStorage),
      // Only persist the user data, not loading/error states
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
)
