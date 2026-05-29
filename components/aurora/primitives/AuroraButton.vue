<template>
  <component
    :is="to ? resolveAnchor() : 'button'"
    :to="to"
    :href="href"
    :class="['btn', variant === 'ghost' ? 'btn-ghost' : 'btn-primary']"
    :data-cursor-label="cursorLabel"
  >
    <slot />
    <span v-if="showArrow" class="arrow" aria-hidden="true">→</span>
  </component>
</template>

<script setup lang="ts">
import { resolveComponent } from 'vue'
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'ghost'
  to?: string
  href?: string
  showArrow?: boolean
  cursorLabel?: string
}>(), {
  variant: 'primary',
  showArrow: false,
})
function resolveAnchor() {
  return resolveComponent('NuxtLink')
}
</script>

<style scoped>
.btn {
  padding: 14px 24px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  border-radius: 999px;
  transition: all 0.3s var(--ease-cinematic);
  position: relative; overflow: hidden;
  border: 1px solid transparent;
  display: inline-flex; align-items: center; gap: 10px;
  cursor: none;
  text-decoration: none;
}
.btn-primary { background: var(--text); color: var(--void); }
.btn-primary:hover { background: var(--amber); transform: translateY(-2px); }
.btn-ghost { background: transparent; border-color: var(--glass-border); color: var(--text); }
.btn-ghost:hover { border-color: var(--amber); color: var(--amber); }
.arrow { display: inline-block; transition: transform 0.3s var(--ease-cinematic); }
.btn:hover .arrow { transform: translateX(4px); }

@media (prefers-reduced-motion: reduce) {
  .btn { transition: none; }
  .btn-primary:hover { transform: none; }
  .arrow { transition: none; }
  .btn:hover .arrow { transform: none; }
}
</style>
