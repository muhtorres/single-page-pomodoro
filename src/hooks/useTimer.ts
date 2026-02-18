'use client'
import { useEffect, useRef, useCallback } from 'react'
import { useTimerStore } from '@/store/timerStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useTaskStore } from '@/store/taskStore'
import { playTimerEndSound } from '@/lib/audio'
import { TimerMode } from '@/types'

export function useTimer() {
  const {
    mode,
    secondsLeft,
    isRunning,
    sessionCount,
    setMode,
    setSecondsLeft,
    setIsRunning,
    incrementSessionCount,
    tick,
  } = useTimerStore()
  const { settings } = useSettingsStore()
  const { selectedTaskId, incrementTaskPomodoro } = useTaskStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getDuration = useCallback(
    (m: TimerMode): number => {
      const map: Record<TimerMode, number> = {
        pomodoro: settings.pomodoroDuration * 60,
        shortBreak: settings.shortBreakDuration * 60,
        longBreak: settings.longBreakDuration * 60,
      }
      return map[m]
    },
    [settings]
  )

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setIsRunning(false)
      setMode(newMode)
      setSecondsLeft(getDuration(newMode))
    },
    [setIsRunning, setMode, setSecondsLeft, getDuration]
  )

  const handleTimerComplete = useCallback(() => {
    if (settings.soundEnabled) playTimerEndSound(settings.volume)

    const { mode: currentMode, sessionCount: currentCount } = useTimerStore.getState()

    if (currentMode === 'pomodoro') {
      incrementSessionCount()
      if (selectedTaskId) incrementTaskPomodoro(selectedTaskId)

      const newCount = currentCount + 1
      const nextMode: TimerMode =
        newCount % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak'

      if (settings.autoStartBreaks) {
        setMode(nextMode)
        setSecondsLeft(getDuration(nextMode))
        setIsRunning(true)
      } else {
        switchMode(nextMode)
      }
    } else {
      if (settings.autoStartPomodoros) {
        setMode('pomodoro')
        setSecondsLeft(getDuration('pomodoro'))
        setIsRunning(true)
      } else {
        switchMode('pomodoro')
      }
    }
  }, [
    settings,
    selectedTaskId,
    getDuration,
    switchMode,
    setMode,
    setSecondsLeft,
    setIsRunning,
    incrementSessionCount,
    incrementTaskPomodoro,
  ])

  // Interval management — reads live state via getState() to avoid stale closures
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const { secondsLeft: current } = useTimerStore.getState()
        if (current <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          handleTimerComplete()
        } else {
          tick()
          // After ticking, check if we just hit 0
          const { secondsLeft: afterTick } = useTimerStore.getState()
          if (afterTick <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            handleTimerComplete()
          }
        }
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, handleTimerComplete, tick])

  // Update document title
  useEffect(() => {
    if (typeof document === 'undefined') return
    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
    const ss = String(secondsLeft % 60).padStart(2, '0')
    document.title = `${mm}:${ss} — Pomodoro Timer`
    return () => {
      document.title = 'Pomodoro Timer'
    }
  }, [secondsLeft])

  const toggle = useCallback(() => setIsRunning(!isRunning), [isRunning, setIsRunning])

  const reset = useCallback(() => {
    setIsRunning(false)
    setSecondsLeft(getDuration(mode))
  }, [setIsRunning, setSecondsLeft, getDuration, mode])

  return { mode, secondsLeft, isRunning, sessionCount, toggle, reset, switchMode }
}
