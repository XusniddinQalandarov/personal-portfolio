import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraCursor from '~/components/aurora/cursor/AuroraCursor.vue'

describe('AuroraCursor', () => {
  it('renders the cursor dot and label nodes', () => {
    const w = mount(AuroraCursor)
    expect(w.find('.smooth-cursor').exists()).toBe(true)
    expect(w.find('.cursor-label').exists()).toBe(true)
  })
})
