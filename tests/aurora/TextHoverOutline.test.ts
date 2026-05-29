import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextHoverOutline from '~/components/aurora/type/TextHoverOutline.vue'

describe('TextHoverOutline', () => {
  it('renders both stroked and fill copies of the text', () => {
    const w = mount(TextHoverOutline, { props: { text: 'XQ' } })
    expect(w.findAll('.outline').length).toBe(1)
    expect(w.findAll('.fill').length).toBe(1)
    expect(w.text()).toContain('XQ')
  })
})
