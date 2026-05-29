import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NumberTicker from '~/components/aurora/type/NumberTicker.vue'
describe('NumberTicker', () => {
  it('renders', () => {
    const w = mount(NumberTicker, { props: { value: 100 } })
    expect(w.find('.number-ticker').exists()).toBe(true)
  })
})
