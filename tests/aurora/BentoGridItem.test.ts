import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BentoGridItem from '~/components/aurora/surface/BentoGridItem.vue'
describe('BentoGridItem', () => {
  it('renders', () => {
    const w = mount(BentoGridItem, { props: { title: 'Test', description: 'Desc' } })
    expect(w.find('.bento-tile').exists()).toBe(true)
  })
})
