<!-- Port of aceternity/animated-tooltip — hoverable avatar with spring-rotated tooltip -->
<template>
  <div class="tt-row">
    <div
      v-for="(item, idx) in items"
      :key="item.id"
      class="tt-item"
      @pointerenter="hovered = item.id"
      @pointerleave="hovered = null"
    >
      <transition name="tt-pop">
        <div
          v-if="hovered === item.id"
          class="tt-card"
          :style="tooltipStyle"
        >
          <div class="tt-line tt-line-1" />
          <div class="tt-line tt-line-2" />
          <div class="tt-name">{{ item.name }}</div>
          <div class="tt-designation">{{ item.designation }}</div>
        </div>
      </transition>
      <img
        :src="item.image"
        :alt="item.name"
        class="tt-avatar"
        @pointermove="onMove($event)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
interface Item { id: number | string; name: string; designation: string; image: string }
defineProps<{ items: Item[] }>()
const hovered = ref<string | number | null>(null)
const xOffset = ref(0)
function onMove(e: PointerEvent) {
  const target = e.target as HTMLElement
  const halfW = target.offsetWidth / 2
  xOffset.value = e.offsetX - halfW
}
const tooltipStyle = computed(() => ({
  transform: `translateX(${Math.max(-50, Math.min(50, xOffset.value / 2))}px) rotate(${Math.max(-45, Math.min(45, xOffset.value * 0.45))}deg)`,
}))
</script>
<style scoped>
.tt-row { display: flex; align-items: center; }
.tt-item { position: relative; margin-right: -8px; }
.tt-card {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  z-index: 50;
  transform-origin: bottom center;
  display: flex; flex-direction: column; align-items: center;
  padding: 8px 14px;
  border-radius: 8px;
  background: #000;
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  white-space: nowrap;
  pointer-events: none;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.tt-line { position: absolute; left: 10px; bottom: -1px; height: 1px; }
.tt-line-1 { right: 30%; background: linear-gradient(to right, transparent, var(--cyan), transparent); }
.tt-line-2 { right: 50%; background: linear-gradient(to right, transparent, var(--amber), transparent); }
.tt-name { font-family: 'Geist', system-ui, sans-serif; font-weight: 700; font-size: 13px; color: var(--text); }
.tt-designation { font-family: 'Geist Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 0.16em; margin-top: 2px; }
.tt-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 2px solid var(--text);
  object-fit: cover;
  background: var(--void-soft);
  transition: transform 0.4s var(--ease-cinematic), z-index 0s 0.4s;
  position: relative;
  cursor: none;
}
.tt-item:hover { z-index: 30; }
.tt-item:hover .tt-avatar { transform: scale(1.06); }
.tt-pop-enter-from { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.6); }
.tt-pop-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.tt-pop-enter-to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
.tt-pop-leave-from { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
.tt-pop-leave-active { transition: all 0.2s ease; }
.tt-pop-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.6); }
</style>
