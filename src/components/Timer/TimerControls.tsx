interface TimerControlsProps {
  isRunning: boolean
  onToggle: () => void
  onReset: () => void
}

export function TimerControls({ isRunning, onToggle, onReset }: TimerControlsProps) {
  return (
    <div className="flex items-center gap-4 mt-8">
      <button
        onClick={onToggle}
        className="px-12 py-4 bg-white text-gray-800 font-bold text-xl rounded-xl
                   shadow-lg hover:scale-105 active:scale-95 transition-transform
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                   min-w-[160px]"
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? 'PAUSE' : 'START'}
      </button>

      <button
        onClick={onReset}
        className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                   text-white"
        aria-label="Reset timer"
        title="Reset (R)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
        </svg>
      </button>
    </div>
  )
}
