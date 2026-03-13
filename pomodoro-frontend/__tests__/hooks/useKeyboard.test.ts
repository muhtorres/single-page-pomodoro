import { renderHook } from '@testing-library/react'
import { useKeyboard } from '@/hooks/useKeyboard'

describe('useKeyboard', () => {
  it('calls the handler for a registered key', () => {
    const handler = jest.fn()
    renderHook(() => useKeyboard({ a: handler }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not call the handler for unregistered keys', () => {
    const handler = jest.fn()
    renderHook(() => useKeyboard({ a: handler }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true }))
    expect(handler).not.toHaveBeenCalled()
  })

  it('handles ctrl+ combinations', () => {
    const handler = jest.fn()
    renderHook(() => useKeyboard({ 'ctrl+,': handler }))
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: ',', ctrlKey: true, bubbles: true })
    )
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('handles space key', () => {
    const handler = jest.fn()
    renderHook(() => useKeyboard({ ' ': handler }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not fire when target is an input', () => {
    const handler = jest.fn()
    renderHook(() => useKeyboard({ a: handler }))
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }))
    document.body.removeChild(input)
    expect(handler).not.toHaveBeenCalled()
  })

  it('cleans up event listener on unmount', () => {
    const handler = jest.fn()
    const { unmount } = renderHook(() => useKeyboard({ a: handler }))
    unmount()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }))
    expect(handler).not.toHaveBeenCalled()
  })
})
