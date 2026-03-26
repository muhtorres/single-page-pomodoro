---
name: project_architecture
description: Monorepo structure, Zustand store patterns, dual persistence (API vs localStorage), and key file paths
type: project
---

## Monorepo layout
- `pomodoro-frontend/` — Next.js 16, React 18, TypeScript 5, Tailwind CSS 3, Zustand
- `pomodoro-api/` — .NET 10 ASP.NET Core, EF Core, PostgreSQL via Supabase

## Key frontend files
- `src/types/index.ts` — All shared types + constants (PROJECT_COLORS, DEFAULT_SETTINGS, MODE_COLORS)
- `src/lib/localStorage.ts` — SSR-safe wrapper + STORAGE_KEYS constant
- `src/lib/api.ts` — HTTP client with Bearer auth; all API functions live here
- `src/store/` — Zustand stores: authStore, taskStore, settingsStore, projectStore
- `src/app/page.tsx` — Main SPA page, orchestrates all modals and store inits

## Dual persistence pattern (taskStore / projectStore)
- Check `isAuthenticated()` (reads `auth_token` from localStorage)
- If authenticated: call API, then update local state from response
- If not: manipulate Zustand state + rely on `persist` middleware for localStorage
- Stores use `partialize` to only persist data fields (not transient UI state)

## Store init order in page.tsx
`rehydrate()` → then call `initProjects()` (needs auth state to decide API vs localStorage)

## Backend patterns
- Controllers use primary constructor DI: `public MyController(AppDbContext db)`
- `GetCurrentUserId()` helper parses sub claim in every authorized controller
- `ToResponse()` static helper maps entity → DTO record
- Default project auto-created in `AuthController.FindOrCreateUser` when `user is null`
- `TasksController.CreateTask` falls back to user's default project if `ProjectId` is null

## Styling conventions
- Dark theme: `bg-white/10`, `bg-white/20`, `text-white/50`, `text-white/70`, `text-white/80`
- Modals: white background (`bg-white text-gray-800`), `rounded-2xl`, `shadow-2xl`, `z-50`
- Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50`
- Buttons hover: `hover:bg-white/10` or `hover:bg-white/15`

**Why:** Understanding these patterns avoids inconsistencies and speeds up feature additions.
**How to apply:** Follow these patterns for any new stores, components, or API endpoints.
