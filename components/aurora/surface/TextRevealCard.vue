<!-- Port of aceternity/text-reveal-card — cursor sweep reveals a second text layer -->
<template>
  <div
    ref="cardRef"
    class="trc"
    @pointerenter="enter = true"
    @pointerleave="leave()"
    @pointermove="onMove"
    @touchstart="enter = true"
    @touchend="leave()"
    @touchmove.prevent="onTouch"
  >
    <slot />
    <div class="trc-stage">
      <div
        class="trc-reveal"
        :style="{
          clipPath: `inset(0 ${100 - width}% 0 0)`,
          opacity: width > 0 ? 1 : 0,
        }"
      >
        <p class="trc-reveal-text">{{ revealText }}</p>
      </div>
      <div
        class="trc-seam"
        :style="{
          left: width + '%',
          transform: `rotate(${(width - 50) * 0.1}deg)`,
          opacity: width > 0 ? 1 : 0,
        }"
      />
      <div class="trc-base-wrap">
        <p class="trc-base-text">{{ text }}</p>
        <TrcStars />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TrcStars from './TrcStars.vue'
const props = defineProps<{ text: string; revealText: string }>()
const cardRef = ref<HTMLDivElement | null>(null)
const enter = ref(false)
const width = ref(0)
const left = ref(0)
const localW = ref(0)
function onMove(e: PointerEvent) {
  if (!cardRef.value) return
  const r = cardRef.value.getBoundingClientRect()
  left.value = r.left; localW.value = r.width
  width.value = ((e.clientX - r.left) / r.width) * 100
}
function onTouch(e: TouchEvent) {
  if (!cardRef.value) return
  const r = cardRef.value.getBoundingClientRect()
  const cx = e.touches[0]?.clientX ?? 0
  width.value = ((cx - r.left) / r.width) * 100
}
function leave() { enter.value = false; width.value = 0 }
onMounted(() => {
  if (typeof window === 'undefined') return
  if (cardRef.value) {
    const r = cardRef.value.getBoundingClientRect()
    left.value = r.left; localW.value = r.width
  }
})
</script>
<style scoped>
.trc {
  position: relative;
  width: 100%;
  max-width: 640px;
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  background: var(--void-soft, rgba(0,0,0,0.8));
  padding: 32px;
  overflow: hidden;
  cursor: none;
}
.trc-stage { position: relative; height: 160px; display: flex; align-items: center; overflow: hidden; }
.trc-reveal {
  position: absolute; inset: 0;
  background: var(--void-soft, rgba(0,0,0,0.8));
  z-index: 20;
  transition: clip-path 0.4s var(--ease-cinematic), opacity 0.4s;
  will-change: transform;
}
.trc-reveal-text {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(28px, 4vw, 56px);
  line-height: 1.1;
  padding: 32px 0;
  background: linear-gradient(180deg, var(--text), color-mix(in srgb, var(--text) 70%, transparent));
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 4px 4px 15px rgba(0,0,0,0.5);
}
.trc-seam {
  position: absolute; top: 0; bottom: 0;
  width: 6px;
  background: linear-gradient(180deg, transparent, var(--amber), transparent);
  z-index: 50;
  pointer-events: none;
  transition: left 0.4s var(--ease-cinematic), opacity 0.4s;
  will-change: transform, left;
}
.trc-base-wrap {
  position: relative;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to bottom, transparent, white, transparent);
  mask-image: linear-gradient(to bottom, transparent, white, transparent);
}
.trc-base-text {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(28px, 4vw, 56px);
  line-height: 1.1;
  padding: 32px 0;
  color: color-mix(in srgb, var(--muted) 80%, transparent);
}
</style>
