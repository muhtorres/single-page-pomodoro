import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsModal } from '@/components/Settings/SettingsModal'
import { Header } from '@/components/Layout/Header'
import { useSettingsStore } from '@/store/settingsStore'
import { useTimerStore } from '@/store/timerStore'
import { DEFAULT_SETTINGS } from '@/types'

beforeEach(() => {
  useSettingsStore.setState({ settings: { ...DEFAULT_SETTINGS } })
  useTimerStore.setState({
    mode: 'pomodoro',
    secondsLeft: 1500,
    isRunning: false,
    sessionCount: 0,
  })
})

describe('Header', () => {
  it('renders the app title', () => {
    render(<Header onSettingsClick={jest.fn()} sessionCount={0} />)
    expect(screen.getByText('Pomodoro Timer')).toBeInTheDocument()
  })

  it('renders the settings button', () => {
    render(<Header onSettingsClick={jest.fn()} sessionCount={0} />)
    expect(screen.getByTestId('settings-button')).toBeInTheDocument()
  })

  it('calls onSettingsClick when settings button is clicked', async () => {
    const onSettingsClick = jest.fn()
    const user = userEvent.setup()
    render(<Header onSettingsClick={onSettingsClick} sessionCount={0} />)
    await user.click(screen.getByTestId('settings-button'))
    expect(onSettingsClick).toHaveBeenCalledTimes(1)
  })

  it('does not show session counter when count is 0', () => {
    render(<Header onSettingsClick={jest.fn()} sessionCount={0} />)
    expect(screen.queryByTestId('session-counter')).not.toBeInTheDocument()
  })

  it('shows session counter when count > 0', () => {
    render(<Header onSettingsClick={jest.fn()} sessionCount={3} />)
    expect(screen.getByTestId('session-counter')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})

describe('SettingsModal', () => {
  it('renders the settings modal', () => {
    render(<SettingsModal onClose={jest.fn()} />)
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument()
  })

  it('displays the Settings title', () => {
    render(<SettingsModal onClose={jest.fn()} />)
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = jest.fn()
    const user = userEvent.setup()
    render(<SettingsModal onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Close settings' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when clicking the overlay', async () => {
    const onClose = jest.fn()
    render(<SettingsModal onClose={onClose} />)
    const overlay = screen.getByTestId('settings-modal')
    fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', async () => {
    const onClose = jest.fn()
    render(<SettingsModal onClose={onClose} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Save & Close is clicked', async () => {
    const onClose = jest.fn()
    const user = userEvent.setup()
    render(<SettingsModal onClose={onClose} />)
    await user.click(screen.getByTestId('settings-save'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows default pomodoro duration', () => {
    render(<SettingsModal onClose={jest.fn()} />)
    const input = screen.getByTestId('setting-pomodoroDuration') as HTMLInputElement
    expect(input.value).toBe('25')
  })

  it('updates pomodoro duration', async () => {
    const user = userEvent.setup()
    render(<SettingsModal onClose={jest.fn()} />)
    const input = screen.getByTestId('setting-pomodoroDuration')
    await user.clear(input)
    await user.type(input, '30')
    expect(useSettingsStore.getState().settings.pomodoroDuration).toBe(30)
  })

  it('updates sound enabled toggle', async () => {
    const user = userEvent.setup()
    render(<SettingsModal onClose={jest.fn()} />)
    const toggle = screen.getByTestId('setting-soundEnabled')
    await user.click(toggle)
    expect(useSettingsStore.getState().settings.soundEnabled).toBe(false)
  })

  it('updates auto-start breaks toggle', async () => {
    const user = userEvent.setup()
    render(<SettingsModal onClose={jest.fn()} />)
    const toggle = screen.getByTestId('setting-autoStartBreaks')
    await user.click(toggle)
    expect(useSettingsStore.getState().settings.autoStartBreaks).toBe(false)
  })

  it('resets settings to defaults', async () => {
    // Change a setting first
    useSettingsStore.getState().updateSettings({ pomodoroDuration: 45 })
    const user = userEvent.setup()
    render(<SettingsModal onClose={jest.fn()} />)
    await user.click(screen.getByTestId('settings-reset'))
    expect(useSettingsStore.getState().settings).toEqual(DEFAULT_SETTINGS)
  })

  it('has role=dialog for accessibility', () => {
    render(<SettingsModal onClose={jest.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
