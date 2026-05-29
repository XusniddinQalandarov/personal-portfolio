<!-- Port of aceternity/tabs — magic-motion tab pill with reorder -->
<template>
  <div class="animated-tabs">
    <div class="tabs-row">
      <button
        v-for="(tab, i) in tabs"
        :key="tab.value"
        ref="tabEls"
        class="tab-btn"
        :class="{ active: activeValue === tab.value }"
        @click="setActive(tab.value, i)"
      >
        <span v-if="activeValue === tab.value" class="pill" />
        <span class="label">{{ tab.title }}</span>
      </button>
    </div>
    <div class="tabs-content">
      <slot :active="activeValue" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
interface Tab { title: string; value: string }
const props = defineProps<{ tabs: Tab[]; defaultValue?: string }>()
const activeValue = ref(props.defaultValue ?? props.tabs[0].value)
const emit = defineEmits<{ (e: 'update:active', v: string): void }>()
function setActive(v: string, _i: number) { activeValue.value = v; emit('update:active', v) }
</script>
<style scoped>
.animated-tabs { width: 100%; }
.tabs-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.tab-btn {
  position: relative;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  background: transparent;
  font-family: 'Geist Mono', monospace;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  cursor: none;
  transition: color 0.25s, border-color 0.25s;
  overflow: hidden;
}
.tab-btn:hover { color: var(--text); border-color: rgba(255,255,255,0.18); }
.tab-btn.active { color: var(--void); border-color: transparent; }
.pill {
  position: absolute; inset: 0;
  background: var(--text);
  border-radius: 999px;
  z-index: 0;
  animation: pill-pop 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.label { position: relative; z-index: 1; }
@keyframes pill-pop {
  from { transform: scale(0.85); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
.tabs-content { width: 100%; }
</style>
