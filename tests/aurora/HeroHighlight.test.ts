import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroHighlight from '~/components/aurora/surface/HeroHighlight.vue'
describe('HeroHighlight', () => {
  it('renders', () => {
    const w = mount(HeroHighlight, { slots: { default: '<p>content</p>' } })
    expect(w.find('.hero-highlight').exists()).toBe(true)
  })
})
