'use client'

import { useEffect, useState, useCallback } from 'react'

export interface UserProfile {
  name: string
  age: string
  height: string
  weight: string
  targetWeight: string
  goal: string | null
  dietaryPreferences: string[]
  activityLevel: string
  allergies: string[]
  cravings: string[]
  vibe: 'chill' | 'energetic' | 'focused' | 'balanced'
  streak: number
  joinedDate: string
  completedOnboarding: boolean
}

export interface AppState {
  profile: UserProfile
  completedMeals: string[]
  waterGlasses: number
  hasSeenSplash: boolean
}

const defaultProfile: UserProfile = {
  name: '',
  age: '',
  height: '',
  weight: '',
  targetWeight: '',
  goal: null,
  dietaryPreferences: [],
  activityLevel: 'moderate',
  allergies: [],
  cravings: [],
  vibe: 'balanced',
  streak: 0,
  joinedDate: '',
  completedOnboarding: false,
}

const defaultState: AppState = {
  profile: defaultProfile,
  completedMeals: [],
  waterGlasses: 0,
  hasSeenSplash: false,
}

const GLOBAL_STORAGE_KEY = 'biteai-state'

function loadState(userEmail?: string): AppState {
  if (typeof window === 'undefined') return defaultState
  try {
    // If user is logged in, use their specific key. Otherwise use default global key (or could be temp)
    const key = userEmail ? `biteai-state-${userEmail}` : GLOBAL_STORAGE_KEY
    const stored = localStorage.getItem(key)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...defaultState, ...parsed, profile: { ...defaultProfile, ...parsed.profile } }
    }
  } catch {
    // Ignore parse errors
  }
  return defaultState
}

function saveState(state: AppState, userEmail?: string) {
  if (typeof window === 'undefined') return
  try {
    const key = userEmail ? `biteai-state-${userEmail}` : GLOBAL_STORAGE_KEY
    localStorage.setItem(key, JSON.stringify(state))
  } catch {
    // Ignore storage errors
  }
}

// Custom hook for app state with localStorage persistence
import { auth } from '@/lib/auth'

export function useAppState() {
  const [state, setState] = useState<AppState>(defaultState)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined)

  // Listen for auth changes
  useEffect(() => {
    const checkUser = () => {
      const user = auth.getCurrentUser()
      const email = user?.email
      setCurrentUserEmail(email)

      // Reload state when user changes
      const loaded = loadState(email)
      setState(loaded)
      setIsLoaded(true)
    }

    checkUser()
    window.addEventListener('auth-change', checkUser)
    return () => window.removeEventListener('auth-change', checkUser)
  }, [])

  // Save to localStorage on state change
  useEffect(() => {
    if (isLoaded) {
      saveState(state, currentUserEmail)
    }
  }, [state, isLoaded, currentUserEmail])

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }))
  }, [])

  const setCompletedMeals = useCallback((meals: string[]) => {
    setState((prev) => ({ ...prev, completedMeals: meals }))
  }, [])

  const toggleMeal = useCallback((mealId: string) => {
    setState((prev) => ({
      ...prev,
      completedMeals: prev.completedMeals.includes(mealId)
        ? prev.completedMeals.filter((id) => id !== mealId)
        : [...prev.completedMeals, mealId],
    }))
  }, [])

  const setWaterGlasses = useCallback((glasses: number) => {
    setState((prev) => ({ ...prev, waterGlasses: glasses }))
  }, [])

  const addWater = useCallback(() => {
    setState((prev) => ({ ...prev, waterGlasses: Math.min(prev.waterGlasses + 1, 12) }))
  }, [])

  const removeWater = useCallback((glasses: number) => {
    setState((prev) => ({ ...prev, waterGlasses: Math.max(prev.waterGlasses - 1, 0) }))
  }, [])

  const setHasSeenSplash = useCallback((seen: boolean) => {
    setState((prev) => ({ ...prev, hasSeenSplash: seen }))
  }, [])

  const resetState = useCallback(() => {
    setState(defaultState)
    if (typeof window !== 'undefined') {
      const key = currentUserEmail ? `biteai-state-${currentUserEmail}` : GLOBAL_STORAGE_KEY
      localStorage.removeItem(key)
    }
  }, [currentUserEmail])

  return {
    state,
    isLoaded,
    updateProfile,
    setCompletedMeals,
    toggleMeal,
    setWaterGlasses,
    addWater,
    removeWater,
    setHasSeenSplash,
    resetState,
  }
}

// Vibe configurations for UI theming
export const vibeConfigs = {
  chill: {
    label: 'Chill',
    description: 'Relaxed vibes, easy pace',
    emoji: '🌊',
    accentHue: 200,
    greeting: 'Take it easy today',
  },
  energetic: {
    label: 'Energetic',
    description: 'High energy, crush goals',
    emoji: '⚡',
    accentHue: 45,
    greeting: 'Let\'s crush it!',
  },
  focused: {
    label: 'Focused',
    description: 'Dialed in, no distractions',
    emoji: '🎯',
    accentHue: 280,
    greeting: 'Stay locked in',
  },
  balanced: {
    label: 'Balanced',
    description: 'Steady and sustainable',
    emoji: '☯️',
    accentHue: 145,
    greeting: 'Balance is key',
  },
} as const

export type VibeType = keyof typeof vibeConfigs
