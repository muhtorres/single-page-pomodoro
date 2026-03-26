const isBrowser = typeof window !== 'undefined'

export function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function setItem<T>(key: string, value: T): void {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // quota exceeded or private mode — fail silently
  }
}

export function removeItem(key: string): void {
  if (!isBrowser) return
  window.localStorage.removeItem(key)
}

export const STORAGE_KEYS = {
  SETTINGS: 'pomodoro_settings',
  TASKS: 'pomodoro_tasks',
  PROJECTS: 'pomodoro_projects',
} as const
