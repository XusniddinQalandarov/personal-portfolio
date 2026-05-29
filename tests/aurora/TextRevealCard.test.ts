import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextRevealCard from '~/components/aurora/surface/TextRevealCard.vue'
describe('TextRevealCard', () => {
  it('renders', () => {
    const w = mount(TextRevealCard, { props: { text: 'A', revealText: 'B' } })
    expect(w.find('.trc').exists()).toBe(true)
  })
})
