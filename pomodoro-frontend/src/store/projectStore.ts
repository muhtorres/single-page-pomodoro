import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Project } from '@/types'
import { STORAGE_KEYS, getItem, setItem } from '@/lib/localStorage'
import * as api from '@/lib/api'

const DEFAULT_PROJECT_ID = 'default'

function createDefaultProject(): Project {
  return {
    id: DEFAULT_PROJECT_ID,
    name: 'Default',
    color: '#3B82F6',
    isDefault: true,
    createdAt: Date.now(),
  }
}

interface ProjectStore {
  projects: Project[]
  /** null means "All Projects" */
  selectedProjectId: string | null

  /** Ensure Default project exists; sync from API if authenticated */
  initProjects: () => Promise<void>

  /** Load projects from API */
  fetchProjectsFromApi: () => Promise<void>

  addProject: (name: string, color: string) => Promise<void>
  updateProject: (id: string, updates: { name?: string; color?: string }) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  setSelectedProject: (id: string | null) => void
}

function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return !!window.localStorage.getItem('auth_token')
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      selectedProjectId: null,

      initProjects: async () => {
        if (isAuthenticated()) {
          await get().fetchProjectsFromApi()
        } else {
          // localStorage mode: ensure a Default project exists
          const projects = get().projects
          if (projects.length === 0) {
            const defaultProject = createDefaultProject()
            set({ projects: [defaultProject] })
          }
        }
      },

      fetchProjectsFromApi: async () => {
        const projects = await api.fetchProjects()
        set({ projects })
      },

      addProject: async (name, color) => {
        if (isAuthenticated()) {
          const project = await api.createProject(name, color)
          set((state) => ({ projects: [...state.projects, project] }))
        } else {
          const newProject: Project = {
            id: crypto.randomUUID(),
            name,
            color,
            isDefault: false,
            createdAt: Date.now(),
          }
          set((state) => ({ projects: [...state.projects, newProject] }))
        }
      },

      updateProject: async (id, updates) => {
        if (isAuthenticated()) {
          const project = await api.updateProject(id, updates)
          set((state) => ({
            projects: state.projects.map((p) => (p.id === id ? project : p)),
          }))
        } else {
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
          }))
        }
      },

      deleteProject: async (id) => {
        const { projects } = get()
        const project = projects.find((p) => p.id === id)
        if (!project || project.isDefault) return

        if (isAuthenticated()) {
          await api.deleteProject(id)
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            selectedProjectId:
              state.selectedProjectId === id ? null : state.selectedProjectId,
          }))
        } else {
          // In localStorage mode, reassign tasks to the default project
          const defaultProject = projects.find((p) => p.isDefault)
          if (defaultProject) {
            // Dynamically import to avoid circular dependency
            const { useTaskStore } = await import('@/store/taskStore')
            const taskStore = useTaskStore.getState()
            const tasksToReassign = taskStore.tasks.filter((t) => t.projectId === id)
            for (const task of tasksToReassign) {
              await taskStore.updateTask(task.id, { projectId: defaultProject.id })
            }
          }

          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            selectedProjectId:
              state.selectedProjectId === id ? null : state.selectedProjectId,
          }))
        }
      },

      setSelectedProject: (id) => set({ selectedProjectId: id }),
    }),
    {
      name: STORAGE_KEYS.PROJECTS,
      // Don't persist selectedProjectId — filter resets on page reload
      partialize: (state) => ({ projects: state.projects }),
    }
  )
)
