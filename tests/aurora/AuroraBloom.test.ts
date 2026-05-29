import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraBloom from '~/components/aurora/backdrop/AuroraBloom.vue'

describe('AuroraBloom', () => {
  it('renders two bloom elements', () => {
    const w = mount(AuroraBloom)
    expect(w.findAll('.bloom').length).toBe(2)
  })
})
