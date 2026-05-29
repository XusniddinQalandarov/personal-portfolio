import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import AnimatedBeam from '~/components/aurora/surface/AnimatedBeam.vue'
describe('AnimatedBeam', () => {
  it('mounts', () => {
    const r = ref(null)
    const w = mount(AnimatedBeam, { props: { containerRef: r, fromRef: r, toRef: r } })
    expect(w.find('svg.animated-beam').exists()).toBe(true)
  })
})
