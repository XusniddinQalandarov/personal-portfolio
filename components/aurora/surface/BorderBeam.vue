<template>
  <div class="border-beam border-beam-wrap" :style="{ '--border-beam-width': borderWidth + 'px' }" aria-hidden="true">
    <div
      class="border-beam-spark"
      :style="sparkStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
  reverse?: boolean
  initialOffset?: number
  borderWidth?: number
}>(), {
  size: 60,
  duration: 6,
  delay: 0,
  colorFrom: 'var(--amber)',
  colorTo: 'var(--cyan)',
  reverse: false,
  initialOffset: 0,
  borderWidth: 1,
})
const sparkStyle = computed(() => ({
  width: `${props.size}px`,
  aspectRatio: '1',
  offsetPath: `rect(0 auto auto 0 round ${props.size}px)`,
  background: `linear-gradient(to left, ${props.colorFrom}, ${props.colorTo}, transparent)`,
  animation: `border-beam-sweep${props.reverse ? '-rev' : ''} ${props.duration}s linear ${-props.delay}s infinite`,
  animationDelay: `${-props.delay}s`,
}))
</script>

<style scoped>
.border-beam-wrap {
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: var(--border-beam-width, 1px) solid transparent;
  -webkit-mask:
    linear-gradient(transparent, transparent) padding-box,
    linear-gradient(#000, #000) border-box;
  mask:
    linear-gradient(transparent, transparent) padding-box,
    linear-gradient(#000, #000) border-box;
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
.border-beam-spark {
  position: absolute;
  top: 0; left: 0;
  offset-anchor: center;
}
@keyframes border-beam-sweep {
  to { offset-distance: 100%; }
}
@keyframes border-beam-sweep-rev {
  from { offset-distance: 100%; }
  to { offset-distance: 0%; }
}
@media (prefers-reduced-motion: reduce) {
  .border-beam-spark { animation: none; }
}
</style>
