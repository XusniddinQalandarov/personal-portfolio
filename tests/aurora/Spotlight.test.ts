import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Spotlight from '~/components/aurora/surface/Spotlight.vue'
describe('Spotlight', () => {
  it('renders spotlight svg', () => {
    const w = mount(Spotlight)
    expect(w.find('.spotlight').exists()).toBe(true)
  })
})
