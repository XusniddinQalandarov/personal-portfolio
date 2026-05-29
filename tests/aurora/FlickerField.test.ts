import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FlickerField from '~/components/aurora/backdrop/FlickerField.vue'

describe('FlickerField', () => {
  it('mounts a canvas element', () => {
    const w = mount(FlickerField)
    expect(w.find('canvas').exists()).toBe(true)
  })
})
