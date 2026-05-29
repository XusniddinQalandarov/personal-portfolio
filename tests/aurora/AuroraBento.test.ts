import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraBento from '~/components/aurora/surface/AuroraBento.vue'
describe('AuroraBento', () => {
  it('renders with tile slot', () => {
    const w = mount(AuroraBento, { slots: { default: '<div class="tile">x</div>' } })
    expect(w.find('.bento').exists()).toBe(true)
    expect(w.find('.tile').exists()).toBe(true)
  })
})
