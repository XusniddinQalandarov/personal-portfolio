import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Marquee from '~/components/aurora/layout/Marquee.vue'
describe('Marquee', () => {
  it('renders', () => {
    const w = mount(Marquee, { slots: { default: '<span>item</span>' } })
    expect(w.find('.marquee').exists()).toBe(true)
  })
})
