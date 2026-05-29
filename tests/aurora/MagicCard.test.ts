import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MagicCard from '~/components/aurora/surface/MagicCard.vue'
describe('MagicCard', () => {
  it('renders', () => {
    const w = mount(MagicCard, { slots: { default: 'hi' } })
    expect(w.find('.magic-card').exists()).toBe(true)
    expect(w.text()).toContain('hi')
  })
})
