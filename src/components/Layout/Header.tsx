interface HeaderProps {
  onSettingsClick: () => void
  sessionCount: number
  panelOpen: boolean
  setPanelOpen: (open: boolean) => void
}

export function Header({ onSettingsClick, sessionCount, panelOpen, setPanelOpen }: HeaderProps) {
  return (
    <header className="w-full max-w-lg flex items-center justify-between py-2 gap-4">
      <h1 className="text-xl font-bold text-white tracking-tight">Pomodoro Timer</h1>

      <div className="flex items-center gap-3">
        {/* Panel toggle button (mobile only) */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className={`p-2 rounded-lg transition-colors text-white focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-white/50 lg:hidden
                     ${panelOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
          aria-label="Toggle task panel"
          title="Toggle task panel"
          data-testid="panel-toggle"
        >
          {panelOpen ? (
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
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
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
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
            </svg>
          )}
        </button>

        {/* Session counter */}
        {sessionCount > 0 && (
          <div
            className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5"
            title={`${sessionCount} pomodoro${sessionCount !== 1 ? 's' : ''} completed`}
            data-testid="session-counter"
          >
            <span className="text-white/60 text-sm">🍅</span>
            <span className="text-white font-bold text-sm">{sessionCount}</span>
          </div>
        )}

        {/* Settings button */}
        <button
          onClick={onSettingsClick}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Open settings (Ctrl+,)"
          title="Settings (Ctrl+,)"
          data-testid="settings-button"
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
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </header>
  )
}
