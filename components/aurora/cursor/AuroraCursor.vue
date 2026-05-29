<!-- components/aurora/cursor/AuroraCursor.vue -->
<template>
  <div
    class="smooth-cursor"
    :class="stateClass"
    :style="cursorStyle"
    aria-hidden="true"
  />
  <div
    class="cursor-label"
    :class="{ visible: !!label }"
    :style="labelStyle"
    aria-hidden="true"
  >
    {{ label }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuroraCursor } from '~/composables/useAuroraCursor'

const { x, y, angle, stretch, state, label } = useAuroraCursor()

const cursorStyle = computed(() => ({
  transform:
    `translate(${x.value}px, ${y.value}px) translate(-50%, -50%) ` +
    `rotate(${angle.value}deg) ` +
    `scaleX(${1 + stretch.value}) scaleY(${1 - stretch.value * 0.5})`,
}))
const labelStyle = computed(() => ({
  transform: `translate(${x.value + 24}px, ${y.value + 24}px)`,
}))
const stateClass = computed(() => ({
  'hover-link': state.value === 'link',
  'hover-card': state.value === 'card',
}))
</script>

<style scoped>
.smooth-cursor {
  position: fixed; top: 0; left: 0;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--text);
  pointer-events: none;
  z-index: 1000;
  transform: translate(-50%, -50%);
  transition:
    width 0.3s var(--ease-cinematic),
    height 0.3s var(--ease-cinematic),
    background 0.3s var(--ease-cinematic),
    border-radius 0.3s var(--ease-cinematic);
  will-change: transform;
  mix-blend-mode: difference;
}
.smooth-cursor::before {
  content: '';
  position: absolute; inset: -14px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(212,165,116,0.5) 0%, transparent 70%);
  filter: blur(8px);
  z-index: -1;
  mix-blend-mode: normal;
}
.smooth-cursor.hover-link {
  width: 56px; height: 56px;
  background: transparent;
  border: 1px solid var(--amber);
  mix-blend-mode: normal;
}
.smooth-cursor.hover-card {
  width: 72px; height: 72px;
  background: rgba(212,165,116,0.08);
  border: 1px solid var(--amber);
  mix-blend-mode: normal;
}
.cursor-label {
  position: fixed; top: 0; left: 0;
  font-family: 'Geist Mono', monospace;
  font-size: 10px; font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--amber);
  pointer-events: none; z-index: 1001;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.25s var(--ease-cinematic);
  white-space: nowrap;
}
.cursor-label.visible { opacity: 1; }
@media (hover: none), (prefers-reduced-motion: reduce) {
  .smooth-cursor, .cursor-label { display: none; }
}
</style>
