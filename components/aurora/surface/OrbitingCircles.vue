<!-- Port of magicui/orbiting-circles — N orbiting children on a circular path -->
<template>
  <div class="orbit-stage">
    <svg v-if="path" class="orbit-path" xmlns="http://www.w3.org/2000/svg" :viewBox="`0 0 ${radius * 2 + iconSize * 2} ${radius * 2 + iconSize * 2}`" preserveAspectRatio="xMidYMid meet">
      <circle :cx="radius + iconSize" :cy="radius + iconSize" :r="radius" fill="none" stroke="var(--glass-border)" stroke-width="1" />
    </svg>
    <div
      v-for="(child, i) in childArr"
      :key="i"
      class="orbit-item"
      :class="{ reverse }"
      :style="{
        '--duration': calcDuration + 's',
        '--radius': radius + 'px',
        '--angle': ((360 / childArr.length) * i) + 'deg',
        '--icon-size': iconSize + 'px',
        animationDelay: delay + 's',
      }"
    >
      <component :is="child" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, useSlots } from 'vue'
const props = withDefaults(defineProps<{
  reverse?: boolean
  duration?: number
  delay?: number
  radius?: number
  path?: boolean
  iconSize?: number
  speed?: number
}>(), {
  reverse: false,
  duration: 20,
  delay: 0,
  radius: 160,
  path: true,
  iconSize: 30,
  speed: 1,
})
const slots = useSlots()
const calcDuration = computed(() => props.duration / props.speed)
const childArr = computed(() => {
  const arr: any[] = []
  const c = slots.default ? slots.default() : []
  for (const v of c) {
    if (Array.isArray((v as any).children)) {
      for (const cc of (v as any).children) arr.push(() => cc)
    } else {
      arr.push(() => v)
    }
  }
  return arr
})
</script>
<style scoped>
.orbit-stage { position: relative; width: 100%; height: 100%; pointer-events: none; }
.orbit-path { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.orbit-item {
  position: absolute;
  left: 50%; top: 50%;
  width: var(--icon-size, 30px);
  height: var(--icon-size, 30px);
  margin-left: calc(var(--icon-size, 30px) / -2);
  margin-top: calc(var(--icon-size, 30px) / -2);
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  pointer-events: auto;
  animation: orbit-spin var(--duration, 20s) linear infinite;
  transform-origin: center;
}
.orbit-item.reverse { animation-direction: reverse; }
@keyframes orbit-spin {
  from { transform: rotate(calc(var(--angle, 0deg))) translateX(var(--radius, 160px)) rotate(calc(0deg - var(--angle, 0deg))); }
  to   { transform: rotate(calc(360deg + var(--angle, 0deg))) translateX(var(--radius, 160px)) rotate(calc(-360deg - var(--angle, 0deg))); }
}
@media (prefers-reduced-motion: reduce) { .orbit-item { animation: none; } }
</style>
