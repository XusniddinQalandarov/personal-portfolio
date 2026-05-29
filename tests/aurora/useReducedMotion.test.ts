import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useReducedMotion } from '~/composables/useReducedMotion'

describe('useReducedMotion', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((q: string) => ({
        matches: q.includes('reduce'),
        media: q,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })
  })

  it('returns true when prefers-reduced-motion matches', () => {
    const { prefersReduced } = useReducedMotion()
    expect(prefersReduced.value).toBe(true)
  })
})
