// composables/useAuroraCursor.ts
import { ref, onMounted, onBeforeUnmount } from 'vue'

type CursorState = 'idle' | 'link' | 'card'

export function useAuroraCursor() {
  const x = ref(0)
  const y = ref(0)
  const cx = ref(0)
  const cy = ref(0)
  const angle = ref(0)
  const stretch = ref(0)
  const state = ref<CursorState>('idle')
  const label = ref('')

  let vx = 0, vy = 0
  let rafId = 0

  const onMove = (e: PointerEvent) => {
    x.value = e.clientX
    y.value = e.clientY
  }

  const onOver = (e: Event) => {
    const t = (e.target as HTMLElement | null)?.closest('[data-cursor-label], [data-cursor-state]')
    if (!t) return
    const s = t.getAttribute('data-cursor-state') as CursorState | null
    if (s) state.value = s
    else if (t.matches('[data-cursor-card]')) state.value = 'card'
    else state.value = 'link'
    label.value = t.getAttribute('data-cursor-label') ?? ''
  }

  const onOut = (e: Event) => {
    const t = (e.target as HTMLElement | null)?.closest('[data-cursor-label], [data-cursor-state]')
    if (!t) return
    state.value = 'idle'
    label.value = ''
  }

  function tick() {
    const stiffness = 0.18, damping = 0.72
    vx = vx * damping + (x.value - cx.value) * stiffness
    vy = vy * damping + (y.value - cy.value) * stiffness
    cx.value += vx
    cy.value += vy
    const speed = Math.hypot(vx, vy)
    angle.value = Math.atan2(vy, vx) * 180 / Math.PI
    stretch.value = Math.min(speed * 0.04, 0.6)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aurora-cursor-move', {
        detail: { x: cx.value, y: cy.value },
      }))
    }
    rafId = requestAnimationFrame(tick)
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    if (!matchMedia('(hover: hover)').matches) return
    x.value = cx.value = innerWidth / 2
    y.value = cy.value = innerHeight / 2
    addEventListener('pointermove', onMove)
    document.addEventListener('pointerover', onOver, true)
    document.addEventListener('pointerout', onOut, true)
    rafId = requestAnimationFrame(tick)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
    if (typeof window === 'undefined') return
    removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerover', onOver, true)
    document.removeEventListener('pointerout', onOut, true)
  })

  return { x: cx, y: cy, angle, stretch, state, label }
}
