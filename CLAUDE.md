# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a production-ready, single-page Pomodoro Timer application built with Next.js 14, React, TypeScript, and Tailwind CSS. It implements the Pomodoro Technique with a clean, distraction-free UI that includes:

- Background color shifting between modes (red for focus, teal for short breaks, blue for long breaks)
- Circular SVG progress ring that counts down visually
- Task management to track pomodoros per task
- All data persisted locally using localStorage

## Tech Stack

- **Next.js 14** (App Router) - Framework + static export
- **React 18** - UI
- **TypeScript 5** - Type safety
- **Tailwind CSS 3** - Styling
- **Zustand 4** - State management
- **Jest + React Testing Library** - Testing
- **ESLint + Prettier** - Code quality

## Architecture

The application follows a clear separation of concerns:

### Core Components
- `src/app/page.tsx` - Main SPA page (entry point) with layout and component composition
- `src/components/` - Reusable UI components organized by feature:
  - Timer components (CircularProgress, TimerDisplay, TimerControls)
  - Task components (AddTask, TaskItem, TaskList)
  - Settings component (SettingsModal)
  - Layout components (Header)
- `src/hooks/` - Custom React hooks:
  - `useTimer` - Core timer logic and mode transitions
  - `useKeyboard` - Global keyboard shortcut handling
  - `useNotification` - Browser Notification API integration
- `src/store/` - Zustand stores for state management:
  - `timerStore` - Timer state (mode, secondsLeft, isRunning, sessionCount)
  - `taskStore` - Task CRUD operations with localStorage persistence
  - `settingsStore` - User settings with localStorage persistence
- `src/lib/` - Utility functions:
  - `audio.ts` - Web Audio API sound synthesis (no audio files needed)
  - `localStorage.ts` - SSR-safe localStorage wrapper

### Key Design Patterns
- **State Management**: Uses Zustand for global state management with persistence middleware
- **Persistence**: All user data (tasks and settings) is persisted to localStorage
- **Timer Logic**: Timer state is intentionally not persisted across page reloads (correct Pomodoro UX)
- **Audio**: Web Audio API synthesizes timer sounds instead of using audio files
- **Keyboard Shortcuts**: Global keyboard shortcuts with proper focus management
- **Accessibility**: ARIA roles, keyboard navigation, and focus management

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Running Locally
```bash
npm install
npm run dev
```
Open http://localhost:3000 in your browser.

### Testing
```bash
# Run all 134 tests once
npm test

# Watch mode — reruns on every file save (great for development)
npm run test:watch

# Generate a coverage report
npm run test:coverage
```

### Build & Deployment
```bash
# Production build → /out directory
npm run build

# Lint and format
npm run lint
npm run format
```

## Key Features

### Timer Modes
- Pomodoro (25m) - Focus mode
- Short Break (5m) - After every pomodoro
- Long Break (15m) - After every 4 pomodoros

### Keyboard Shortcuts
- Space: Start/Pause timer
- R: Reset current timer
- 1: Switch to Pomodoro
- 2: Switch to Short Break
- 3: Switch to Long Break
- Ctrl+,: Open Settings

### Persistence
- Tasks and settings are saved to localStorage
- Timer state is not persisted (reloads to fresh session)

### Audio
- Web Audio API synthesizes timer-end sounds
- No audio files required, works offline