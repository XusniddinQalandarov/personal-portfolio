import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraEyebrow from '~/components/aurora/type/AuroraEyebrow.vue'

describe('AuroraEyebrow', () => {
  it('renders the label text', () => {
    const w = mount(AuroraEyebrow, { props: { text: 'Hello' } })
    expect(w.text()).toContain('Hello')
  })
})
