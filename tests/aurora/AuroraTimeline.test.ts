import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraTimeline from '~/components/aurora/layout/AuroraTimeline.vue'
describe('AuroraTimeline', () => {
  it('renders', () => {
    const w = mount(AuroraTimeline, {
      props: { data: [{ title: 'A', slot: 'a' }] },
      slots: { a: '<div class="entry-content">x</div>' }
    })
    expect(w.find('.aurora-timeline').exists()).toBe(true)
  })
})
