import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InteractiveHoverButton from '~/components/aurora/primitives/InteractiveHoverButton.vue'
describe('InteractiveHoverButton', () => {
  it('renders ihb button', () => {
    const w = mount(InteractiveHoverButton, {
      slots: { default: 'View' },
    })
    expect(w.find('.ihb').exists()).toBe(true)
  })
})
