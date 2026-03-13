import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task } from '@/types'
import { STORAGE_KEYS } from '@/lib/localStorage'
import * as api from '@/lib/api'

interface TaskStore {
  tasks: Task[]
  selectedTaskId: string | null
  addTask: (title: string, estimatedPomodoros?: number) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  selectTask: (id: string | null) => void
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  incrementTaskPomodoro: (id: string) => Promise<void>
  clearCompleted: () => Promise<void>
  /** Load tasks from backend (called after login) */
  fetchTasksFromApi: () => Promise<void>
}

function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return !!window.localStorage.getItem('auth_token')
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      selectedTaskId: null,

      fetchTasksFromApi: async () => {
        const tasks = await api.fetchTasks()
        set({ tasks, selectedTaskId: null })
      },

      addTask: async (title, estimatedPomodoros = 1) => {
        if (isAuthenticated()) {
          const task = await api.createTask(title, estimatedPomodoros)
          set((state) => ({ tasks: [...state.tasks, task] }))
        } else {
          set((state) => ({
            tasks: [
              ...state.tasks,
              {
                id: crypto.randomUUID(),
                title,
                completed: false,
                estimatedPomodoros,
                actualPomodoros: 0,
                createdAt: Date.now(),
              },
            ],
          }))
        }
      },

      deleteTask: async (id) => {
        if (isAuthenticated()) {
          await api.deleteTask(id)
        }
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
        }))
      },

      toggleTask: async (id) => {
        const task = get().tasks.find((t) => t.id === id)
        if (!task) return

        const newCompleted = !task.completed
        if (isAuthenticated()) {
          await api.updateTask(id, { isCompleted: newCompleted })
        }
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: newCompleted } : t
          ),
        }))
      },

      selectTask: (id) => set({ selectedTaskId: id }),

      updateTask: async (id, updates) => {
        if (isAuthenticated()) {
          const apiUpdates: Parameters<typeof api.updateTask>[1] = {}
          if (updates.title !== undefined) apiUpdates.title = updates.title
          if (updates.estimatedPomodoros !== undefined)
            apiUpdates.estimatedPomodoros = updates.estimatedPomodoros
          if (updates.actualPomodoros !== undefined)
            apiUpdates.actualPomodoros = updates.actualPomodoros
          if (updates.completed !== undefined) apiUpdates.isCompleted = updates.completed
          await api.updateTask(id, apiUpdates)
        }
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }))
      },

      incrementTaskPomodoro: async (id) => {
        const task = get().tasks.find((t) => t.id === id)
        if (!task) return

        const newCount = task.actualPomodoros + 1
        if (isAuthenticated()) {
          await api.updateTask(id, { actualPomodoros: newCount })
        }
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, actualPomodoros: newCount } : t
          ),
        }))
      },

      clearCompleted: async () => {
        if (isAuthenticated()) {
          await api.clearCompletedTasks()
        }
        set((state) => ({
          tasks: state.tasks.filter((t) => !t.completed),
        }))
      },
    }),
    {
      name: STORAGE_KEYS.TASKS,
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
)
