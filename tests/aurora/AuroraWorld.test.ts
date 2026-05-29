import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraWorld from '~/components/aurora/backdrop/AuroraWorld.vue'

describe('AuroraWorld', () => {
  it('renders all three backdrop layers', () => {
    const w = mount(AuroraWorld)
    expect(w.find('[data-aurora="grid"]').exists()).toBe(true)
    expect(w.find('[data-aurora="flicker"]').exists()).toBe(true)
    expect(w.find('[data-aurora="blooms"]').exists()).toBe(true)
  })
})
