'use client'
import { useState, useCallback, useEffect } from 'react'
import { Header } from '@/components/Layout/Header'
import { TimerDisplay } from '@/components/Timer/TimerDisplay'
import { TimerControls } from '@/components/Timer/TimerControls'
import { TaskList } from '@/components/Tasks/TaskList'
import { SettingsModal } from '@/components/Settings/SettingsModal'
import { useTimer } from '@/hooks/useTimer'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useNotification } from '@/hooks/useNotification'
import { MODE_COLORS, MODE_LABELS, TimerMode } from '@/types'

const MODES: { key: TimerMode; label: string }[] = [
  { key: 'pomodoro', label: 'Pomodoro' },
  { key: 'shortBreak', label: 'Short Break' },
  { key: 'longBreak', label: 'Long Break' },
]

export default function HomePage() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { mode, secondsLeft, isRunning, sessionCount, toggle, reset, switchMode } = useTimer()
  const { requestPermission } = useNotification()

  // Update background color CSS variable based on current mode
  useEffect(() => {
    document.documentElement.style.setProperty('--color-bg', MODE_COLORS[mode])
  }, [mode])

  // Request notification permission on first interaction
  useEffect(() => {
    const handler = () => {
      requestPermission()
      window.removeEventListener('click', handler)
    }
    window.addEventListener('click', handler, { once: true })
    return () => window.removeEventListener('click', handler)
  }, [requestPermission])

  const openSettings = useCallback(() => setSettingsOpen(true), [])
  const closeSettings = useCallback(() => setSettingsOpen(false), [])

  // Keyboard shortcuts
  useKeyboard({
    ' ': toggle,
    r: reset,
    '1': () => switchMode('pomodoro'),
    '2': () => switchMode('shortBreak'),
    '3': () => switchMode('longBreak'),
    'ctrl+,': openSettings,
  })

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 text-white">
      <Header onSettingsClick={openSettings} sessionCount={sessionCount} />

      {/* Mode tabs */}
      <nav
        className="flex gap-1 mt-6 bg-black/20 rounded-xl p-1"
        aria-label="Timer mode"
        role="tablist"
      >
        {MODES.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={mode === key}
            onClick={() => switchMode(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                        ${mode === key ? 'bg-white/25 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            title={`Switch to ${label} (press ${MODES.findIndex((m) => m.key === key) + 1})`}
            data-testid={`mode-tab-${key}`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Timer */}
      <TimerDisplay secondsLeft={secondsLeft} mode={mode} />
      <TimerControls isRunning={isRunning} onToggle={toggle} onReset={reset} />

      {/* Keyboard hint */}
      {!isRunning && secondsLeft > 0 && (
        <p className="mt-4 text-white/30 text-xs">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">Space</kbd> to start
        </p>
      )}

      {/* Current mode label */}
      <p className="mt-2 text-white/50 text-xs text-center max-w-xs">
        {mode === 'pomodoro'
          ? 'Time to focus! Select a task to work on.'
          : `${MODE_LABELS[mode]} — take a moment to rest.`}
      </p>

      {/* Task list */}
      <TaskList />

      {/* Settings modal */}
      {settingsOpen && <SettingsModal onClose={closeSettings} />}
    </main>
  )
}
