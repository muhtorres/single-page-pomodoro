'use client'
import { useRef, useState, useEffect } from 'react'
import { useProjectStore } from '@/store/projectStore'

export function ProjectDropdown() {
  const { projects, selectedProjectId, setSelectedProject } = useProjectStore()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? null

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const handleSelect = (id: string | null) => {
    setSelectedProject(id)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg
                    text-sm transition-colors focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-white/50
                    ${open ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Filter by project"
      >
        <span className="flex items-center gap-2 min-w-0">
          {selectedProject ? (
            <>
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: selectedProject.color }}
                aria-hidden="true"
              />
              <span className="text-white truncate">{selectedProject.name}</span>
            </>
          ) : (
            <span className="text-white/70">All Projects</span>
          )}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-white/50 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-gray-900/95 border border-white/10
                     rounded-xl shadow-xl z-20 overflow-hidden"
          role="listbox"
          aria-label="Select project"
        >
          {/* All Projects option */}
          <button
            role="option"
            aria-selected={selectedProjectId === null}
            onClick={() => handleSelect(null)}
            className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors
                        hover:bg-white/10 text-left
                        ${selectedProjectId === null ? 'bg-white/10' : ''}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white/20 flex-shrink-0" aria-hidden="true" />
            <span className="flex-1 text-white/80">All Projects</span>
            {selectedProjectId === null && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white flex-shrink-0"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>

          {/* Divider */}
          {projects.length > 0 && <div className="border-t border-white/10" />}

          {/* Project options */}
          {projects.map((project) => (
            <button
              key={project.id}
              role="option"
              aria-selected={selectedProjectId === project.id}
              onClick={() => handleSelect(project.id)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors
                          hover:bg-white/10 text-left
                          ${selectedProjectId === project.id ? 'bg-white/10' : ''}`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color }}
                aria-hidden="true"
              />
              <span className="flex-1 text-white truncate">{project.name}</span>
              {selectedProjectId === project.id && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white flex-shrink-0"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
