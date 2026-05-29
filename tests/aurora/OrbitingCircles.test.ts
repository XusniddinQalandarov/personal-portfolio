import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrbitingCircles from '~/components/aurora/surface/OrbitingCircles.vue'
describe('OrbitingCircles', () => {
  it('renders orbit-stage with a single child slot', () => {
    const w = mount(OrbitingCircles, {
      slots: { default: '<span class="test-child">dot</span>' },
    })
    expect(w.find('.orbit-stage').exists()).toBe(true)
  })
})
