<!-- Port of aceternity/background-beams — 25 sweeping SVG bezier beams.
     Grads are animated via direct DOM setAttribute to avoid Vue reactivity overhead
     (60fps × 25 items × 4 attrs would otherwise cause ~6000 reactive triggers/sec). -->
<template>
  <div class="bg-beams" aria-hidden="true">
    <svg
      class="bg-beams-svg"
      width="100%" height="100%"
      viewBox="0 0 696 316"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        v-for="(d, i) in paths"
        :key="i"
        :d="d"
        :stroke="`url(#bgb-${i})`"
        stroke-opacity="0.4"
        stroke-width="0.6"
      />
      <defs>
        <linearGradient
          v-for="(_, i) in paths"
          :key="i"
          :id="`bgb-${i}`"
          :ref="(el) => { if (el) gradEls[i] = el as any }"
          gradientUnits="userSpaceOnUse"
          x1="0%" x2="0%" y1="0%" y2="0%"
        >
          <stop offset="0%" stop-color="var(--cyan)" stop-opacity="0" />
          <stop offset="30%" stop-color="var(--cyan)" />
          <stop offset="60%" stop-color="var(--indigo)" />
          <stop offset="100%" stop-color="var(--magenta)" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const paths: string[] = []
for (let n = 0; n < 25; n++) {
  const off = n * 8
  paths.push(`M${-380 + off} ${-189 - off}C${-380 + off} ${-189 - off} ${-312 + off} ${216 - off} ${152 + off} ${343 - off}C${616 + off} ${470 - off} ${684 + off} ${875 - off} ${684 + off} ${875 - off}`)
}

interface Grad { x1: number; x2: number; y1: number; y2: number; phase: number; speed: number }

// Plain non-reactive array — mutations won't trigger Vue re-renders
const gradsRaw: Grad[] = paths.map(() => ({
  x1: 0, x2: 0, y1: 0, y2: 0,
  phase: Math.random() * Math.PI * 2,
  speed: 0.0005 + Math.random() * 0.0008,
}))

// Plain array for SVG element refs — not reactive, only used for imperative DOM writes
const gradEls: any[] = []

let rafId = 0

function frame(t: number) {
  for (let i = 0; i < gradsRaw.length; i++) {
    const g = gradsRaw[i]
    const p = (Math.sin(t * g.speed + g.phase) + 1) / 2
    g.x1 = p * 100
    g.x2 = 95 * p
    g.y1 = p * 100
    g.y2 = (93 + Math.sin(t * g.speed * 1.3 + g.phase) * 4 + 97) * p * 0.5
    const el = gradEls[i]
    if (el) {
      el.setAttribute('x1', `${g.x1}%`)
      el.setAttribute('x2', `${g.x2}%`)
      el.setAttribute('y1', `${g.y1}%`)
      el.setAttribute('y2', `${g.y2}%`)
    }
  }
  rafId = requestAnimationFrame(frame)
}

onMounted(() => {
  if (typeof window === 'undefined') return
  rafId = requestAnimationFrame(frame)
})
onBeforeUnmount(() => cancelAnimationFrame(rafId))
</script>

<style scoped>
.bg-beams {
  position: absolute; inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.bg-beams-svg {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
}
@media (prefers-reduced-motion: reduce) { .bg-beams { display: none; } }
</style>
