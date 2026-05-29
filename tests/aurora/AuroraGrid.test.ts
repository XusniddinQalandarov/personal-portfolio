import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraGrid from '~/components/aurora/backdrop/AuroraGrid.vue'

describe('AuroraGrid', () => {
  it('mounts and renders the fixed grid container', () => {
    const w = mount(AuroraGrid)
    expect(w.find('[data-aurora="grid"]').exists()).toBe(true)
  })
})
