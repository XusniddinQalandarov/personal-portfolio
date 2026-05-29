import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraTimeline from '~/components/aurora/layout/AuroraTimeline.vue'
describe('AuroraTimeline', () => {
  it('renders', () => {
    const w = mount(AuroraTimeline, { slots: { default: '<div class="timeline-item">x</div>' } })
    expect(w.find('.timeline').exists()).toBe(true)
  })
})
