import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShinyText from '~/components/aurora/type/ShinyText.vue'

describe('ShinyText', () => {
  it('renders slot content with the shimmer class', () => {
    const w = mount(ShinyText, { slots: { default: 'shimmer' } })
    expect(w.find('.shiny-text').text()).toBe('shimmer')
  })
})
