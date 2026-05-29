<!-- Port of magicui/interactive-hover-button — dot expansion + sliding label -->
<template>
  <button class="ihb" :type="type">
    <span class="ihb-row default">
      <span class="dot" />
      <span class="label"><slot /></span>
    </span>
    <span class="ihb-row hover">
      <span class="label"><slot /></span>
      <span class="arrow" aria-hidden="true">→</span>
    </span>
  </button>
</template>
<script setup lang="ts">
withDefaults(defineProps<{ type?: 'button' | 'submit' | 'reset' }>(), { type: 'button' })
</script>
<style scoped>
.ihb {
  position: relative;
  display: inline-flex; align-items: center; justify-content: center;
  padding: 10px 24px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  background: var(--void-soft);
  color: var(--text);
  font-family: 'Geist Mono', monospace;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  cursor: none;
  overflow: hidden;
  transition: border-color 0.3s var(--ease-cinematic);
  min-width: 140px;
}
.ihb:hover { border-color: var(--amber); }
.ihb-row {
  display: inline-flex; align-items: center; gap: 10px;
}
.ihb-row.default {
  transition: transform 0.3s var(--ease-cinematic), opacity 0.3s var(--ease-cinematic);
}
.ihb:hover .ihb-row.default { transform: translateX(40px); opacity: 0; }
.ihb-row.hover {
  position: absolute; inset: 0;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  background: var(--amber);
  color: var(--void);
  transform: translateX(40px);
  opacity: 0;
  transition: transform 0.3s var(--ease-cinematic), opacity 0.3s var(--ease-cinematic);
}
.ihb:hover .ihb-row.hover { transform: translateX(0); opacity: 1; }
.dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--amber);
  transition: transform 0.4s var(--ease-cinematic);
}
.ihb:hover .dot { transform: scale(40); }
.arrow { display: inline-block; }
@media (prefers-reduced-motion: reduce) {
  .ihb-row, .dot { transition: none; }
}
</style>
