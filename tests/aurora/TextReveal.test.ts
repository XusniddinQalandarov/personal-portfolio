import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextReveal from '~/components/aurora/type/TextReveal.vue'
describe('TextReveal', () => {
  it('renders', () => {
    const w = mount(TextReveal, { props: { text: 'one two three' } })
    expect(w.find('.text-reveal-section').exists()).toBe(true)
  })
})
