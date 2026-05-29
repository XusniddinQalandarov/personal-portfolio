import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraText from '~/components/aurora/type/AuroraText.vue'

describe('AuroraText', () => {
  it('renders slot text inside a span with class', () => {
    const w = mount(AuroraText, { slots: { default: 'qalandarov' } })
    expect(w.find('.aurora-text').text()).toBe('qalandarov')
  })
})
