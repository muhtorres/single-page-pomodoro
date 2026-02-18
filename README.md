# 🍅 Pomodoro Timer

A production-ready, single-page Pomodoro Timer built with **Next.js 14**, **React**, **TypeScript**, and **Tailwind CSS**. Inspired by the design and UX of top-rated apps like Pomofocus and Forest.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Tests](https://img.shields.io/badge/tests-134%20passing-brightgreen)

---

## Overview

The [Pomodoro Technique](https://en.wikipedia.org/wiki/Pomodoro_Technique) is a time management method that breaks work into focused intervals (traditionally 25 minutes), separated by short breaks. After every 4 pomodoros, you take a longer break.

This app implements the full technique with a clean, distraction-free UI:

- The **background color shifts** smoothly between modes — red for focus, teal for short breaks, blue for long breaks
- A **circular SVG progress ring** counts down visually
- **Tasks** track how many pomodoros each one takes
- Everything is **persisted locally** so your tasks and settings survive page reloads

---

## Features

| Feature | Details |
|---------|---------|
| ⏱ **3 Timer Modes** | Pomodoro (25m), Short Break (5m), Long Break (15m) |
| 🔵 **Circular Progress Ring** | SVG ring animating smoothly every second |
| 🔔 **Sound Notifications** | Web Audio API — no audio files, works offline |
| ✅ **Task Management** | Add, complete, delete tasks; estimate and track pomodoros per task |
| ⚙️ **Settings** | Customize all durations, volume, auto-start, long break interval |
| ⌨️ **Keyboard Shortcuts** | `Space`, `R`, `1/2/3`, `Ctrl+,` |
| 💾 **Persistence** | Tasks and settings saved to `localStorage` |
| 📱 **Responsive** | Works on mobile and desktop |
| ♿ **Accessible** | ARIA roles, keyboard navigation, focus management |

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Next.js](https://nextjs.org/) | 14 (App Router) | Framework + static export |
| [React](https://react.dev/) | 18 | UI |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 3 | Styling |
| [Zustand](https://zustand-demo.pmnd.rs/) | 4 | State management |
| [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/) | 29 / 16 | Testing |
| [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) | — | Code quality |

---

## Project Structure

```
pomodoro-timer/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root HTML layout + metadata
│   │   ├── page.tsx            # Main SPA page (entry point)
│   │   └── globals.css         # Tailwind + CSS variable for background color
│   ├── components/
│   │   ├── Timer/
│   │   │   ├── CircularProgress.tsx   # SVG countdown ring
│   │   │   ├── TimerDisplay.tsx       # MM:SS display + ring
│   │   │   └── TimerControls.tsx      # START/PAUSE + Reset buttons
│   │   ├── Tasks/
│   │   │   ├── AddTask.tsx            # Inline form to add tasks
│   │   │   ├── TaskItem.tsx           # Single task row
│   │   │   └── TaskList.tsx           # Active + completed task lists
│   │   ├── Settings/
│   │   │   └── SettingsModal.tsx      # Modal with all settings
│   │   └── Layout/
│   │       └── Header.tsx             # App title + session counter + gear icon
│   ├── hooks/
│   │   ├── useTimer.ts         # Core interval logic, mode transitions
│   │   ├── useKeyboard.ts      # Global keyboard shortcut registration
│   │   └── useNotification.ts  # Browser Notification API
│   ├── store/
│   │   ├── timerStore.ts       # Mode, secondsLeft, isRunning, sessionCount
│   │   ├── taskStore.ts        # Task CRUD + localStorage persistence
│   │   └── settingsStore.ts    # User settings + localStorage persistence
│   ├── lib/
│   │   ├── audio.ts            # Web Audio API sound synthesis
│   │   └── localStorage.ts     # SSR-safe localStorage wrapper
│   └── types/
│       └── index.ts            # Shared types, DEFAULT_SETTINGS, MODE_COLORS
├── __tests__/
│   ├── store/                  # Unit tests for Zustand stores
│   ├── hooks/                  # Hook tests with fake timers
│   └── components/             # Component integration tests
├── amplify.yml                 # AWS Amplify build config
├── deploy.sh                   # S3 + CloudFront deploy script
├── next.config.js              # Static export config
├── jest.config.js              # Jest config
└── tailwind.config.ts          # Theme + custom colors
```

---

## Running Locally

### Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.
The server supports **hot reload** — changes appear instantly without restarting.

### 3. Preview the production build locally

This serves the exact same static files that will be deployed to AWS:

```bash
npm run build       # Generates the /out folder
npx serve out       # Serves it at http://localhost:3000
```

> Use this as a final sanity check before deploying.

---

## Running Tests

```bash
# Run all 134 tests once
npm test

# Watch mode — reruns on every file save (great for development)
npm run test:watch

# Generate a coverage report
npm run test:coverage
```

### Test structure

| Folder | What's tested |
|--------|--------------|
| `__tests__/store/` | Zustand store state transitions — no DOM, fastest |
| `__tests__/hooks/` | Timer logic with `jest.useFakeTimers()` |
| `__tests__/components/` | UI interactions via `userEvent` |

---

## Other Scripts

```bash
npm run lint        # ESLint — check for code issues
npm run format      # Prettier — auto-format all files
npm run build       # Production build → /out directory
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start / Pause timer |
| `R` | Reset current timer |
| `1` | Switch to Pomodoro |
| `2` | Switch to Short Break |
| `3` | Switch to Long Break |
| `Ctrl+,` | Open Settings |

> Shortcuts are disabled when focus is inside a text input.

---

## Deploying to AWS

The app compiles to a fully **static site** (HTML + JS + CSS in the `/out` folder), so it runs on any CDN with no server required.

### Option A — AWS Amplify ✅ Recommended

Zero infrastructure to manage. Amplify handles CDN, SSL, and CI/CD automatically.

**Steps:**

1. Push your code to **GitHub**, GitLab, or Bitbucket
2. Open the [AWS Amplify Console](https://console.aws.amazon.com/amplify)
3. Click **New app → Host web app**
4. Connect your repository and select the branch to deploy
5. Amplify auto-detects `amplify.yml` — no manual configuration needed
6. Click **Save and deploy**

Your app goes live at a URL like `https://main.d1abc123.amplifyapp.com`.

To use a **custom domain**: go to **App settings → Domain management → Add domain**.

> Every push to the connected branch triggers an automatic redeploy.

---

### Option B — S3 + CloudFront

Use this if you want full control over the infrastructure.

#### First-time setup

```bash
# 1. Create an S3 bucket
aws s3 mb s3://YOUR_BUCKET_NAME --region us-east-1

# 2. Enable static website hosting
aws s3 website s3://YOUR_BUCKET_NAME \
  --index-document index.html \
  --error-document index.html
```

Then in the AWS Console:

1. Open **CloudFront → Create distribution**
2. Set your S3 bucket as the **origin**
3. Set **Default root object** to `index.html`
4. Add a **custom error response**: 404 → `/index.html` → HTTP 200
5. Request a free **SSL certificate** via ACM (must be in `us-east-1` for CloudFront)

#### Deploy

```bash
export S3_BUCKET=your-bucket-name
export CF_DISTRIBUTION_ID=EXXXXXXXXX   # from CloudFront console
export AWS_REGION=us-east-1

chmod +x deploy.sh
./deploy.sh
```

The script runs `npm run build`, syncs `/out` to S3, and invalidates the CloudFront cache automatically.

#### What `deploy.sh` does

1. Builds the static export (`npm run build`)
2. Uploads JS/CSS assets with **1-year cache** (safe — filenames are content-hashed)
3. Uploads HTML files with **no cache** (so users always get the latest version)
4. Triggers a **CloudFront cache invalidation**

---

### No environment variables required

All application state is client-side only. No API keys or server secrets are needed.

---

## Architecture Notes

- **Timer state is intentionally not persisted** — reloading the page always starts a fresh session, which is the correct Pomodoro UX (an interrupted session shouldn't auto-resume)
- **Background color** is a CSS custom property (`--color-bg`) animated with a 700ms transition, giving the signature smooth color shift between modes
- **Web Audio API** synthesizes the timer-end sound — no `.mp3` files to ship or host
- **`useTimerStore.getState()`** is called inside `setInterval` (instead of reading from the React closure) to avoid stale state bugs — a common pitfall with timers in React
- **`output: 'export'`** in `next.config.js` disables all server-side Next.js features in exchange for a portable static bundle deployable anywhere
