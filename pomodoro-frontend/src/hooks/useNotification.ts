'use client'
import { useCallback } from 'react'
import { useSettingsStore } from '@/store/settingsStore'

export function useNotification() {
  const { settings } = useSettingsStore()

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined') return
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }, [])

  const notify = useCallback(
    (title: string, body: string) => {
      if (!settings.soundEnabled) return
      if (typeof window === 'undefined') return
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body })
      }
    },
    [settings.soundEnabled]
  )

  return { requestPermission, notify }
}
