<template>
  <div ref="root" class="hero-highlight" @pointermove="onMove">
    <div class="dot-base" aria-hidden="true" />
    <div class="dot-hover" aria-hidden="true" :style="hoverMaskStyle" />
    <div class="content"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const root = ref<HTMLDivElement | null>(null)
const mx = ref(0)
const my = ref(0)
function onMove(e: PointerEvent) {
  if (!root.value) return
  const r = root.value.getBoundingClientRect()
  mx.value = e.clientX - r.left
  my.value = e.clientY - r.top
}
const hoverMaskStyle = computed(() => ({
  '--mx': `${mx.value}px`,
  '--my': `${my.value}px`,
}))
</script>

<style scoped>
.hero-highlight {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.dot-base, .dot-hover {
  position: absolute; inset: 0;
  pointer-events: none;
}
.dot-base {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='%23404040' cx='10' cy='10' r='2'/%3E%3C/svg%3E");
}
.dot-hover {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='%23d4a574' cx='10' cy='10' r='2.5'/%3E%3C/svg%3E");
  opacity: 0;
  transition: opacity 0.3s;
  -webkit-mask-image: radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), black 0%, transparent 100%);
  mask-image: radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), black 0%, transparent 100%);
}
.hero-highlight:hover .dot-hover { opacity: 1; }
.content { position: relative; z-index: 5; width: 100%; }
@media (prefers-reduced-motion: reduce) { .dot-hover { transition: none; } }
</style>
