<!-- components/aurora/layout/AuroraDock.vue
     Ported pattern from aceternity/floating-dock + magicui/dock. -->
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
      <i :class="['pi', item.icon]" />
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const items = [
  { to: '/',           cursorKey: 'home',       icon: 'pi-home' },
  { to: '/about',      cursorKey: 'about',      icon: 'pi-user' },
  { to: '/experience', cursorKey: 'experience', icon: 'pi-briefcase' },
  { to: '/projects',   cursorKey: 'projects',   icon: 'pi-folder' },
  { to: '/blogs',      cursorKey: 'blogs',      icon: 'pi-book' },
  { to: '/fitness',    cursorKey: 'fitness',    icon: 'pi-bolt' },
  { to: '/contact',    cursorKey: 'contact',    icon: 'pi-envelope' },
] as const
</script>

<style scoped>
.dock {
  position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
  z-index: 50;
  display: flex; align-items: center; gap: 2px;
  padding: 6px;
  background: rgba(12, 12, 20, 0.65);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  box-shadow: 0 24px 64px -16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04);
}
.dock-item {
  width: 42px; height: 42px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 999px;
  color: var(--muted);
  font-size: 15px;
  transition: transform 0.4s var(--ease-cinematic), color 0.3s, background 0.3s;
  position: relative;
  text-decoration: none;
  cursor: none;
}
.dock-item:hover {
  color: var(--text);
  transform: translateY(-6px) scale(1.12);
  background: rgba(255,255,255,0.04);
}
.dock-item.active { color: var(--amber); }
</style>
