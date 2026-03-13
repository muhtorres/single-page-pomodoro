# Pomodoro Timer

A full-stack Pomodoro Timer application with cloud persistence and OAuth authentication.

## Architecture

```
pomodoro-timer/
├── pomodoro-frontend/    # Next.js SPA (React + TypeScript + Tailwind)
├── pomodoro-api/         # .NET 10 REST API (EF Core + PostgreSQL)
└── CLAUDE.md             # AI assistant project instructions
```

| Layer | Tech | Hosting |
|-------|------|---------|
| Frontend | Next.js, React 18, TypeScript, Tailwind CSS, Zustand | Vercel (free) |
| Backend | .NET 10, ASP.NET Core, Entity Framework Core | Fly.io (free) |
| Database | PostgreSQL | Supabase (free) |
| Auth | OAuth 2.0 (GitHub, Google, Facebook) + JWT | -- |

## Features

- **Timer**: Pomodoro (25m), Short Break (5m), Long Break (15m) with circular progress ring
- **Tasks**: Create, edit, delete tasks; track estimated vs actual pomodoros
- **Auth**: Sign in with GitHub, Google, or Facebook -- or use offline with localStorage
- **Cloud sync**: Tasks and session history persist across devices when signed in
- **Keyboard shortcuts**: Space, R, 1/2/3, Ctrl+,
- **Accessible**: ARIA roles, keyboard navigation, focus management
- **Responsive**: Mobile and desktop layouts

## Quick Start

### Frontend

```bash
cd pomodoro-frontend
npm install
npm run dev
# -> http://localhost:3000
```

### Backend

```bash
cd pomodoro-api/src/PomodoroApi
# Configure connection string in appsettings.Development.json
dotnet run
# -> http://localhost:5000
```

See [pomodoro-frontend/README.md](./pomodoro-frontend/README.md) and [pomodoro-api/README.md](./pomodoro-api/README.md) for detailed setup instructions.

## Infrastructure (free tier)

| Service | Use | Free Limit |
|---------|-----|------------|
| Supabase | PostgreSQL database | 500MB, pauses after 1 week inactivity |
| Fly.io | .NET API hosting | 3 VMs (256MB), no cold starts |
| Vercel | Next.js frontend | Unlimited for hobby |
| OAuth providers | Authentication | Free |
