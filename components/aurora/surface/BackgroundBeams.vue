<!-- Port of aceternity/background-beams — 51 sweeping SVG bezier beams -->
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
          v-for="(d, i) in paths"
          :key="i"
          :id="`bgb-${i}`"
          gradientUnits="userSpaceOnUse"
          :x1="`${grads[i].x1}%`"
          :x2="`${grads[i].x2}%`"
          :y1="`${grads[i].y1}%`"
          :y2="`${grads[i].y2}%`"
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
// 25 distinct curves cycling through the same family the source provides.
const paths: string[] = []
for (let n = 0; n < 25; n++) {
  const off = n * 8
  paths.push(`M${-380 + off} ${-189 - off}C${-380 + off} ${-189 - off} ${-312 + off} ${216 - off} ${152 + off} ${343 - off}C${616 + off} ${470 - off} ${684 + off} ${875 - off} ${684 + off} ${875 - off}`)
}
interface Grad { x1: number; x2: number; y1: number; y2: number; phase: number; speed: number }
const grads = ref<Grad[]>(paths.map(() => ({
  x1: 0, x2: 0, y1: 0, y2: 0,
  phase: Math.random() * Math.PI * 2,
  speed: 0.0005 + Math.random() * 0.0008,
})))
let rafId = 0
function frame(t: number) {
  grads.value.forEach((g) => {
    const p = (Math.sin(t * g.speed + g.phase) + 1) / 2 // 0..1
    g.x1 = p * 100
    g.x2 = 95 * p
    g.y1 = p * 100
    g.y2 = (93 + Math.random() * 8) * p
  })
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
