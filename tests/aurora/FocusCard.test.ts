import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FocusCard from '~/components/aurora/surface/FocusCard.vue'
describe('FocusCard', () => {
  it('renders', () => {
    const w = mount(FocusCard, { props: { index: 0 }, slots: { default: '<span>card</span>' } })
    expect(w.find('.focus-card').exists()).toBe(true)
  })
})
