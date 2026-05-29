import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BorderBeam from '~/components/aurora/surface/BorderBeam.vue'
describe('BorderBeam', () => {
  it('renders', () => {
    const w = mount(BorderBeam)
    expect(w.find('.border-beam').exists()).toBe(true)
  })
})
