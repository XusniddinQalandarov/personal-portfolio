import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AnimatedTooltip from '~/components/aurora/surface/AnimatedTooltip.vue'
describe('AnimatedTooltip', () => {
  it('renders avatars', () => {
    const w = mount(AnimatedTooltip, { props: { items: [{ id: 1, name: 'A', designation: 'B', image: 'x.png' }] } })
    expect(w.findAll('.tt-avatar').length).toBe(1)
  })
})
