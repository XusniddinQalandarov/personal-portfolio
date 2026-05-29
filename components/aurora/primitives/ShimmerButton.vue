<!-- Port of magicui/shimmer-button — conic shimmer sweep around the perimeter -->
<template>
  <component
    :is="to ? resolveLink() : href ? 'a' : 'button'"
    :to="to"
    :href="href"
    class="shimmer-btn"
    :style="{
      '--shimmer-color': shimmerColor,
      '--radius': borderRadius,
      '--speed': shimmerDuration,
      '--cut': shimmerSize,
      '--bg': background,
    }"
  >
    <span class="spark-container" aria-hidden="true">
      <span class="spark" />
    </span>
    <span class="content"><slot /></span>
    <span class="highlight" aria-hidden="true" />
    <span class="backdrop" aria-hidden="true" />
  </component>
</template>
<script setup lang="ts">
import { resolveComponent } from 'vue'
const props = withDefaults(defineProps<{
  shimmerColor?: string
  shimmerSize?: string
  shimmerDuration?: string
  borderRadius?: string
  background?: string
  to?: string
  href?: string
}>(), {
  shimmerColor: 'var(--amber)',
  shimmerSize: '0.07em',
  shimmerDuration: '3s',
  borderRadius: '999px',
  background: 'var(--void-soft)',
})
function resolveLink() { return resolveComponent('NuxtLink') }
</script>
<style scoped>
.shimmer-btn {
  --spread: 90deg;
  position: relative;
  display: inline-flex; align-items: center; justify-content: center;
  z-index: 0;
  padding: 14px 28px;
  border-radius: var(--radius);
  border: 1px solid rgba(255,255,255,0.10);
  background: var(--bg);
  color: var(--text);
  text-decoration: none;
  font-family: 'Geist Mono', monospace;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  cursor: none;
  overflow: hidden;
  transform: translateZ(0);
  transition: transform 0.3s var(--ease-cinematic);
}
.shimmer-btn:active { transform: translateY(1px); }
.spark-container {
  position: absolute; inset: 0;
  z-index: -30;
  overflow: visible;
  filter: blur(2px);
}
.spark {
  position: absolute; inset: 0;
  aspect-ratio: 1;
  border-radius: 0;
  animation: shimmer-slide var(--speed) linear infinite;
}
.spark::before {
  content: '';
  position: absolute; inset: -100%;
  width: auto;
  background: conic-gradient(from calc(270deg - (var(--spread) * 0.5)), transparent 0, var(--shimmer-color) var(--spread), transparent var(--spread));
  animation: spin-around calc(var(--speed) * 2) linear infinite;
}
.content { position: relative; z-index: 1; }
.highlight {
  position: absolute; inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 -8px 10px rgba(255,255,255,0.12);
  transition: box-shadow 0.3s var(--ease-cinematic);
  pointer-events: none;
}
.shimmer-btn:hover .highlight { box-shadow: inset 0 -6px 10px rgba(255,255,255,0.25); }
.shimmer-btn:active .highlight { box-shadow: inset 0 -10px 10px rgba(255,255,255,0.25); }
.backdrop {
  position: absolute; inset: var(--cut);
  z-index: -20;
  border-radius: var(--radius);
  background: var(--bg);
  pointer-events: none;
}
@keyframes shimmer-slide { to { transform: translateX(100%); } }
@keyframes spin-around { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .spark, .spark::before { animation: none; }
}
</style>
