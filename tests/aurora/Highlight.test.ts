import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Highlight from '~/components/aurora/type/Highlight.vue'
describe('Highlight', () => {
  it('renders', () => {
    const w = mount(Highlight, { slots: { default: 'highlighted text' } })
    expect(w.find('.highlight').exists()).toBe(true)
  })
})
