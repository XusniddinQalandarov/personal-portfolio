<!-- Port of magicui/glare-hover — diagonal glare that follows pointer, CSS-only approach -->
<template>
  <div
    ref="el"
    class="glare-hover"
    :style="cssVars"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  color?: string
  opacity?: number
  angle?: number
  size?: number
  duration?: number
  background?: string
}>(), {
  color: '#ffffff',
  opacity: 0.12,
  angle: -45,
  size: 250,
  duration: 400,
  background: 'transparent',
})

const el = ref<HTMLElement | null>(null)
const glareX = ref(50)
const glareY = ref(50)
const hovered = ref(false)

function onMove(e: PointerEvent) {
  if (!el.value) return
  const { left, top, width, height } = el.value.getBoundingClientRect()
  glareX.value = ((e.clientX - left) / width) * 100
  glareY.value = ((e.clientY - top) / height) * 100
  hovered.value = true
}

function onLeave() {
  hovered.value = false
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const cssVars = computed(() => ({
  '--gh-x': `${glareX.value}%`,
  '--gh-y': `${glareY.value}%`,
  '--gh-color': hexToRgba(props.color, props.opacity),
  '--gh-size': `${props.size}%`,
  '--gh-angle': `${props.angle}deg`,
  '--gh-duration': `${props.duration}ms`,
  '--gh-opacity': hovered.value ? '1' : '0',
  background: props.background,
}))
</script>

<style scoped>
.glare-hover {
  position: relative;
  overflow: hidden;
}
.glare-hover::before {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: linear-gradient(
    var(--gh-angle, -45deg),
    transparent 0%,
    var(--gh-color, rgba(255,255,255,0.1)) 50%,
    transparent 100%
  );
  background-size: var(--gh-size, 250%) var(--gh-size, 250%);
  background-position: var(--gh-x, 50%) var(--gh-y, 50%);
  opacity: var(--gh-opacity, 0);
  transition:
    opacity var(--gh-duration, 400ms) ease,
    background-position var(--gh-duration, 400ms) ease;
  z-index: 10;
  border-radius: inherit;
}
@media (prefers-reduced-motion: reduce) {
  .glare-hover::before { transition: none; }
}
</style>
