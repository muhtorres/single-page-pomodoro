import { CircularProgress } from './CircularProgress'
import { useSettingsStore } from '@/store/settingsStore'
import { TimerMode, MODE_LABELS } from '@/types'

interface TimerDisplayProps {
  secondsLeft: number
  mode: TimerMode
}

export function TimerDisplay({ secondsLeft, mode }: TimerDisplayProps) {
  const { settings } = useSettingsStore()

  const totalSeconds =
    mode === 'pomodoro'
      ? settings.pomodoroDuration * 60
      : mode === 'shortBreak'
        ? settings.shortBreakDuration * 60
        : settings.longBreakDuration * 60

  const percentage = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  return (
    <div
      className="relative flex items-center justify-center mt-8"
      role="timer"
      aria-label={`${mm}:${ss} remaining`}
      aria-live="off"
    >
      <CircularProgress percentage={percentage} size={280} />
      <div className="absolute flex flex-col items-center select-none">
        <span
          className="text-7xl font-bold font-mono tracking-tight text-white"
          data-testid="timer-display"
        >
          {mm}:{ss}
        </span>
        <span className="text-sm text-white/70 mt-1 uppercase tracking-widest">
          {MODE_LABELS[mode]}
        </span>
      </div>
    </div>
  )
}
