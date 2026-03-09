'use client'
import { useState, useCallback, useEffect } from 'react'
import { Header } from '@/components/Layout/Header'
import { TimerDisplay } from '@/components/Timer/TimerDisplay'
import { TimerControls } from '@/components/Timer/TimerControls'
import { TaskList } from '@/components/Tasks/TaskList'
import { TaskPanel } from '@/components/Tasks/TaskPanel'
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
  const [taskPanelOpen, setTaskPanelOpen] = useState(false)
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
    <main className="min-h-screen bg-gray-900 flex flex-col items-center px-4 py-8 text-white">
      <Header
        onSettingsClick={openSettings}
        sessionCount={sessionCount}
        panelOpen={taskPanelOpen}
        setPanelOpen={setTaskPanelOpen}
      />

      <div className="w-full max-w-6xl mt-6 lg:flex lg:gap-6 lg:items-start lg:justify-center flex-1">
        {/* Timer section */}
        <div className="flex-1 w-full lg:max-w-2xl lg:flex flex-col items-center">
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
        </div>

        {/* Task panel sidebar (desktop) */}
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <TaskPanel isMobileOpen={taskPanelOpen} setIsMobileOpen={setTaskPanelOpen} />
        </div>
      </div>

      {/* Task list (below timer) */}
      <TaskList />

      {/* Settings modal */}
      {settingsOpen && <SettingsModal onClose={closeSettings} />}

      {/* Mobile task panel overlay */}
      {taskPanelOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          onClick={() => setTaskPanelOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute right-0 top-0 bottom-0 w-80 bg-white/10 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <TaskPanel isMobileOpen={true} setIsMobileOpen={setTaskPanelOpen} />
          </div>
        </div>
      )}
    </main>
  )
}
