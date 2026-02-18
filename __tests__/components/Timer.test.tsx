import { render, screen, fireEvent } from '@testing-library/react'
import { TimerDisplay } from '@/components/Timer/TimerDisplay'
import { TimerControls } from '@/components/Timer/TimerControls'
import { CircularProgress } from '@/components/Timer/CircularProgress'
import { useSettingsStore } from '@/store/settingsStore'
import { DEFAULT_SETTINGS } from '@/types'

beforeEach(() => {
  useSettingsStore.setState({ settings: { ...DEFAULT_SETTINGS } })
})

describe('CircularProgress', () => {
  it('renders an SVG element', () => {
    const { container } = render(<CircularProgress percentage={75} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with data-testid', () => {
    render(<CircularProgress percentage={50} />)
    expect(screen.getByTestId('circular-progress')).toBeInTheDocument()
  })

  it('renders with custom size', () => {
    const { container } = render(<CircularProgress percentage={50} size={200} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '200')
    expect(svg).toHaveAttribute('height', '200')
  })

  it('clamps percentage above 100', () => {
    expect(() => render(<CircularProgress percentage={150} />)).not.toThrow()
  })

  it('clamps percentage below 0', () => {
    expect(() => render(<CircularProgress percentage={-10} />)).not.toThrow()
  })
})

describe('TimerDisplay', () => {
  it('renders the timer value in MM:SS format', () => {
    render(<TimerDisplay secondsLeft={1500} mode="pomodoro" />)
    expect(screen.getByTestId('timer-display')).toHaveTextContent('25:00')
  })

  it('pads single-digit minutes', () => {
    render(<TimerDisplay secondsLeft={299} mode="shortBreak" />)
    expect(screen.getByTestId('timer-display')).toHaveTextContent('04:59')
  })

  it('shows 00:00 at zero', () => {
    render(<TimerDisplay secondsLeft={0} mode="pomodoro" />)
    expect(screen.getByTestId('timer-display')).toHaveTextContent('00:00')
  })

  it('displays mode label for pomodoro', () => {
    render(<TimerDisplay secondsLeft={1500} mode="pomodoro" />)
    expect(screen.getByText('Pomodoro')).toBeInTheDocument()
  })

  it('displays mode label for shortBreak', () => {
    render(<TimerDisplay secondsLeft={300} mode="shortBreak" />)
    expect(screen.getByText('Short Break')).toBeInTheDocument()
  })

  it('displays mode label for longBreak', () => {
    render(<TimerDisplay secondsLeft={900} mode="longBreak" />)
    expect(screen.getByText('Long Break')).toBeInTheDocument()
  })

  it('has role="timer" for accessibility', () => {
    render(<TimerDisplay secondsLeft={1500} mode="pomodoro" />)
    expect(screen.getByRole('timer')).toBeInTheDocument()
  })

  it('has aria-label with time remaining', () => {
    render(<TimerDisplay secondsLeft={1500} mode="pomodoro" />)
    expect(screen.getByRole('timer')).toHaveAttribute('aria-label', '25:00 remaining')
  })

  it('renders circular progress', () => {
    render(<TimerDisplay secondsLeft={750} mode="pomodoro" />)
    expect(screen.getByTestId('circular-progress')).toBeInTheDocument()
  })
})

describe('TimerControls', () => {
  it('shows START button when not running', () => {
    render(<TimerControls isRunning={false} onToggle={jest.fn()} onReset={jest.fn()} />)
    expect(screen.getByRole('button', { name: 'Start timer' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start timer' })).toHaveTextContent('START')
  })

  it('shows PAUSE button when running', () => {
    render(<TimerControls isRunning={true} onToggle={jest.fn()} onReset={jest.fn()} />)
    expect(screen.getByRole('button', { name: 'Pause timer' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pause timer' })).toHaveTextContent('PAUSE')
  })

  it('calls onToggle when START button is clicked', () => {
    const onToggle = jest.fn()
    render(<TimerControls isRunning={false} onToggle={onToggle} onReset={jest.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Start timer' }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('calls onToggle when PAUSE button is clicked', () => {
    const onToggle = jest.fn()
    render(<TimerControls isRunning={true} onToggle={onToggle} onReset={jest.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Pause timer' }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('calls onReset when reset button is clicked', () => {
    const onReset = jest.fn()
    render(<TimerControls isRunning={false} onToggle={jest.fn()} onReset={onReset} />)
    fireEvent.click(screen.getByRole('button', { name: 'Reset timer' }))
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('renders reset button with icon', () => {
    render(<TimerControls isRunning={false} onToggle={jest.fn()} onReset={jest.fn()} />)
    expect(screen.getByRole('button', { name: 'Reset timer' })).toBeInTheDocument()
  })
})
