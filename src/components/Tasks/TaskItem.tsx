import { Task } from '@/types'
import { useTaskStore } from '@/store/taskStore'

interface TaskItemProps {
  task: Task
  isSelected: boolean
}

export function TaskItem({ task, isSelected }: TaskItemProps) {
  const { toggleTask, deleteTask, selectTask } = useTaskStore()

  const handleSelect = () => {
    selectTask(isSelected ? null : task.id)
  }

  return (
    <div
      className={`group flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors
                  ${isSelected ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'}`}
      onClick={handleSelect}
      role="option"
      aria-selected={isSelected}
      data-testid={`task-item-${task.id}`}
    >
      {/* Completion checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          toggleTask(task.id)
        }}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
                    transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                    ${task.completed ? 'bg-white border-white' : 'border-white/60 hover:border-white'}`}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        data-testid={`task-toggle-${task.id}`}
      >
        {task.completed && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#BA4949"
            strokeWidth="3"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      {/* Task title */}
      <span
        className={`flex-1 text-white text-sm leading-snug ${task.completed ? 'line-through opacity-50' : ''}`}
      >
        {task.title}
      </span>

      {/* Pomodoro count */}
      <span className="text-white/50 text-xs whitespace-nowrap font-mono">
        {task.actualPomodoros}/{task.estimatedPomodoros}
      </span>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          deleteTask(task.id)
        }}
        className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-white
                   transition-all p-1 rounded focus-visible:opacity-100
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        aria-label={`Delete task: ${task.title}`}
        data-testid={`task-delete-${task.id}`}
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
          aria-hidden="true"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
    </div>
  )
}
