import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraPageHero from '~/components/aurora/layout/AuroraPageHero.vue'
describe('AuroraPageHero', () => {
  it('renders', () => {
    const w = mount(AuroraPageHero, { props: { eyebrow: 'EB', title: 'TITLE' } })
    expect(w.find('.page-hero').exists()).toBe(true)
    expect(w.text()).toContain('TITLE')
  })
})
