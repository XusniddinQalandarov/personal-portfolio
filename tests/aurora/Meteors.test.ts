import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Meteors from '~/components/aurora/surface/Meteors.vue'
describe('Meteors', () => {
  it('renders meteor-field', () => {
    const w = mount(Meteors)
    expect(w.find('.meteor-field').exists()).toBe(true)
  })
})
