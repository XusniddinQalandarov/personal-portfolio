<template>
  <div class="bento-tile">
    <div v-if="$slots.header" class="bento-header"><slot name="header" /></div>
    <div class="bento-body">
      <div v-if="$slots.icon" class="bento-icon"><slot name="icon" /></div>
      <div v-if="title || $slots.title" class="bento-title"><slot name="title">{{ title }}</slot></div>
      <div v-if="description || $slots.description" class="bento-desc"><slot name="description">{{ description }}</slot></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string; description?: string }>()
</script>

<style scoped>
.bento-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px;
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transition: transform 0.4s var(--ease-cinematic), border-color 0.3s;
  height: 100%;
  overflow: hidden;
}
.bento-tile:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.18); }
.bento-tile:hover .bento-body { transform: translateX(4px); }
.bento-header { flex: 1; min-height: 100px; border-radius: 12px; overflow: hidden; }
.bento-body {
  transition: transform 0.2s var(--ease-cinematic);
}
.bento-icon { color: var(--amber); font-size: 22px; margin-bottom: 6px; }
.bento-title {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
  letter-spacing: -0.01em;
}
.bento-desc {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 300;
  font-size: 13px;
  line-height: 1.5;
  color: var(--muted);
}
</style>
