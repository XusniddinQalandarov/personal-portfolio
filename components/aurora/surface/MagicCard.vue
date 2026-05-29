<template>
  <div ref="root" class="magic-card" @pointermove="onMove">
    <div class="spotlight" :style="spotlightStyle" aria-hidden="true" />
    <div class="content"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const root = ref<HTMLDivElement | null>(null)
const mx = ref(50), my = ref(50)
function onMove(e: PointerEvent) {
  if (!root.value) return
  const r = root.value.getBoundingClientRect()
  mx.value = e.clientX - r.left
  my.value = e.clientY - r.top
}
const spotlightStyle = computed(() => ({
  background: `radial-gradient(420px circle at ${mx.value}px ${my.value}px, rgba(212,165,116,0.18), transparent 60%)`,
}))
</script>

<style scoped>
.magic-card {
  position: relative;
  border-radius: 22px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  overflow: hidden;
  transition: transform 0.5s var(--ease-cinematic), border-color 0.5s;
}
.magic-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.18); }
.spotlight { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 0.4s; }
.magic-card:hover .spotlight { opacity: 1; }
.content { position: relative; z-index: 2; padding: 28px; height: 100%; display: flex; flex-direction: column; }
</style>
