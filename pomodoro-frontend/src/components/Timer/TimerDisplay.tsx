'use client'
import { useState } from 'react'
import { CircularProgress } from './CircularProgress'
import { useTaskStore } from '@/store/taskStore'
import { useProjectStore } from '@/store/projectStore'
import { useSettingsStore } from '@/store/settingsStore'
import { TimerMode, MODE_LABELS } from '@/types'

interface TimerDisplayProps {
  secondsLeft: number
  mode: TimerMode
}

export function TimerDisplay({ secondsLeft, mode }: TimerDisplayProps) {
  const { settings } = useSettingsStore()
  const { tasks, selectedTaskId, selectTask } = useTaskStore()
  const { projects, selectedProjectId } = useProjectStore()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const selectedTask = tasks.find((t) => t.id === selectedTaskId)

  const handleSelectTask = (taskId: string) => {
    selectTask(taskId)
    setIsDropdownOpen(false)
  }

  const totalSeconds =
    mode === 'pomodoro'
      ? settings.pomodoroDuration * 60
      : mode === 'shortBreak'
        ? settings.shortBreakDuration * 60
        : settings.longBreakDuration * 60

  const percentage = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  const activeTasks = tasks.filter((t) => {
    if (t.completed) return false
    if (selectedProjectId) return t.projectId === selectedProjectId
    return true
  })

  const dropdownTasks = activeTasks

  return (
    <div
      role="timer"
      aria-label={`${mm}:${ss} remaining`}
      aria-live="off"
      className="mt-8"
    >
      {/* Timer container - keeps circle and time centered together */}
      <div className="relative flex items-center justify-center">
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

      {/* Task selection dropdown - positioned below timer */}
      <div className="mt-6 flex justify-center">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl
                       transition-colors text-white text-sm font-medium focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-white/50"
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>{selectedTask ? selectedTask.title : 'Select a task'}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div
              className="absolute top-full mt-2 w-72 bg-gray-800/95 backdrop-blur-sm border border-white/20 rounded-xl
                         shadow-xl z-50 max-h-64 overflow-auto"
              role="listbox"
            >
              {dropdownTasks.length === 0 ? (
                <p className="px-4 py-3 text-sm text-white/50 text-center">
                  No tasks for this project
                </p>
              ) : (
                dropdownTasks.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId)
                  return (
                    <button
                      key={task.id}
                      onClick={() => handleSelectTask(task.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors first:rounded-t-xl last:rounded-b-xl
                                 ${task.id === selectedTaskId ? 'bg-white/15' : ''}`}
                      role="option"
                      aria-selected={task.id === selectedTaskId}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex-shrink-0 w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: project?.color ?? '#ffffff40' }}
                          aria-hidden="true"
                        />
                        <span className="flex-1 text-sm font-medium text-white truncate">
                          {task.title}
                        </span>
                        <span className="flex-shrink-0 text-xs text-white/60 font-mono">
                          {task.actualPomodoros}/{task.estimatedPomodoros}
                        </span>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
