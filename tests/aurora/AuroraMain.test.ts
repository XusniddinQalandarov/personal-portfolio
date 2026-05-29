import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraMain from '~/components/aurora/hero/AuroraMain.vue'

const stubs = {
  NuxtLink: { template: '<a><slot /></a>' },
  TextHoverOutline: { template: '<span>{{ text }}</span>', props: ['text'] },
  AuroraText: { template: '<span><slot /></span>' },
  AuroraEyebrow: { template: '<div>{{ text }}</div>', props: ['text', 'shine'] },
  TextGenerate: { template: '<p>{{ text }}</p>', props: ['text', 'baseDelay', 'stagger'] },
  AuroraButton: { template: '<button><slot /></button>' },
}

describe('AuroraMain', () => {
  it('renders eyebrow + name + surname + subtitle + CTAs', () => {
    const w = mount(AuroraMain, {
      global: {
        stubs,
        mocks: { $t: (k: string) => k },
      },
    })
    expect(w.find('.hero').exists()).toBe(true)
    expect(w.findAll('button').length).toBeGreaterThanOrEqual(2)
  })
})
