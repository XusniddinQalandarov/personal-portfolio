// tests/aurora/useAuroraTheme.test.ts
import { describe, it, expect } from 'vitest'
import { ROUTE_ACCENTS, getAccentForPath } from '~/composables/useAuroraTheme'

describe('useAuroraTheme', () => {
  it('exposes 7 route accents', () => {
    expect(Object.keys(ROUTE_ACCENTS)).toHaveLength(7)
  })
  it('returns the default (home) accent for unknown routes', () => {
    const a = getAccentForPath('/nope')
    expect(a).toEqual(ROUTE_ACCENTS['/'])
  })
  it('returns the correct accent for /projects', () => {
    const a = getAccentForPath('/projects')
    expect(a.primary).toBe('var(--magenta)')
  })
})
