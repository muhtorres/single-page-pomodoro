'use client'
import { useEffect, useRef } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { useTimerStore } from '@/store/timerStore'
import { DEFAULT_SETTINGS } from '@/types'

interface SettingsModalProps {
  onClose: () => void
}

const durationFields = [
  { label: 'Pomodoro', key: 'pomodoroDuration', min: 1, max: 60 },
  { label: 'Short Break', key: 'shortBreakDuration', min: 1, max: 30 },
  { label: 'Long Break', key: 'longBreakDuration', min: 1, max: 60 },
] as const

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { settings, updateSettings, resetSettings } = useSettingsStore()
  const { setSecondsLeft, mode, isRunning } = useTimerStore()
  const overlayRef = useRef<HTMLDivElement>(null)
  const firstFocusRef = useRef<HTMLInputElement>(null)

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Focus first input on mount
  useEffect(() => {
    firstFocusRef.current?.focus()
  }, [])

  // When duration changes and timer isn't running, reset the timer to new duration
  const handleDurationChange = (key: string, value: number) => {
    updateSettings({ [key]: value })
    if (!isRunning) {
      const durationMap: Record<string, string> = {
        pomodoroDuration: 'pomodoro',
        shortBreakDuration: 'shortBreak',
        longBreakDuration: 'longBreak',
      }
      if (durationMap[key] === mode) {
        setSecondsLeft(value * 60)
      }
    }
  }

  const handleReset = () => {
    resetSettings()
    const durationMap: Record<string, number> = {
      pomodoro: DEFAULT_SETTINGS.pomodoroDuration,
      shortBreak: DEFAULT_SETTINGS.shortBreakDuration,
      longBreak: DEFAULT_SETTINGS.longBreakDuration,
    }
    if (!isRunning) {
      setSecondsLeft(durationMap[mode] * 60)
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      data-testid="settings-modal"
    >
      <div
        className="bg-white text-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            aria-label="Close settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {/* Timer Durations */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Time (minutes)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {durationFields.map(({ label, key, min, max }, i) => (
                <label key={key} className="flex flex-col gap-1.5">
                  <span className="text-xs text-gray-500 font-medium">{label}</span>
                  <input
                    ref={i === 0 ? firstFocusRef : undefined}
                    type="number"
                    min={min}
                    max={max}
                    value={settings[key]}
                    onChange={(e) => handleDurationChange(key, Number(e.target.value))}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-center text-sm
                               focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    data-testid={`setting-${key}`}
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Long break interval */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Long Break Interval
            </h3>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Long break after (pomodoros)</span>
              <input
                type="number"
                min={2}
                max={10}
                value={settings.longBreakInterval}
                onChange={(e) => updateSettings({ longBreakInterval: Number(e.target.value) })}
                className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-center text-sm
                           focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                data-testid="setting-longBreakInterval"
              />
            </label>
          </section>

          {/* Sound */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Sound
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Enable sound notifications</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                    className="sr-only peer"
                    data-testid="setting-soundEnabled"
                  />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-500
                                  transition-colors after:content-[''] after:absolute after:top-0.5
                                  after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5
                                  after:transition-transform peer-checked:after:translate-x-4" />
                </div>
              </label>

              {settings.soundEnabled && (
                <label className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-16 shrink-0">Volume</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={settings.volume}
                    onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
                    className="flex-1 accent-red-500"
                    data-testid="setting-volume"
                  />
                  <span className="text-xs text-gray-400 w-8 text-right">
                    {Math.round(settings.volume * 100)}%
                  </span>
                </label>
              )}
            </div>
          </section>

          {/* Auto Start */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Auto Start
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Auto-start breaks</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.autoStartBreaks}
                    onChange={(e) => updateSettings({ autoStartBreaks: e.target.checked })}
                    className="sr-only peer"
                    data-testid="setting-autoStartBreaks"
                  />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-500
                                  transition-colors after:content-[''] after:absolute after:top-0.5
                                  after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5
                                  after:transition-transform peer-checked:after:translate-x-4" />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Auto-start pomodoros</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.autoStartPomodoros}
                    onChange={(e) => updateSettings({ autoStartPomodoros: e.target.checked })}
                    className="sr-only peer"
                    data-testid="setting-autoStartPomodoros"
                  />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-500
                                  transition-colors after:content-[''] after:absolute after:top-0.5
                                  after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5
                                  after:transition-transform peer-checked:after:translate-x-4" />
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-500
                       hover:bg-gray-50 transition-colors text-sm
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            data-testid="settings-reset"
          >
            Reset to defaults
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-900 text-white rounded-lg
                       hover:bg-gray-700 transition-colors text-sm font-medium
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
            data-testid="settings-save"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  )
}
