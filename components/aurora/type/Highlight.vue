<template>
  <span ref="span" class="highlight"><slot /></span>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const span = ref<HTMLSpanElement | null>(null)
onMounted(() => {
  if (typeof window === 'undefined') return
  // Trigger animation by toggling a class after mount.
  setTimeout(() => span.value?.classList.add('grown'), 500)
})
</script>

<style scoped>
.highlight {
  position: relative;
  display: inline-block;
  padding: 0 6px 2px;
  border-radius: 6px;
  background-image: linear-gradient(to right, color-mix(in srgb, var(--indigo) 60%, transparent), color-mix(in srgb, var(--magenta) 60%, transparent));
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 0% 100%;
  transition: background-size 2s linear;
  color: var(--text);
}
.highlight.grown { background-size: 100% 100%; }
@media (prefers-reduced-motion: reduce) { .highlight { background-size: 100% 100%; transition: none; } }
</style>
