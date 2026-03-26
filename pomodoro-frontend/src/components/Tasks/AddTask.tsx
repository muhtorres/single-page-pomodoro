'use client'
import { useState, useRef } from 'react'
import { useTaskStore } from '@/store/taskStore'
import { useProjectStore } from '@/store/projectStore'

export function AddTask() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [estimate, setEstimate] = useState(1)
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  const addTask = useTaskStore((s) => s.addTask)
  const { projects, selectedProjectId: filterProjectId } = useProjectStore()

  const handleOpen = () => {
    // Pre-select current filter project if one is active
    setSelectedProjectId(filterProjectId ?? '')
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const effectiveProjectId = selectedProjectId || null
  // Submit is disabled if no project is selected and there's no filter project active
  const canSubmit = title.trim().length > 0 && (filterProjectId !== null || selectedProjectId !== '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !canSubmit) return

    // Use the selected project from the form, falling back to filter project
    const projectId = selectedProjectId || filterProjectId || null
    addTask(title.trim(), estimate, projectId)
    setTitle('')
    setEstimate(1)
    setSelectedProjectId(filterProjectId ?? '')
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
    setTitle('')
    setEstimate(1)
    setSelectedProjectId('')
  }

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="w-full py-3 border-2 border-dashed border-white/40 rounded-xl
                   text-white/70 hover:border-white/70 hover:text-white transition-colors
                   flex items-center justify-center gap-2 mt-2
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        data-testid="add-task-button"
      >
        <span className="text-xl leading-none">+</span>
        <span>Add Task</span>
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 rounded-xl p-4 space-y-3 mt-2"
      data-testid="add-task-form"
    >
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What are you working on?"
        className="w-full bg-transparent border-b border-white/40 pb-2 text-white
                   placeholder-white/50 focus:outline-none focus:border-white"
        maxLength={120}
        data-testid="task-title-input"
      />

      {/* Project selector */}
      <div className="flex items-center gap-2 text-sm text-white/70">
        <span className="flex-shrink-0">Project:</span>
        {filterProjectId !== null ? (
          /* A filter is active — show it as pre-selected (but still allow changing) */
          <div className="flex-1">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-white text-sm
                         focus:outline-none focus:border-white/60 appearance-none cursor-pointer"
              data-testid="task-project-select"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} style={{ backgroundColor: '#1f2937' }}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          /* No filter — user must pick a project */
          <div className="flex-1">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-sm
                         focus:outline-none focus:border-white/60 appearance-none cursor-pointer
                         text-white"
              data-testid="task-project-select"
            >
              <option value="" style={{ backgroundColor: '#1f2937', color: '#9ca3af' }}>
                Select a project...
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} style={{ backgroundColor: '#1f2937' }}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {/* Colored indicator for selected project */}
        {effectiveProjectId && (() => {
          const proj = projects.find((p) => p.id === (selectedProjectId || filterProjectId))
          return proj ? (
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: proj.color }}
              aria-hidden="true"
            />
          ) : null
        })()}
      </div>

      <div className="flex items-center gap-2 text-sm text-white/70">
        <span>Est. Pomodoros:</span>
        <button
          type="button"
          onClick={() => setEstimate((v) => Math.max(1, v - 1))}
          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 transition-colors
                     flex items-center justify-center text-white font-bold"
          aria-label="Decrease estimate"
        >
          −
        </button>
        <span className="w-8 text-center text-white font-medium">{estimate}</span>
        <button
          type="button"
          onClick={() => setEstimate((v) => Math.min(20, v + 1))}
          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 transition-colors
                     flex items-center justify-center text-white font-bold"
          aria-label="Increase estimate"
        >
          +
        </button>
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-white/70 hover:text-white transition-colors text-sm rounded-lg
                     hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="px-4 py-2 bg-white text-gray-800 font-medium rounded-lg
                     hover:bg-white/90 transition-colors text-sm disabled:opacity-50
                     disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-white/50"
          data-testid="submit-task-button"
        >
          Add
        </button>
      </div>
    </form>
  )
}
