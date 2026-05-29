<!-- components/aurora/type/TextHoverOutline.vue
     Port of aceternity/text-hover-effect.
     Outlined name. Hover reveals gradient fill from cursor position via clip-path. -->
<template>
  <span
    ref="root"
    class="outline"
    data-cursor-label="Hover"
    @pointermove="onMove"
  >
    {{ text }}
    <span class="fill" aria-hidden="true">{{ text }}</span>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ text: string }>()
const root = ref<HTMLSpanElement | null>(null)
function onMove(e: PointerEvent) {
  if (!root.value) return
  const r = root.value.getBoundingClientRect()
  root.value.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
  root.value.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
}
</script>

<style scoped>
.outline {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 900;
  font-size: clamp(34px, 11vw, 200px);
  line-height: 0.88;
  letter-spacing: -0.06em;
  text-transform: uppercase;
  max-width: 100%;
  overflow-wrap: break-word;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.7);
  position: relative;
  display: inline-block;
  cursor: none;
}
.fill {
  position: absolute; inset: 0;
  -webkit-text-stroke: 0;
  background: linear-gradient(120deg, var(--accent-primary) 0%, var(--accent-secondary) 40%, var(--accent-tertiary) 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  clip-path: circle(0% at var(--mx, 50%) var(--my, 50%));
  transition: clip-path 0.6s var(--ease-cinematic);
}
.outline:hover .fill { clip-path: circle(72% at var(--mx, 50%) var(--my, 50%)); }
@media (prefers-reduced-motion: reduce) {
  .fill { transition: none; }
}
</style>
