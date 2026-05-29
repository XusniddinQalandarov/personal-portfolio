<template>
  <div class="bento" :style="gridStyle"><slot /></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{ cols?: number }>(), { cols: 3 })
const gridStyle = computed(() => ({
  '--bento-cols': props.cols,
}))
</script>

<style scoped>
.bento {
  display: grid;
  grid-template-columns: repeat(var(--bento-cols, 3), minmax(0, 1fr));
  gap: 18px;
}
.bento :deep(.tile) {
  position: relative;
  border-radius: 20px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  padding: 28px;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transition: transform 0.4s var(--ease-cinematic), border-color 0.3s;
}
.bento :deep(.tile:hover) { transform: translateY(-3px); border-color: rgba(255,255,255,0.18); }
.bento :deep(.tile.span-2) { grid-column: span 2; }
@media (max-width: 720px) {
  .bento { grid-template-columns: 1fr; }
  .bento :deep(.tile.span-2) { grid-column: span 1; }
}
</style>
