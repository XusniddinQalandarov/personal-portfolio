import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShineBorder from '~/components/aurora/surface/ShineBorder.vue'
describe('ShineBorder', () => {
  it('renders', () => {
    const w = mount(ShineBorder)
    expect(w.find('.shine-border').exists()).toBe(true)
  })
})
