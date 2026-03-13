import { create } from 'zustand'
import { TimerMode } from '@/types'

interface TimerState {
  mode: TimerMode
  secondsLeft: number
  isRunning: boolean
  sessionCount: number
}

interface TimerStore extends TimerState {
  setMode: (mode: TimerMode) => void
  setSecondsLeft: (seconds: number) => void
  setIsRunning: (running: boolean) => void
  incrementSessionCount: () => void
  resetSession: () => void
  tick: () => void
}

export const useTimerStore = create<TimerStore>()((set) => ({
  mode: 'pomodoro',
  secondsLeft: 25 * 60,
  isRunning: false,
  sessionCount: 0,

  setMode: (mode) => set({ mode }),
  setSecondsLeft: (secondsLeft) => set({ secondsLeft }),
  setIsRunning: (isRunning) => set({ isRunning }),
  incrementSessionCount: () => set((s) => ({ sessionCount: s.sessionCount + 1 })),
  resetSession: () => set({ sessionCount: 0, isRunning: false }),
  tick: () => set((s) => ({ secondsLeft: Math.max(0, s.secondsLeft - 1) })),
}))
