'use client'
import { useEffect, useRef, useState } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { PROJECT_COLORS } from '@/types'

interface ProjectsModalProps {
  onClose: () => void
}

interface EditingState {
  id: string
  name: string
  color: string
}

export function ProjectsModal({ onClose }: ProjectsModalProps) {
  const { projects, addProject, updateProject, deleteProject } = useProjectStore()
  const overlayRef = useRef<HTMLDivElement>(null)
  const newNameRef = useRef<HTMLInputElement>(null)

  const [editing, setEditing] = useState<EditingState | null>(null)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PROJECT_COLORS[5].value) // Blue default
  const [isAdding, setIsAdding] = useState(false)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleStartEdit = (project: { id: string; name: string; color: string }) => {
    setEditing({ id: project.id, name: project.name, color: project.color })
  }

  const handleSaveEdit = async () => {
    if (!editing || !editing.name.trim()) return
    await updateProject(editing.id, { name: editing.name.trim(), color: editing.color })
    setEditing(null)
  }

  const handleCancelEdit = () => {
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    await deleteProject(id)
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    await addProject(newName.trim(), newColor)
    setNewName('')
    setNewColor(PROJECT_COLORS[5].value)
    setIsAdding(false)
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Manage Projects"
      data-testid="projects-modal"
    >
      <div
        className="bg-white text-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Projects</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            aria-label="Close projects"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {projects.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">No projects yet.</p>
          )}

          {projects.map((project) => (
            <div key={project.id}>
              {editing?.id === project.id ? (
                /* Inline edit form */
                <div className="bg-gray-50 rounded-xl p-3 space-y-3">
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit()
                      if (e.key === 'Escape') handleCancelEdit()
                    }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    autoFocus
                    maxLength={100}
                  />
                  <ColorPalette
                    selected={editing.color}
                    onSelect={(color) => setEditing({ ...editing, color })}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 text-gray-500 hover:text-gray-700 transition-colors text-sm
                                 rounded-lg hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editing.name.trim()}
                      className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium
                                 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                /* Project row */
                <div className="flex items-center gap-3 group py-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-sm font-medium text-gray-800 truncate">
                    {project.name}
                  </span>
                  {project.isDefault && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEdit(project)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100
                                 transition-colors focus-visible:outline-none focus-visible:opacity-100
                                 focus-visible:ring-2 focus-visible:ring-gray-300"
                      aria-label={`Edit project ${project.name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    {!project.isDefault && (
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50
                                   transition-colors focus-visible:outline-none focus-visible:opacity-100
                                   focus-visible:ring-2 focus-visible:ring-red-300"
                        aria-label={`Delete project ${project.name}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
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
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add new project */}
        <div className="px-6 pb-5 border-t border-gray-100 pt-4">
          {isAdding ? (
            <form onSubmit={handleAddProject} className="space-y-3">
              <input
                ref={newNameRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsAdding(false)
                    setNewName('')
                  }
                }}
                placeholder="Project name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                autoFocus
                maxLength={100}
              />
              <ColorPalette selected={newColor} onSelect={setNewColor} />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false)
                    setNewName('')
                  }}
                  className="px-3 py-1.5 text-gray-500 hover:text-gray-700 transition-colors text-sm
                             rounded-lg hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newName.trim()}
                  className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium
                             hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                >
                  Create
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2 border border-dashed border-gray-200 rounded-lg text-sm
                         text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors
                         flex items-center justify-center gap-2
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            >
              <span className="text-lg leading-none">+</span>
              New Project
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

interface ColorPaletteProps {
  selected: string
  onSelect: (color: string) => void
}

function ColorPalette({ selected, onSelect }: ColorPaletteProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Project color">
      {PROJECT_COLORS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={selected === value}
          aria-label={label}
          onClick={() => onSelect(value)}
          className={`w-7 h-7 rounded-full transition-transform focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400
                      ${selected === value ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : 'hover:scale-110'}`}
          style={{ backgroundColor: value }}
        />
      ))}
    </div>
  )
}
