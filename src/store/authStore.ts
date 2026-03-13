import { create } from 'zustand'
import { AuthUser } from '@/types'
import { fetchCurrentUser, getOAuthUrl } from '@/lib/api'

const TOKEN_KEY = 'auth_token'

interface AuthStore {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean

  /** Called after OAuth callback — saves token and loads user profile */
  setToken: (token: string) => Promise<void>

  /** Redirect browser to OAuth provider login page */
  loginWithProvider: (provider: 'github' | 'google' | 'facebook') => void

  /** Clear auth state and remove token from storage */
  logout: () => void

  /** Rehydrate auth state from localStorage on app load */
  rehydrate: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  setToken: async (token) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TOKEN_KEY, token)
    }
    set({ token, isLoading: true })

    try {
      const user = await fetchCurrentUser()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      // Token invalid — clear it
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(TOKEN_KEY)
      }
      set({ token: null, user: null, isAuthenticated: false, isLoading: false })
    }
  },

  loginWithProvider: (provider) => {
    if (typeof window !== 'undefined') {
      window.location.href = getOAuthUrl(provider)
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_KEY)
    }
    set({ user: null, token: null, isAuthenticated: false })
  },

  rehydrate: async () => {
    if (typeof window === 'undefined') return

    const token = window.localStorage.getItem(TOKEN_KEY)
    if (!token) return

    set({ token, isLoading: true })
    try {
      const user = await fetchCurrentUser()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      window.localStorage.removeItem(TOKEN_KEY)
      set({ token: null, user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
