'use client'
import { useTaskStore } from '@/store/taskStore'
import { Task } from '@/types'

interface TaskPanelProps {
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}

export function TaskPanel({ isMobileOpen, setIsMobileOpen }: TaskPanelProps) {
  const { tasks, selectedTaskId, selectTask } = useTaskStore()
  const selectedTask = tasks.find((t) => t.id === selectedTaskId)
  const activeTasks = tasks.filter((t) => !t.completed)

  const handleCloseMobile = () => {
    setIsMobileOpen(false)
  }

  if (activeTasks.length === 0 && tasks.length === 0) {
    return (
      <div
        className={`lg:w-80 w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 transition-transform
                    ${isMobileOpen ? 'fixed inset-0 z-50 lg:relative lg:z-auto' : ''}`}
      >
        <h2 className="text-white/80 font-semibold text-sm uppercase tracking-widest mb-4">Tasks</h2>
        <p className="text-white/40 text-sm text-center">
          No tasks yet. Add one below!
        </p>
      </div>
    )
  }

  return (
    <div
      className={`lg:w-80 w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 transition-transform
                  ${isMobileOpen ? 'fixed inset-0 z-50 lg:relative lg:z-auto' : ''}`}
      role="region"
      aria-label="Task panel"
    >
      {/* Header with close button for mobile */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white/80 font-semibold text-sm uppercase tracking-widest">Tasks</h2>
        <button
          onClick={handleCloseMobile}
          className="lg:hidden text-white/50 hover:text-white transition-colors p-1"
          aria-label="Close panel"
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
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* No selected task state */}
      {!selectedTask && (
        <div className="mb-4 p-4 bg-white/5 rounded-xl text-center">
          <p className="text-white/50 text-sm">Select a task to start</p>
          {activeTasks.length > 0 && (
            <p className="text-white/30 text-xs mt-1">{activeTasks.length} task{activeTasks.length !== 1 ? 's' : ''} available</p>
          )}
        </div>
      )}

      {/* Selected task with progress */}
      {selectedTask && (
        <>
          <div className="mb-4 p-4 bg-white/15 rounded-xl border-2 border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-xs uppercase tracking-wider">Working on</span>
              <span className="px-2 py-0.5 bg-white/20 rounded text-white/80 text-xs font-medium">
                Selected
              </span>
            </div>
            <h3 className="text-white font-medium mb-2">{selectedTask.title}</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-white/50 mb-1">
                  <span>Pomodoros</span>
                  <span className="font-mono">{selectedTask.actualPomodoros}/{selectedTask.estimatedPomodoros}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/80 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (selectedTask.actualPomodoros / selectedTask.estimatedPomodoros) * 100)}%`
                    }}
                  />
                </div>
              </div>
              <button
                onClick={() => selectTask(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Deselect task"
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
                  <path d="M21 12l-9-9-9 9" />
                </svg>
              </button>
            </div>
          </div>

          {/* Task list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>All tasks</span>
              <span>{tasks.length}</span>
            </div>
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => selectTask(task.id)}
                className={`w-full text-left p-3 rounded-xl transition-colors flex items-center justify-between
                          ${task.id === selectedTaskId ? 'bg-white/20' : 'hover:bg-white/10'}
                          ${task.completed ? 'opacity-50' : ''}`}
                aria-pressed={task.id === selectedTaskId}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${task.completed ? 'bg-white border-white' : 'border-white/60'}`}
                  >
                    {task.completed && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="w-3 h-3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${task.completed ? 'line-through text-white/40' : 'text-white'}`}>
                      {task.title}
                    </p>
                    <p className="text-white/40 text-xs font-mono mt-0.5">
                      {task.actualPomodoros}/{task.estimatedPomodoros}
                    </p>
                  </div>
                </div>
                {task.id === selectedTaskId && (
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Empty state when tasks exist but none selected */}
      {!selectedTask && activeTasks.length > 0 && (
        <div className="mt-4 p-3 bg-white/5 rounded-xl text-center">
          <p className="text-white/40 text-xs">Click on a task to select it</p>
        </div>
      )}
    </div>
  )
}
