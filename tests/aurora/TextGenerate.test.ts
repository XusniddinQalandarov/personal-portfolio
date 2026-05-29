import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextGenerate from '~/components/aurora/type/TextGenerate.vue'

describe('TextGenerate', () => {
  it('splits text into one .word span per word', () => {
    const w = mount(TextGenerate, { props: { text: 'one two three' } })
    expect(w.findAll('.word').length).toBe(3)
  })
})
