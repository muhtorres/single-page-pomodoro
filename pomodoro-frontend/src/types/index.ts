// Timer modes
export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak'

// Task entity
export interface Task {
  id: string
  title: string
  completed: boolean
  estimatedPomodoros: number
  actualPomodoros: number
  createdAt: number
}

// Authenticated user
export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
  provider: string
  createdAt: string
}

// User-configurable settings
export interface Settings {
  pomodoroDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number
  soundEnabled: boolean
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  volume: number
}

// Default settings values — shared across stores, hooks, and tests
export const DEFAULT_SETTINGS: Settings = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  soundEnabled: true,
  autoStartBreaks: true,
  autoStartPomodoros: false,
  volume: 0.5,
}

// Background color per mode
export const MODE_COLORS: Record<TimerMode, string> = {
  pomodoro: '#BA4949',
  shortBreak: '#38858A',
  longBreak: '#397097',
}

// Display labels per mode
export const MODE_LABELS: Record<TimerMode, string> = {
  pomodoro: 'Pomodoro',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
}
