'use client'
import { useState } from 'react'
import { Task } from '@/types'
import { useTaskStore } from '@/store/taskStore'

interface TaskItemProps {
  task: Task
  isSelected: boolean
}

export function TaskItem({ task, isSelected }: TaskItemProps) {
  const { toggleTask, deleteTask, selectTask, updateTask } = useTaskStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editEstimate, setEditEstimate] = useState(task.estimatedPomodoros)

  const handleSelect = () => {
    selectTask(isSelected ? null : task.id)
  }

  const handleSave = () => {
    if (editTitle.trim() && editEstimate >= 1) {
      updateTask(task.id, { title: editTitle.trim(), estimatedPomodoros: editEstimate })
      setIsEditing(false)
      setEditTitle(task.title)
      setEditEstimate(task.estimatedPomodoros)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditTitle(task.title)
    setEditEstimate(task.estimatedPomodoros)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const progress = task.estimatedPomodoros > 0 ? task.actualPomodoros / task.estimatedPomodoros : 0

  return (
    <div
      className={`group flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors
                  ${isSelected ? 'bg-white/20 border-2 border-white/30' : 'bg-white/10 hover:bg-white/15'}`}
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
      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Task title"
            className="flex-1 bg-white/20 border-2 border-white/40 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-white transition-colors"
            autoFocus
          />
        </div>
      ) : (
        <span
          className={`flex-1 text-white text-sm leading-snug truncate ${task.completed ? 'line-through opacity-50' : ''}`}
        >
          {task.title}
        </span>
      )}

      {/* Estimated pomodoros */}
      {isEditing ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditEstimate((v) => Math.max(1, v - 1))}
            className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 transition-colors
                       flex items-center justify-center text-white font-bold text-sm"
            aria-label="Decrease estimate"
          >
            −
          </button>
          <span className="w-8 text-center text-white font-medium text-sm">{editEstimate}</span>
          <button
            type="button"
            onClick={() => setEditEstimate((v) => Math.min(20, v + 1))}
            className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 transition-colors
                       flex items-center justify-center text-white font-bold text-sm"
            aria-label="Increase estimate"
          >
            +
          </button>
        </div>
      ) : (
        <span className="text-white/50 text-xs whitespace-nowrap font-mono">
          {task.actualPomodoros}/{task.estimatedPomodoros}
        </span>
      )}

      {/* Progress bar (small) */}
      {!isEditing && task.estimatedPomodoros > 0 && (
        <div className="flex-1" aria-hidden="true">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/60 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Edit button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsEditing(true)
        }}
        className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-white
                   transition-all p-1 rounded focus-visible:opacity-100
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        aria-label="Edit task"
        data-testid={`task-edit-${task.id}`}
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
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>

      {/* Save/Cancel buttons (when editing) */}
      {isEditing && (
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors
                       text-white text-xs focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-white/50"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors
                       text-white/70 text-xs focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-white/50"
          >
            Cancel
          </button>
        </div>
      )}

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
