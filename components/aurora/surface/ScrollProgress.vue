<!-- Port of magicui/scroll-progress — fixed top bar tracking page scroll -->
<template>
  <div class="scroll-progress" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const progress = ref(0)

function onScroll() {
  const el = document.documentElement
  const scrolled = el.scrollTop || document.body.scrollTop
  const total = el.scrollHeight - el.clientHeight
  progress.value = total > 0 ? scrolled / total : 0
}

onMounted(() => {
  if (typeof window === 'undefined') return
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  inset-x: 0;
  top: 0;
  z-index: 100;
  height: 2px;
  transform-origin: left;
  background: linear-gradient(90deg, var(--indigo), var(--magenta), var(--amber));
  pointer-events: none;
  will-change: transform;
}
</style>
