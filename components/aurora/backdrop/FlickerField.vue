<template>
  <canvas ref="canvasEl" data-aurora="flicker" class="aurora-flicker" aria-hidden="true" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useReducedMotion } from '~/composables/useReducedMotion'

const canvasEl = ref<HTMLCanvasElement | null>(null)
const { prefersReduced } = useReducedMotion()

let rafId = 0
let cells: { x: number; y: number; a: number; target: number; next: number }[] = []
let cw = 0, ch = 0
const cellSize = 28
let lastT = 0

// Cursor position consumed via global custom event from AuroraCursor.
const cursor = { x: 0, y: 0 }
const onCursor = (e: Event) => {
  const d = (e as CustomEvent<{ x: number; y: number }>).detail
  cursor.x = d.x; cursor.y = d.y
}

function resize() {
  if (!canvasEl.value) return
  cw = canvasEl.value.width = window.innerWidth
  ch = canvasEl.value.height = window.innerHeight
  const cols = Math.ceil(cw / cellSize)
  const rows = Math.ceil(ch / cellSize)
  cells = []
  for (let i = 0; i < cols * rows; i++) {
    cells.push({
      x: (i % cols) * cellSize,
      y: Math.floor(i / cols) * cellSize,
      a: Math.random() * 0.04,
      target: Math.random() * 0.04,
      next: Math.random() * 2000 + 500,
    })
  }
}

function frame(t: number) {
  const ctx = canvasEl.value?.getContext('2d')
  if (!ctx) return
  const dt = t - lastT; lastT = t
  ctx.clearRect(0, 0, cw, ch)
  for (const c of cells) {
    c.next -= dt
    if (c.next <= 0) {
      c.target = Math.random() < 0.7 ? Math.random() * 0.04 : Math.random() * 0.15
      c.next = Math.random() * 1500 + 400
    }
    c.a += (c.target - c.a) * 0.05
    const dx = (c.x + cellSize / 2) - cursor.x
    const dy = (c.y + cellSize / 2) - cursor.y
    const dist = Math.hypot(dx, dy)
    const prox = Math.max(0, 1 - dist / 200)
    const a = c.a + prox * 0.3
    ctx.fillStyle = `rgba(232,230,239,${a})`
    ctx.fillRect(c.x + 1, c.y + 1, cellSize - 2, cellSize - 2)
    if (prox > 0.6) {
      ctx.fillStyle = `rgba(212,165,116,${(prox - 0.6) * 0.4})`
      ctx.fillRect(c.x + 1, c.y + 1, cellSize - 2, cellSize - 2)
    }
  }
  rafId = requestAnimationFrame(frame)
}

onMounted(() => {
  if (typeof window === 'undefined') return
  // Below-640 perf budget per spec §11.1.
  if (window.innerWidth < 640) return
  if (prefersReduced.value) return
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('aurora-cursor-move', onCursor as EventListener)
  rafId = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  if (typeof window === 'undefined') return
  window.removeEventListener('resize', resize)
  window.removeEventListener('aurora-cursor-move', onCursor as EventListener)
})
</script>

<style scoped>
.aurora-flicker {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
</style>
