import { renderHook, act } from '@testing-library/react'
import { useTimer } from '@/hooks/useTimer'
import { useTimerStore } from '@/store/timerStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useTaskStore } from '@/store/taskStore'
import { DEFAULT_SETTINGS } from '@/types'

const resetStores = () => {
  useTimerStore.setState({
    mode: 'pomodoro',
    secondsLeft: 1500,
    isRunning: false,
    sessionCount: 0,
  })
  useSettingsStore.setState({ settings: { ...DEFAULT_SETTINGS } })
  useTaskStore.setState({ tasks: [], selectedTaskId: null })
}

beforeEach(() => {
  jest.useFakeTimers()
  resetStores()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('useTimer hook', () => {
  describe('toggle', () => {
    it('starts the timer when paused', () => {
      const { result } = renderHook(() => useTimer())
      expect(result.current.isRunning).toBe(false)
      act(() => result.current.toggle())
      expect(result.current.isRunning).toBe(true)
    })

    it('pauses the timer when running', () => {
      const { result } = renderHook(() => useTimer())
      act(() => result.current.toggle())
      act(() => result.current.toggle())
      expect(result.current.isRunning).toBe(false)
    })
  })

  describe('countdown', () => {
    it('decrements secondsLeft each second', () => {
      const { result } = renderHook(() => useTimer())
      act(() => result.current.toggle())
      act(() => jest.advanceTimersByTime(5000))
      expect(result.current.secondsLeft).toBe(1495)
    })

    it('does not count when paused', () => {
      const { result } = renderHook(() => useTimer())
      act(() => jest.advanceTimersByTime(5000))
      expect(result.current.secondsLeft).toBe(1500)
    })

    it('stops counting when paused mid-run', () => {
      const { result } = renderHook(() => useTimer())
      act(() => result.current.toggle())
      act(() => jest.advanceTimersByTime(3000))
      act(() => result.current.toggle()) // pause
      act(() => jest.advanceTimersByTime(3000))
      expect(result.current.secondsLeft).toBe(1497)
    })
  })

  describe('reset', () => {
    it('resets secondsLeft to full pomodoro duration', () => {
      const { result } = renderHook(() => useTimer())
      act(() => result.current.toggle())
      act(() => jest.advanceTimersByTime(10000))
      act(() => result.current.reset())
      expect(result.current.secondsLeft).toBe(1500)
    })

    it('stops the timer on reset', () => {
      const { result } = renderHook(() => useTimer())
      act(() => result.current.toggle())
      act(() => result.current.reset())
      expect(result.current.isRunning).toBe(false)
    })
  })

  describe('switchMode', () => {
    it('switches to shortBreak mode', () => {
      const { result } = renderHook(() => useTimer())
      act(() => result.current.switchMode('shortBreak'))
      expect(result.current.mode).toBe('shortBreak')
    })

    it('sets correct duration for shortBreak (5 min)', () => {
      const { result } = renderHook(() => useTimer())
      act(() => result.current.switchMode('shortBreak'))
      expect(result.current.secondsLeft).toBe(300)
    })

    it('sets correct duration for longBreak (15 min)', () => {
      const { result } = renderHook(() => useTimer())
      act(() => result.current.switchMode('longBreak'))
      expect(result.current.secondsLeft).toBe(900)
    })

    it('stops the timer when switching modes', () => {
      const { result } = renderHook(() => useTimer())
      act(() => result.current.toggle())
      act(() => result.current.switchMode('shortBreak'))
      expect(result.current.isRunning).toBe(false)
    })
  })

  describe('timer completion — pomodoro → shortBreak', () => {
    it('switches to shortBreak when a pomodoro completes (not long break interval)', () => {
      useTimerStore.setState({ secondsLeft: 1, sessionCount: 0 })
      useSettingsStore.setState({
        settings: { ...DEFAULT_SETTINGS, autoStartBreaks: false, longBreakInterval: 4 },
      })
      const { result } = renderHook(() => useTimer())
      act(() => result.current.toggle())
      act(() => jest.advanceTimersByTime(1100))
      expect(result.current.mode).toBe('shortBreak')
    })

    it('increments session count when pomodoro completes', () => {
      useTimerStore.setState({ secondsLeft: 1, sessionCount: 0 })
      useSettingsStore.setState({
        settings: { ...DEFAULT_SETTINGS, autoStartBreaks: false },
      })
      const { result } = renderHook(() => useTimer())
      act(() => result.current.toggle())
      act(() => jest.advanceTimersByTime(1100))
      expect(result.current.sessionCount).toBe(1)
    })
  })

  describe('timer completion — pomodoro → longBreak', () => {
    it('switches to longBreak after longBreakInterval pomodoros', () => {
      useTimerStore.setState({ secondsLeft: 1, sessionCount: 3 })
      useSettingsStore.setState({
        settings: { ...DEFAULT_SETTINGS, autoStartBreaks: false, longBreakInterval: 4 },
      })
      const { result } = renderHook(() => useTimer())
      act(() => result.current.toggle())
      act(() => jest.advanceTimersByTime(1100))
      expect(result.current.mode).toBe('longBreak')
    })
  })

  describe('auto-start', () => {
    it('auto-starts break when autoStartBreaks is true', () => {
      useTimerStore.setState({ secondsLeft: 1, sessionCount: 0 })
      useSettingsStore.setState({
        settings: { ...DEFAULT_SETTINGS, autoStartBreaks: true },
      })
      const { result } = renderHook(() => useTimer())
      act(() => result.current.toggle())
      act(() => jest.advanceTimersByTime(1100))
      expect(result.current.isRunning).toBe(true)
      expect(result.current.mode).toBe('shortBreak')
    })

    it('does not auto-start break when autoStartBreaks is false', () => {
      useTimerStore.setState({ secondsLeft: 1, sessionCount: 0 })
      useSettingsStore.setState({
        settings: { ...DEFAULT_SETTINGS, autoStartBreaks: false },
      })
      const { result } = renderHook(() => useTimer())
      act(() => result.current.toggle())
      act(() => jest.advanceTimersByTime(1100))
      expect(result.current.isRunning).toBe(false)
    })
  })

  describe('task pomodoro tracking', () => {
    it('increments task pomodoro count when selected task exists', () => {
      useTaskStore.getState().addTask('Track me')
      const taskId = useTaskStore.getState().tasks[0].id
      useTaskStore.getState().selectTask(taskId)
      useTimerStore.setState({ secondsLeft: 1, sessionCount: 0 })
      useSettingsStore.setState({
        settings: { ...DEFAULT_SETTINGS, autoStartBreaks: false },
      })
      const { result } = renderHook(() => useTimer())
      act(() => result.current.toggle())
      act(() => jest.advanceTimersByTime(1100))
      expect(useTaskStore.getState().tasks[0].actualPomodoros).toBe(1)
    })
  })
})
