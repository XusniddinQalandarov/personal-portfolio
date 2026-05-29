import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TypewriterEffect from '~/components/aurora/type/TypewriterEffect.vue'
describe('TypewriterEffect', () => {
  it('renders', () => {
    const w = mount(TypewriterEffect, { props: { text: 'hi' } })
    expect(w.find('.typewriter').exists()).toBe(true)
  })
})
