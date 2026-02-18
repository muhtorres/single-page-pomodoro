'use client'
import { useState, useRef } from 'react'
import { useTaskStore } from '@/store/taskStore'

export function AddTask() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [estimate, setEstimate] = useState(1)
  const inputRef = useRef<HTMLInputElement>(null)
  const addTask = useTaskStore((s) => s.addTask)

  const handleOpen = () => {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addTask(title.trim(), estimate)
    setTitle('')
    setEstimate(1)
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
    setTitle('')
    setEstimate(1)
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
          disabled={!title.trim()}
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
