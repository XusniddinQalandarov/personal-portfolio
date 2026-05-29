<template>
  <div class="eyebrow">
    <span class="bar" />
    <span :class="['label', { shine }]">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string; shine?: boolean }>()
</script>

<style scoped>
.eyebrow {
  display: flex; align-items: center; gap: 14px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: var(--muted);
}
.bar { width: 36px; height: 1px; background: linear-gradient(90deg, transparent, var(--amber)); }
.label.shine {
  background: linear-gradient(90deg, var(--muted) 30%, #fff 50%, var(--muted) 70%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 6s linear infinite;
}
@keyframes shine {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
