import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HyperText from '~/components/aurora/type/HyperText.vue'
describe('HyperText', () => {
  it('renders', () => {
    const w = mount(HyperText, { props: { text: 'HELLO' } })
    expect(w.find('.hyper-text').exists()).toBe(true)
  })
})
