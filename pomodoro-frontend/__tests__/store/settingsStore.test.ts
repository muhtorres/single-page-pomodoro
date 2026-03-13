import { useSettingsStore } from '@/store/settingsStore'
import { DEFAULT_SETTINGS } from '@/types'

beforeEach(() => {
  useSettingsStore.setState({ settings: { ...DEFAULT_SETTINGS } })
})

describe('settingsStore', () => {
  describe('initial state', () => {
    it('initializes with default settings', () => {
      expect(useSettingsStore.getState().settings).toEqual(DEFAULT_SETTINGS)
    })

    it('has correct default pomodoro duration', () => {
      expect(useSettingsStore.getState().settings.pomodoroDuration).toBe(25)
    })

    it('has correct default short break duration', () => {
      expect(useSettingsStore.getState().settings.shortBreakDuration).toBe(5)
    })

    it('has correct default long break duration', () => {
      expect(useSettingsStore.getState().settings.longBreakDuration).toBe(15)
    })

    it('has sound enabled by default', () => {
      expect(useSettingsStore.getState().settings.soundEnabled).toBe(true)
    })

    it('has auto-start breaks enabled by default', () => {
      expect(useSettingsStore.getState().settings.autoStartBreaks).toBe(true)
    })

    it('has auto-start pomodoros disabled by default', () => {
      expect(useSettingsStore.getState().settings.autoStartPomodoros).toBe(false)
    })
  })

  describe('updateSettings', () => {
    it('updates a single field', () => {
      useSettingsStore.getState().updateSettings({ pomodoroDuration: 30 })
      expect(useSettingsStore.getState().settings.pomodoroDuration).toBe(30)
    })

    it('does not affect other fields when updating one', () => {
      useSettingsStore.getState().updateSettings({ pomodoroDuration: 30 })
      expect(useSettingsStore.getState().settings.shortBreakDuration).toBe(DEFAULT_SETTINGS.shortBreakDuration)
      expect(useSettingsStore.getState().settings.longBreakDuration).toBe(DEFAULT_SETTINGS.longBreakDuration)
    })

    it('updates multiple fields at once', () => {
      useSettingsStore.getState().updateSettings({
        pomodoroDuration: 30,
        shortBreakDuration: 10,
        soundEnabled: false,
      })
      const { settings } = useSettingsStore.getState()
      expect(settings.pomodoroDuration).toBe(30)
      expect(settings.shortBreakDuration).toBe(10)
      expect(settings.soundEnabled).toBe(false)
    })

    it('toggles sound', () => {
      useSettingsStore.getState().updateSettings({ soundEnabled: false })
      expect(useSettingsStore.getState().settings.soundEnabled).toBe(false)
      useSettingsStore.getState().updateSettings({ soundEnabled: true })
      expect(useSettingsStore.getState().settings.soundEnabled).toBe(true)
    })

    it('updates volume', () => {
      useSettingsStore.getState().updateSettings({ volume: 0.8 })
      expect(useSettingsStore.getState().settings.volume).toBe(0.8)
    })

    it('updates longBreakInterval', () => {
      useSettingsStore.getState().updateSettings({ longBreakInterval: 6 })
      expect(useSettingsStore.getState().settings.longBreakInterval).toBe(6)
    })
  })

  describe('resetSettings', () => {
    it('restores all settings to defaults', () => {
      useSettingsStore.getState().updateSettings({
        pomodoroDuration: 45,
        soundEnabled: false,
        autoStartBreaks: false,
        volume: 0.1,
      })
      useSettingsStore.getState().resetSettings()
      expect(useSettingsStore.getState().settings).toEqual(DEFAULT_SETTINGS)
    })

    it('restores pomodoro duration', () => {
      useSettingsStore.getState().updateSettings({ pomodoroDuration: 45 })
      useSettingsStore.getState().resetSettings()
      expect(useSettingsStore.getState().settings.pomodoroDuration).toBe(DEFAULT_SETTINGS.pomodoroDuration)
    })
  })
})
