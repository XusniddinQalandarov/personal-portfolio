<!-- layouts/aurora.vue -->
<template>
  <div class="aurora-layout">
    <AuroraWorld />
    <AuroraCursor />
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import AuroraWorld from '~/components/aurora/backdrop/AuroraWorld.vue'
import AuroraCursor from '~/components/aurora/cursor/AuroraCursor.vue'
import { useTheme } from '~/composables/useTheme'
import { useAuroraTheme } from '~/composables/useAuroraTheme'

const { initTheme } = useTheme()
useAuroraTheme()

onMounted(() => {
  initTheme()
  if (typeof window !== 'undefined') {
    document.documentElement.classList.add('aurora-active')
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    document.documentElement.classList.remove('aurora-active')
  }
})
</script>

<style>
/* GLOBAL — needs to leak from the layout to override the native cursor everywhere. */
html, body {
  background: var(--void);
  color: var(--text);
}
.aurora-layout {
  min-height: 100vh;
  position: relative;
  font-family: 'Geist', system-ui, sans-serif;
}
.aurora-layout .content {
  position: relative;
  z-index: 5;
}
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  html.aurora-active, html.aurora-active body { cursor: none; }
}
</style>
