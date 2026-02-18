import { useTimerStore } from '@/store/timerStore'

const defaultState = {
  mode: 'pomodoro' as const,
  secondsLeft: 1500,
  isRunning: false,
  sessionCount: 0,
}

beforeEach(() => {
  useTimerStore.setState(defaultState)
})

describe('timerStore', () => {
  describe('initial state', () => {
    it('starts in pomodoro mode', () => {
      expect(useTimerStore.getState().mode).toBe('pomodoro')
    })

    it('starts with 25 minutes (1500 seconds)', () => {
      expect(useTimerStore.getState().secondsLeft).toBe(1500)
    })

    it('starts paused', () => {
      expect(useTimerStore.getState().isRunning).toBe(false)
    })

    it('starts with 0 sessions', () => {
      expect(useTimerStore.getState().sessionCount).toBe(0)
    })
  })

  describe('setMode', () => {
    it('switches to shortBreak', () => {
      useTimerStore.getState().setMode('shortBreak')
      expect(useTimerStore.getState().mode).toBe('shortBreak')
    })

    it('switches to longBreak', () => {
      useTimerStore.getState().setMode('longBreak')
      expect(useTimerStore.getState().mode).toBe('longBreak')
    })

    it('switches back to pomodoro', () => {
      useTimerStore.getState().setMode('shortBreak')
      useTimerStore.getState().setMode('pomodoro')
      expect(useTimerStore.getState().mode).toBe('pomodoro')
    })
  })

  describe('setSecondsLeft', () => {
    it('sets the seconds value', () => {
      useTimerStore.getState().setSecondsLeft(300)
      expect(useTimerStore.getState().secondsLeft).toBe(300)
    })

    it('can be set to 0', () => {
      useTimerStore.getState().setSecondsLeft(0)
      expect(useTimerStore.getState().secondsLeft).toBe(0)
    })
  })

  describe('setIsRunning', () => {
    it('starts the timer', () => {
      useTimerStore.getState().setIsRunning(true)
      expect(useTimerStore.getState().isRunning).toBe(true)
    })

    it('pauses the timer', () => {
      useTimerStore.getState().setIsRunning(true)
      useTimerStore.getState().setIsRunning(false)
      expect(useTimerStore.getState().isRunning).toBe(false)
    })
  })

  describe('tick', () => {
    it('decrements secondsLeft by 1', () => {
      useTimerStore.setState({ secondsLeft: 10 })
      useTimerStore.getState().tick()
      expect(useTimerStore.getState().secondsLeft).toBe(9)
    })

    it('does not go below 0', () => {
      useTimerStore.setState({ secondsLeft: 0 })
      useTimerStore.getState().tick()
      expect(useTimerStore.getState().secondsLeft).toBe(0)
    })

    it('stops at 0 when called multiple times', () => {
      useTimerStore.setState({ secondsLeft: 1 })
      useTimerStore.getState().tick()
      useTimerStore.getState().tick()
      expect(useTimerStore.getState().secondsLeft).toBe(0)
    })
  })

  describe('incrementSessionCount', () => {
    it('increments by 1', () => {
      useTimerStore.getState().incrementSessionCount()
      expect(useTimerStore.getState().sessionCount).toBe(1)
    })

    it('increments multiple times', () => {
      useTimerStore.getState().incrementSessionCount()
      useTimerStore.getState().incrementSessionCount()
      useTimerStore.getState().incrementSessionCount()
      expect(useTimerStore.getState().sessionCount).toBe(3)
    })
  })

  describe('resetSession', () => {
    it('resets session count to 0', () => {
      useTimerStore.getState().incrementSessionCount()
      useTimerStore.getState().incrementSessionCount()
      useTimerStore.getState().resetSession()
      expect(useTimerStore.getState().sessionCount).toBe(0)
    })

    it('stops the timer', () => {
      useTimerStore.getState().setIsRunning(true)
      useTimerStore.getState().resetSession()
      expect(useTimerStore.getState().isRunning).toBe(false)
    })
  })
})
