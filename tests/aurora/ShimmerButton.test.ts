import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShimmerButton from '~/components/aurora/primitives/ShimmerButton.vue'
describe('ShimmerButton', () => {
  it('renders shimmer-btn with default slot', () => {
    const w = mount(ShimmerButton, {
      slots: { default: 'Click me' },
    })
    expect(w.find('.shimmer-btn').exists()).toBe(true)
  })
})
