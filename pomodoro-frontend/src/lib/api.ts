import { AuthUser, Project, Task, TimerMode } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5175'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('auth_token')
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`API ${res.status}: ${text}`)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export function getOAuthUrl(provider: 'github' | 'google' | 'facebook'): string {
  return `${API_URL}/api/auth/${provider}`
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  return request<AuthUser>('/api/auth/me')
}

// ── Projects ──────────────────────────────────────────────────────────────────

export interface ApiProject {
  id: string
  name: string
  color: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

function apiProjectToProject(p: ApiProject): Project {
  return {
    id: p.id,
    name: p.name,
    color: p.color,
    isDefault: p.isDefault,
    createdAt: new Date(p.createdAt).getTime(),
  }
}

export async function fetchProjects(): Promise<Project[]> {
  const apiProjects = await request<ApiProject[]>('/api/projects')
  return apiProjects.map(apiProjectToProject)
}

export async function createProject(name: string, color: string): Promise<Project> {
  const apiProject = await request<ApiProject>('/api/projects', {
    method: 'POST',
    body: JSON.stringify({ name, color }),
  })
  return apiProjectToProject(apiProject)
}

export async function updateProject(
  id: string,
  updates: { name?: string; color?: string }
): Promise<Project> {
  const apiProject = await request<ApiProject>(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
  return apiProjectToProject(apiProject)
}

export async function deleteProject(id: string): Promise<void> {
  return request<void>(`/api/projects/${id}`, { method: 'DELETE' })
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export interface ApiTask {
  id: string
  title: string
  isCompleted: boolean
  estimatedPomodoros: number
  actualPomodoros: number
  createdAt: string
  updatedAt: string
  projectId: string | null
}

function apiTaskToTask(t: ApiTask): Task {
  return {
    id: t.id,
    title: t.title,
    completed: t.isCompleted,
    estimatedPomodoros: t.estimatedPomodoros,
    actualPomodoros: t.actualPomodoros,
    createdAt: new Date(t.createdAt).getTime(),
    projectId: t.projectId,
  }
}

export async function fetchTasks(): Promise<Task[]> {
  const apiTasks = await request<ApiTask[]>('/api/tasks')
  return apiTasks.map(apiTaskToTask)
}

export async function createTask(
  title: string,
  estimatedPomodoros: number,
  projectId?: string | null
): Promise<Task> {
  const apiTask = await request<ApiTask>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, estimatedPomodoros, projectId: projectId ?? null }),
  })
  return apiTaskToTask(apiTask)
}

export async function updateTask(
  id: string,
  updates: {
    title?: string
    estimatedPomodoros?: number
    actualPomodoros?: number
    isCompleted?: boolean
    projectId?: string | null
  }
): Promise<Task> {
  const apiTask = await request<ApiTask>(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
  return apiTaskToTask(apiTask)
}

export async function deleteTask(id: string): Promise<void> {
  return request<void>(`/api/tasks/${id}`, { method: 'DELETE' })
}

export async function clearCompletedTasks(): Promise<void> {
  return request<void>('/api/tasks/completed', { method: 'DELETE' })
}

// ── Sessions ──────────────────────────────────────────────────────────────────

export async function createSession(payload: {
  mode: TimerMode
  durationMinutes: number
  taskId?: string | null
  wasCompleted?: boolean
}): Promise<void> {
  return request<void>('/api/sessions', {
    method: 'POST',
    body: JSON.stringify({
      mode: payload.mode,
      durationMinutes: payload.durationMinutes,
      taskId: payload.taskId ?? null,
      wasCompleted: payload.wasCompleted ?? true,
    }),
  })
}
