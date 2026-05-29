<template>
  <div class="trc-stars" aria-hidden="true">
    <span v-for="(s, i) in stars" :key="i" class="star" :style="s" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
const stars = ref<Record<string, string>[]>([])
onMounted(() => {
  if (typeof window === 'undefined') return
  const arr: Record<string, string>[] = []
  for (let i = 0; i < 80; i++) {
    const top = Math.random() * 100
    const left = Math.random() * 100
    const dur = (Math.random() * 10 + 20).toFixed(1)
    arr.push({
      top: top + '%',
      left: left + '%',
      animationDuration: dur + 's',
      animationDelay: (Math.random() * 5).toFixed(1) + 's',
    })
  }
  stars.value = arr
})
</script>
<style scoped>
.trc-stars { position: absolute; inset: 0; pointer-events: none; }
.star {
  position: absolute;
  width: 2px; height: 2px;
  background: #fff;
  border-radius: 50%;
  opacity: 0.6;
  animation: twinkle 20s linear infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}
@media (prefers-reduced-motion: reduce) { .star { animation: none; } }
</style>
