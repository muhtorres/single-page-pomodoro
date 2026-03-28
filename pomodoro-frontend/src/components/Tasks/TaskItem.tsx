'use client'
import { useState, useEffect } from 'react'
import { Task } from '@/types'
import { useTaskStore } from '@/store/taskStore'
import { useProjectStore } from '@/store/projectStore'

interface TaskItemProps {
  task: Task
  isSelected: boolean
}

export function TaskItem({ task, isSelected }: TaskItemProps) {
  const { toggleTask, deleteTask, selectTask, updateTask } = useTaskStore()
  const { projects } = useProjectStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description ?? '')
  const [editEstimate, setEditEstimate] = useState(task.estimatedPomodoros)
  const [editProjectId, setEditProjectId] = useState<string>(task.projectId ?? '')

  // Sync edit state with task changes
  useEffect(() => {
    if (!isEditing) {
      setEditTitle(task.title)
      setEditDescription(task.description ?? '')
      setEditEstimate(task.estimatedPomodoros)
      setEditProjectId(task.projectId ?? '')
    }
  }, [task, isEditing])

  const project = task.projectId ? projects.find((p) => p.id === task.projectId) : null

  const handleSelect = () => {
    selectTask(isSelected ? null : task.id)
  }

  const handleSave = () => {
    if (editTitle.trim() && editEstimate >= 1) {
      updateTask(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        estimatedPomodoros: editEstimate,
        projectId: editProjectId || null,
      })
      setIsEditing(false)
      setEditTitle(task.title)
      setEditDescription(task.description ?? '')
      setEditEstimate(task.estimatedPomodoros)
      setEditProjectId(task.projectId ?? '')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditTitle(task.title)
    setEditDescription(task.description ?? '')
    setEditEstimate(task.estimatedPomodoros)
    setEditProjectId(task.projectId ?? '')
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

      {/* Task title + project badge - clickable to view details */}
      <div
        className="flex-1 min-w-0 flex flex-col gap-0.5 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation()
          setIsViewing(true)
        }}
      >
        <span
          className={`text-white text-sm leading-snug truncate ${task.completed ? 'line-through opacity-50' : ''}`}
          title={task.title}
        >
          {task.title}
        </span>
        {project && (
          <span className="flex items-center gap-1" aria-label={`Project: ${project.name}`}>
            <span
              className="text-xs"
              style={{ color: project.color }}
              aria-hidden="true"
            >
              ●
            </span>
            <span className="text-white/50 text-xs truncate">{project.name}</span>
          </span>
        )}
      </div>

      {/* Estimated pomodoros */}
      <span className="text-white/50 text-xs whitespace-nowrap font-mono">
        {task.actualPomodoros}/{task.estimatedPomodoros}
      </span>

      {/* Progress bar (small) */}
      {task.estimatedPomodoros > 0 && (
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

      {/* Save/Cancel buttons removed - now in modal footer */}

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

      {/* Task detail modal - View or Edit mode */}
      {(isViewing || isEditing) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={isEditing ? "Edit task" : "Task details"}
          onClick={() => { setIsViewing(false); setIsEditing(false); }}
        >
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
          <div
            className="relative bg-[#1a1f35] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-5">
              {isEditing ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-base
                             focus:outline-none focus:border-white/60"
                  autoFocus
                />
              ) : (
                <h2 className="text-white font-semibold text-base leading-snug">{task.title}</h2>
              )}
              <button
                onClick={() => { setIsViewing(false); setIsEditing(false); }}
                className="flex-shrink-0 text-white/40 hover:text-white transition-colors
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Description */}
              <div>
                <span className="text-white/50 text-sm block mb-1">Description</span>
                {isEditing ? (
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Add a description..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white
                               placeholder-white/40 focus:outline-none focus:border-white/60 text-sm resize-none"
                    rows={4}
                    maxLength={2000}
                  />
                ) : (
                  <p className="text-white/80 text-sm whitespace-pre-wrap">
                    {task.description || <span className="text-white/30 italic">No description</span>}
                  </p>
                )}
              </div>

              {/* Project */}
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-sm">Project</span>
                {isEditing ? (
                  <div className="relative">
                    <select
                      value={editProjectId}
                      onChange={(e) => setEditProjectId(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg pl-8 pr-8 py-1 text-sm text-white
                                 focus:outline-none focus:border-white/60 appearance-none cursor-pointer"
                    >
                      <option value="">No project</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    {/* Color indicator overlay */}
                    {editProjectId && (() => {
                      const selectedProject = projects.find((p) => p.id === editProjectId)
                      return selectedProject ? (
                        <span
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: selectedProject.color }}
                          aria-hidden="true"
                        />
                      ) : null
                    })()}
                    {/* Chevron icon */}
                    <svg
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                ) : project ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }} aria-hidden="true" />
                    <span className="text-white text-sm">{project.name}</span>
                  </span>
                ) : (
                  <span className="text-white/40 text-sm">—</span>
                )}
              </div>

              {/* Pomodoros */}
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-sm">Pomodoros</span>
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
                    <span className="w-12 text-center text-white font-mono text-sm">
                      {task.actualPomodoros} / {editEstimate}
                    </span>
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
                  <span className="text-white text-sm font-mono">
                    {task.actualPomodoros} / {task.estimatedPomodoros}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              {(isEditing ? editEstimate : task.estimatedPomodoros) > 0 && (
                <div className="pt-1">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/60 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (task.actualPomodoros / (isEditing ? editEstimate : task.estimatedPomodoros)) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-sm">Status</span>
                <span className={`text-sm ${task.completed ? 'text-green-400' : 'text-white/70'}`}>
                  {task.completed ? 'Completed' : 'In progress'}
                </span>
              </div>

              {/* Completed At */}
              {task.completed && task.completedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-sm">Completed at</span>
                  <span className="text-white/60 text-sm font-mono">
                    {new Date(task.completedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Footer actions */}
            {isEditing ? (
              <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors text-sm rounded-lg
                             hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-white text-gray-800 font-medium rounded-lg
                             hover:bg-white/90 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-white/50"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg
                             transition-colors text-sm focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-white/50 flex items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
