import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (provider: string, data?: any) => Promise<void>
  logout: () => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (provider, data) => {
        set({ isLoading: true, error: null })
        try {
          // This would be replaced with actual authentication logic
          const mockUser = {
            id: '1',
            name: 'Demo User',
            email: 'user@example.com',
            image: '/placeholder-user.jpg',
          }
          set({ user: mockUser, isAuthenticated: true })
        } catch (error) {
          set({ error: 'Authentication failed' })
        } finally {
          set({ isLoading: false })
        }
      },
      logout: async () => {
        set({ isLoading: true })
        try {
          // This would be replaced with actual logout logic
          set({ user: null, isAuthenticated: false })
        } catch (error) {
          set({ error: 'Logout failed' })
        } finally {
          set({ isLoading: false })
        }
      },
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'auth-storage',
    }
  )
) 