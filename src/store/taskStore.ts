import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task } from '@/types'
import { STORAGE_KEYS } from '@/lib/localStorage'

interface TaskStore {
  tasks: Task[]
  selectedTaskId: string | null
  addTask: (title: string, estimatedPomodoros?: number) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  selectTask: (id: string | null) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  incrementTaskPomodoro: (id: string) => void
  clearCompleted: () => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      selectedTaskId: null,

      addTask: (title, estimatedPomodoros = 1) =>
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
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      selectTask: (id) => set({ selectedTaskId: id }),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      incrementTaskPomodoro: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, actualPomodoros: t.actualPomodoros + 1 } : t
          ),
        })),

      clearCompleted: () =>
        set((state) => ({
          tasks: state.tasks.filter((t) => !t.completed),
        })),
    }),
    {
      name: STORAGE_KEYS.TASKS,
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
)
