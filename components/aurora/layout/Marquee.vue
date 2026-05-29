<template>
  <div
    class="marquee"
    :class="{ vertical, paused: pauseOnHover, reverse }"
    :style="{ '--marquee-duration': duration + 's', '--marquee-gap': gap }"
  >
    <div v-for="i in repeat" :key="i" class="marquee-row"><slot /></div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  vertical?: boolean
  reverse?: boolean
  pauseOnHover?: boolean
  duration?: number
  gap?: string
  repeat?: number
}>(), {
  vertical: false,
  reverse: false,
  pauseOnHover: false,
  duration: 40,
  gap: '1rem',
  repeat: 4,
})
</script>

<style scoped>
.marquee {
  display: flex;
  gap: var(--marquee-gap);
  overflow: hidden;
  padding: 8px 0;
}
.marquee.vertical { flex-direction: column; }
.marquee-row {
  display: flex;
  flex-shrink: 0;
  gap: var(--marquee-gap);
  justify-content: space-around;
  animation: marqueeX var(--marquee-duration) linear infinite;
}
.marquee.vertical .marquee-row { flex-direction: column; animation-name: marqueeY; }
.marquee.reverse .marquee-row { animation-direction: reverse; }
.marquee.paused:hover .marquee-row { animation-play-state: paused; }

@keyframes marqueeX {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100% - var(--marquee-gap))); }
}
@keyframes marqueeY {
  from { transform: translateY(0); }
  to   { transform: translateY(calc(-100% - var(--marquee-gap))); }
}
@media (prefers-reduced-motion: reduce) { .marquee-row { animation: none; } }
</style>
