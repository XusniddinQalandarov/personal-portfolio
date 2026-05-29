<!-- Port of magicui/shine-border — animated rotating gradient border via mask -->
<template>
  <div class="shine-border" :style="cssVars" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  borderWidth?: number
  duration?: number
  shineColor?: string | string[]
  borderRadius?: number
}>(), {
  borderWidth: 1,
  duration: 10,
  shineColor: () => ['var(--amber)', 'var(--indigo)', 'var(--magenta)'],
  borderRadius: 16,
})

const cssVars = computed(() => {
  const colors = Array.isArray(props.shineColor)
    ? props.shineColor.join(',')
    : props.shineColor
  return {
    '--sb-width': `${props.borderWidth}px`,
    '--sb-duration': `${props.duration}s`,
    '--sb-colors': colors,
    '--sb-radius': `${props.borderRadius}px`,
  }
})
</script>

<style scoped>
.shine-border {
  position: relative;
  border-radius: var(--sb-radius, 16px);
}

.shine-border::before {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: var(--sb-width, 1px);
  background-image: radial-gradient(
    transparent, transparent,
    var(--sb-colors, var(--amber), var(--indigo), var(--magenta)),
    transparent, transparent
  );
  background-size: 300% 300%;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: shine-spin var(--sb-duration, 10s) linear infinite;
  z-index: 0;
}

@keyframes shine-spin {
  0%   { background-position: 0% 0%; }
  50%  { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}

@media (prefers-reduced-motion: reduce) {
  .shine-border::before { animation: none; }
}
</style>
