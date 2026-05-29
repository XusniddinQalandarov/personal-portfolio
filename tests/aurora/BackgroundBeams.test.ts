import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BackgroundBeams from '~/components/aurora/surface/BackgroundBeams.vue'
describe('BackgroundBeams', () => {
  it('renders bg-beams', () => {
    const w = mount(BackgroundBeams)
    expect(w.find('.bg-beams').exists()).toBe(true)
  })
})
