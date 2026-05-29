import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import AnimatedList from '~/components/aurora/surface/AnimatedList.vue'
describe('AnimatedList', () => {
  it('renders', () => {
    const w = mount(AnimatedList, { slots: { default: () => h('div', { key: 1 }, 'A') } })
    expect(w.find('.animated-list').exists()).toBe(true)
  })
})
