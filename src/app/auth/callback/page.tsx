'use client'
import { Suspense, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useTaskStore } from '@/store/taskStore'

function Spinner() {
  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        <p className="text-white/70 text-sm">Signing you in…</p>
      </div>
    </main>
  )
}

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setToken } = useAuthStore()
  const { fetchTasksFromApi } = useTaskStore()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const token = searchParams.get('token')
    if (!token) {
      router.replace('/?auth=error')
      return
    }

    setToken(token)
      .then(() => fetchTasksFromApi())
      .then(() => router.replace('/'))
      .catch(() => router.replace('/?auth=error'))
  }, [searchParams, setToken, fetchTasksFromApi, router])

  return <Spinner />
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CallbackHandler />
    </Suspense>
  )
}
