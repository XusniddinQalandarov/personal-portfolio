<!-- components/aurora/layout/AuroraDock.vue -->
<template>
  <nav class="dock" aria-label="Primary navigation">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="dock-item"
      :class="{ active: $route.path === item.to }"
      :data-cursor-label="$t(`aurora.cursor.${item.cursorKey}`)"
      :aria-label="$t(`aurora.cursor.${item.cursorKey}`)"
    >
      <component :is="item.icon" :size="17" :stroke-width="1.6" />
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { Home, User, Briefcase, LayoutGrid, BookOpen, Zap, Mail } from 'lucide-vue-next'

const items = [
  { to: '/',           cursorKey: 'home',       icon: Home },
  { to: '/about',      cursorKey: 'about',      icon: User },
  { to: '/experience', cursorKey: 'experience', icon: Briefcase },
  { to: '/projects',   cursorKey: 'projects',   icon: LayoutGrid },
  { to: '/blogs',      cursorKey: 'blogs',      icon: BookOpen },
  { to: '/fitness',    cursorKey: 'fitness',    icon: Zap },
  { to: '/contact',    cursorKey: 'contact',    icon: Mail },
] as const
</script>

<style scoped>
.dock {
  position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
  z-index: 50;
  display: flex; align-items: center; gap: 2px;
  padding: 6px;
  background: rgba(12, 12, 20, 0.72);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  box-shadow: 0 24px 64px -16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
}

[data-theme="light"] .dock {
  background: rgba(255, 252, 248, 0.85);
  box-shadow: 0 12px 40px -8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9);
}

.dock-item {
  width: 42px; height: 42px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 999px;
  color: var(--muted);
  transition: transform 0.4s var(--ease-cinematic), color 0.3s, background 0.3s;
  position: relative;
  text-decoration: none;
  cursor: none;
}
.dock-item:hover {
  color: var(--text);
  transform: translateY(-6px) scale(1.12);
  background: rgba(255,255,255,0.05);
}
[data-theme="light"] .dock-item:hover {
  background: rgba(0,0,0,0.05);
}
.dock-item.active { color: var(--amber); }
</style>
