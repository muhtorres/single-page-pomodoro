'use client'
import { useTaskStore } from '@/store/taskStore'
import { useProjectStore } from '@/store/projectStore'
import { TaskItem } from './TaskItem'
import { AddTask } from './AddTask'
import { ProjectDropdown } from '@/components/Projects/ProjectDropdown'

export function TaskList() {
  const { tasks, selectedTaskId, clearCompleted } = useTaskStore()
  const { selectedProjectId } = useProjectStore()

  const filterByProject = (list: typeof tasks) => {
    if (selectedProjectId === null) return list
    return list.filter((t) => t.projectId === selectedProjectId)
  }

  const active = filterByProject(tasks.filter((t) => !t.completed))
  const done = filterByProject(tasks.filter((t) => t.completed))

  return (
    <section className="w-full max-w-lg mt-12 pb-16" aria-label="Task list">
      <div className="border-t border-white/20 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white/80 font-semibold text-sm uppercase tracking-widest">Tasks</h2>
          {active.length > 0 && (
            <span className="text-white/50 text-xs">
              {active.length} remaining
            </span>
          )}
        </div>

        {/* Project filter dropdown */}
        <ProjectDropdown />

        {/* Active tasks */}
        <div className="space-y-2" role="listbox" aria-label="Active tasks">
          {active.length === 0 && done.length === 0 && (
            <p className="text-white/40 text-sm text-center py-4">
              No tasks yet. Add one below!
            </p>
          )}
          {active.map((task) => (
            <TaskItem key={task.id} task={task} isSelected={selectedTaskId === task.id} />
          ))}
        </div>

        {/* Add task */}
        <AddTask />

        {/* Completed tasks */}
        {done.length > 0 && (
          <details className="mt-6">
            <summary className="text-white/50 text-sm cursor-pointer hover:text-white/80 transition-colors
                                select-none flex items-center gap-2 list-none">
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
                className="transition-transform open:rotate-90"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              Completed ({done.length})
              <button
                onClick={(e) => {
                  e.preventDefault()
                  clearCompleted()
                }}
                className="ml-auto text-white/30 hover:text-white/60 transition-colors text-xs"
              >
                Clear
              </button>
            </summary>
            <div className="space-y-2 mt-3" role="listbox" aria-label="Completed tasks">
              {done.map((task) => (
                <TaskItem key={task.id} task={task} isSelected={false} />
              ))}
            </div>
          </details>
        )}
      </div>
    </section>
  )
}
