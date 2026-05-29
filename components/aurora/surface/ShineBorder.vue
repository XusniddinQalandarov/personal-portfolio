<template>
  <div class="shine-border" :style="{ '--shine-w': borderWidth + 'px', '--shine-duration': duration + 's', '--shine-color': normalizedColor }" aria-hidden="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  borderWidth?: number
  duration?: number
  shineColor?: string | string[]
}>(), {
  borderWidth: 1,
  duration: 14,
  shineColor: () => ['var(--amber)', 'var(--cyan)', 'var(--magenta)'],
})
const normalizedColor = computed(() => Array.isArray(props.shineColor) ? props.shineColor.join(', ') : props.shineColor)
</script>

<style scoped>
.shine-border {
  pointer-events: none;
  position: absolute; inset: 0;
  border-radius: inherit;
  padding: var(--shine-w, 1px);
  background-image: radial-gradient(transparent, transparent, var(--shine-color), transparent, transparent);
  background-size: 300% 300%;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: shine var(--shine-duration, 14s) linear infinite;
  will-change: background-position;
}
@keyframes shine {
  0% { background-position: 0% 0%; }
  100% { background-position: 300% 300%; }
}
@media (prefers-reduced-motion: reduce) { .shine-border { animation: none; } }
</style>
