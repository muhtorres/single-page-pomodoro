import { AuthUser, Task, TimerMode } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

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

// ── Tasks ─────────────────────────────────────────────────────────────────────

export interface ApiTask {
  id: string
  title: string
  isCompleted: boolean
  estimatedPomodoros: number
  actualPomodoros: number
  createdAt: string
  updatedAt: string
}

function apiTaskToTask(t: ApiTask): Task {
  return {
    id: t.id,
    title: t.title,
    completed: t.isCompleted,
    estimatedPomodoros: t.estimatedPomodoros,
    actualPomodoros: t.actualPomodoros,
    createdAt: new Date(t.createdAt).getTime(),
  }
}

export async function fetchTasks(): Promise<Task[]> {
  const apiTasks = await request<ApiTask[]>('/api/tasks')
  return apiTasks.map(apiTaskToTask)
}

export async function createTask(title: string, estimatedPomodoros: number): Promise<Task> {
  const apiTask = await request<ApiTask>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, estimatedPomodoros }),
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
