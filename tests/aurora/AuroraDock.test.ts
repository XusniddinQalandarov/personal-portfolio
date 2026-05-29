import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraDock from '~/components/aurora/layout/AuroraDock.vue'

const stubs = {
  NuxtLink: { template: '<a><slot /></a>' },
  i18n: true,
}

describe('AuroraDock', () => {
  it('renders 7 route items', () => {
    const w = mount(AuroraDock, {
      global: {
        stubs,
        mocks: { $t: (k: string) => k, $route: { path: '/' } },
      },
    })
    expect(w.findAll('.dock-item').length).toBe(7)
  })
})
