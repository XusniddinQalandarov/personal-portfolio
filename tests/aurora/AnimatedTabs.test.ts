import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AnimatedTabs from '~/components/aurora/layout/AnimatedTabs.vue'
describe('AnimatedTabs', () => {
  it('renders', () => {
    const w = mount(AnimatedTabs, { props: { tabs: [{ title: 'A', value: 'a' }] } })
    expect(w.find('.animated-tabs').exists()).toBe(true)
  })
})
