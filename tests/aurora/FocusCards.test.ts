import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FocusCards from '~/components/aurora/surface/FocusCards.vue'
describe('FocusCards', () => {
  it('renders', () => {
    const w = mount(FocusCards, { slots: { default: '<div class="child">content</div>' } })
    expect(w.find('.focus-cards').exists()).toBe(true)
  })
})
