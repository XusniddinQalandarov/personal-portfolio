import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraButton from '~/components/aurora/primitives/AuroraButton.vue'

describe('AuroraButton', () => {
  it('renders slot content', () => {
    const w = mount(AuroraButton, { slots: { default: 'Click' } })
    expect(w.text()).toContain('Click')
  })
  it('applies ghost class when variant=ghost', () => {
    const w = mount(AuroraButton, { props: { variant: 'ghost' } })
    expect(w.classes()).toContain('btn-ghost')
  })
})
