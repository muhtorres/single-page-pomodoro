# Pomodoro Timer — Frontend

Single-page Pomodoro Timer built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**.

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js (App Router) | Framework + static export |
| React 18 | UI |
| TypeScript 5 | Type safety |
| Tailwind CSS 3 | Styling |
| Zustand | State management |
| Jest + React Testing Library | Testing |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & run

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

### Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
# URL of the .NET API backend
NEXT_PUBLIC_API_URL=http://localhost:5175
```

## Project Structure

```
pomodoro-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root HTML layout
│   │   ├── page.tsx                  # Main SPA page
│   │   ├── globals.css               # Tailwind + CSS variables
│   │   └── auth/callback/page.tsx    # OAuth callback handler
│   ├── components/
│   │   ├── Auth/LoginModal.tsx       # Login UI (GitHub/Google/Facebook)
│   │   ├── Timer/                    # CircularProgress, TimerDisplay, TimerControls
│   │   ├── Tasks/                    # AddTask, TaskItem, TaskList, TaskPanel
│   │   ├── Settings/SettingsModal.tsx
│   │   └── Layout/Header.tsx
│   ├── hooks/
│   │   ├── useTimer.ts              # Timer logic + session recording
│   │   ├── useKeyboard.ts           # Global keyboard shortcuts
│   │   └── useNotification.ts       # Browser Notification API
│   ├── store/
│   │   ├── authStore.ts             # JWT auth state (login/logout)
│   │   ├── timerStore.ts            # Timer state (not persisted)
│   │   ├── taskStore.ts             # Task CRUD (API or localStorage)
│   │   └── settingsStore.ts         # User settings (localStorage)
│   ├── lib/
│   │   ├── api.ts                   # HTTP client with JWT auth
│   │   ├── audio.ts                 # Web Audio API sound synthesis
│   │   └── localStorage.ts          # SSR-safe localStorage wrapper
│   └── types/index.ts               # Shared types and constants
├── __tests__/                       # Unit and integration tests
├── next.config.js                   # Static export config
├── tailwind.config.ts
└── jest.config.js
```

## Scripts

```bash
npm run dev           # Development server
npm run build         # Production build (static export → /out)
npm test              # Run all tests
npm run test:watch    # Tests in watch mode
npm run test:coverage # Generate coverage report
npm run lint          # ESLint
npm run format        # Prettier
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start / Pause |
| `R` | Reset timer |
| `1` / `2` / `3` | Pomodoro / Short Break / Long Break |
| `Ctrl+,` | Open Settings |

## Authentication

When a backend is configured (`NEXT_PUBLIC_API_URL`), the app shows a login modal on first visit. Users can:

- **Sign in** with GitHub, Google, or Facebook — tasks sync to the cloud
- **Continue without signing in** — tasks are saved to localStorage only

The OAuth flow is handled by the backend. The frontend receives a JWT token via the `/auth/callback` route and stores it in `localStorage`.

## Deployment

The app compiles to a static site (`/out`). Deploy to any CDN:

- **Vercel** (recommended for Next.js)
- **AWS Amplify** (uses `amplify.yml`)
- **S3 + CloudFront** (uses `deploy.sh`)
