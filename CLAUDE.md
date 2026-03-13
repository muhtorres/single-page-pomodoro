# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack Pomodoro Timer application. Monorepo with two projects:

- **`pomodoro-frontend/`** — Next.js SPA (React + TypeScript + Tailwind + Zustand)
- **`pomodoro-api/`** — .NET 10 REST API (EF Core + PostgreSQL via Supabase)

Users can sign in via OAuth (GitHub, Google, Facebook) to sync tasks and sessions across devices, or use the app offline with localStorage.

## Tech Stack

### Frontend (`pomodoro-frontend/`)
- **Next.js** (App Router) - Framework + static export
- **React 18** - UI
- **TypeScript 5** - Type safety
- **Tailwind CSS 3** - Styling
- **Zustand** - State management
- **Jest + React Testing Library** - Testing
- **ESLint + Prettier** - Code quality

### Backend (`pomodoro-api/`)
- **.NET 10** (ASP.NET Core) - Web API
- **Entity Framework Core** - ORM + migrations
- **Npgsql** - PostgreSQL driver
- **JWT Bearer** - API authentication
- **Supabase** - PostgreSQL hosting (free)
- **Fly.io** - API hosting (free)

## Architecture

### Frontend components
- `pomodoro-frontend/src/app/page.tsx` - Main SPA page (entry point)
- `pomodoro-frontend/src/app/auth/callback/page.tsx` - OAuth callback handler
- `pomodoro-frontend/src/components/` - UI components by feature:
  - `Auth/LoginModal.tsx` - OAuth login buttons
  - `Timer/` - CircularProgress, TimerDisplay, TimerControls
  - `Tasks/` - AddTask, TaskItem, TaskList, TaskPanel
  - `Settings/SettingsModal.tsx`
  - `Layout/Header.tsx` - Title, session counter, avatar/logout
- `pomodoro-frontend/src/hooks/` - Custom React hooks:
  - `useTimer` - Timer logic, mode transitions, session recording
  - `useKeyboard` - Global keyboard shortcuts
  - `useNotification` - Browser Notification API
- `pomodoro-frontend/src/store/` - Zustand stores:
  - `authStore` - JWT auth state (login/logout/rehydrate)
  - `timerStore` - Timer state (not persisted)
  - `taskStore` - Task CRUD (API when authenticated, localStorage otherwise)
  - `settingsStore` - User settings (localStorage)
- `pomodoro-frontend/src/lib/` - Utilities:
  - `api.ts` - HTTP client with automatic JWT Authorization header
  - `audio.ts` - Web Audio API sound synthesis
  - `localStorage.ts` - SSR-safe localStorage wrapper

### Backend structure
- `pomodoro-api/src/PomodoroApi/Controllers/` - AuthController, TasksController, SessionsController
- `pomodoro-api/src/PomodoroApi/Models/` - User, TaskItem, PomodoroSession
- `pomodoro-api/src/PomodoroApi/Data/AppDbContext.cs` - EF Core context
- `pomodoro-api/src/PomodoroApi/Services/TokenService.cs` - JWT generation/validation
- `pomodoro-api/src/PomodoroApi/Program.cs` - DI, auth, CORS, middleware

### Key Design Patterns
- **Auth**: Backend-side OAuth flow -> JWT token -> frontend stores in localStorage
- **Dual persistence**: API when authenticated, localStorage when not
- **Session recording**: Fire-and-forget in useTimer (non-blocking)
- **Timer state**: Intentionally not persisted (correct Pomodoro UX)
- **Audio**: Web Audio API synthesizes sounds (no audio files)

## Development Setup

### Frontend
```bash
cd pomodoro-frontend
npm install
npm run dev
```
Open http://localhost:3000

### Backend
```bash
cd pomodoro-api/src/PomodoroApi
dotnet run
```
API runs at http://localhost:5000. Configure `appsettings.Development.json` with DB connection string and OAuth credentials.

### Testing (frontend)
```bash
cd pomodoro-frontend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Build
```bash
# Frontend
cd pomodoro-frontend && npm run build

# Backend
cd pomodoro-api/src/PomodoroApi && dotnet build

# Backend migrations
cd pomodoro-api/src/PomodoroApi && dotnet ef migrations add MigrationName --output-dir Data/Migrations
```
