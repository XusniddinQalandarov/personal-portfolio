<!-- Port of magicui/meteors — random meteor shower across the container -->
<template>
  <div class="meteor-field" aria-hidden="true">
    <span
      v-for="(m, i) in meteors"
      :key="i"
      class="meteor"
      :style="m"
    >
      <span class="meteor-tail" />
    </span>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const props = withDefaults(defineProps<{
  number?: number
  minDelay?: number
  maxDelay?: number
  minDuration?: number
  maxDuration?: number
  angle?: number
}>(), {
  number: 20,
  minDelay: 0.2,
  maxDelay: 1.2,
  minDuration: 2,
  maxDuration: 10,
  angle: 215,
})
const meteors = ref<Record<string, string>[]>([])
onMounted(() => {
  if (typeof window === 'undefined') return
  meteors.value = Array.from({ length: props.number }).map(() => ({
    '--meteor-angle': -props.angle + 'deg',
    top: '-5%',
    left: `${Math.floor(Math.random() * window.innerWidth)}px`,
    animationDelay: (Math.random() * (props.maxDelay - props.minDelay) + props.minDelay).toFixed(2) + 's',
    animationDuration: (Math.floor(Math.random() * (props.maxDuration - props.minDuration) + props.minDuration)).toFixed(0) + 's',
  }))
})
</script>
<style scoped>
.meteor-field {
  position: absolute; inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}
.meteor {
  position: absolute;
  width: 2px; height: 2px;
  background: color-mix(in srgb, var(--text) 55%, transparent);
  border-radius: 999px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
  transform: rotate(var(--meteor-angle, -215deg));
  animation: meteor-fall linear infinite;
  pointer-events: none;
}
.meteor-tail {
  position: absolute;
  top: 50%;
  width: 50px;
  height: 1px;
  background: linear-gradient(to right, color-mix(in srgb, var(--text) 55%, transparent), transparent);
  transform: translateY(-50%);
  z-index: -1;
}
@keyframes meteor-fall {
  0%   { transform: rotate(var(--meteor-angle, -215deg)) translateX(0); opacity: 1; }
  70%  { opacity: 1; }
  100% { transform: rotate(var(--meteor-angle, -215deg)) translateX(-700px); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .meteor { animation: none; opacity: 0; }
}
</style>
