<template>
  <section ref="container" class="aurora-timeline">
    <div class="timeline-inner" ref="inner">
      <div v-for="(entry, i) in data" :key="i" class="row">
        <div class="sticky-title">
          <div class="dot"><div class="dot-inner" /></div>
          <h3 class="period">{{ entry.title }}</h3>
        </div>
        <div class="entry">
          <h3 class="period-mobile">{{ entry.title }}</h3>
          <slot :name="entry.slot" :entry="entry" />
        </div>
      </div>
      <div class="beam-track" :style="{ height: trackH + 'px' }">
        <div class="beam-fill" :style="{ height: fillH + 'px', opacity: fillOpacity }" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface TimelineEntry {
  title: string
  slot?: string
}
defineProps<{ data: TimelineEntry[] }>()

const container = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)
const trackH = ref(0)
const fillH = ref(0)
const fillOpacity = ref(0)

function recompute() {
  if (!inner.value) return
  trackH.value = inner.value.offsetHeight
}

function onScroll() {
  if (!container.value) return
  const r = container.value.getBoundingClientRect()
  const viewH = window.innerHeight
  const start = r.top - viewH * 0.9 // start 10% above viewport top
  const end = r.bottom - viewH * 0.5 // end at 50% viewport mid
  const total = end - start || 1
  const progress = Math.min(1, Math.max(0, -start / total))
  fillH.value = trackH.value * progress
  fillOpacity.value = Math.min(1, progress * 10)
}

let onScrollBound: () => void = () => {}
onMounted(() => {
  if (typeof window === 'undefined') return
  recompute()
  onScrollBound = () => { onScroll() }
  window.addEventListener('scroll', onScrollBound, { passive: true })
  window.addEventListener('resize', recompute)
  // Recompute next tick once children render.
  setTimeout(recompute, 50)
  onScroll()
})
onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', onScrollBound)
  window.removeEventListener('resize', recompute)
})
</script>

<style scoped>
.aurora-timeline {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  font-family: 'Geist', system-ui, sans-serif;
  padding: 0 24px;
}
@media (min-width: 768px) { .aurora-timeline { padding: 0 40px; } }
.timeline-inner { position: relative; padding-bottom: 80px; }
.row {
  display: flex;
  justify-content: flex-start;
  padding-top: 40px;
}
@media (min-width: 768px) { .row { padding-top: 160px; gap: 40px; } }

.sticky-title {
  position: sticky; top: 160px;
  align-self: flex-start;
  display: flex;
  align-items: center;
  z-index: 40;
  max-width: 320px;
}
@media (min-width: 1024px) { .sticky-title { max-width: 380px; } }
.dot {
  width: 40px; height: 40px;
  border-radius: 999px;
  background: var(--void);
  display: flex; align-items: center; justify-content: center;
  position: absolute;
  left: 12px;
}
.dot-inner {
  width: 14px; height: 14px;
  border-radius: 999px;
  background: var(--glass-border);
  border: 1px solid rgba(255,255,255,0.18);
}
.period {
  display: none;
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(36px, 4vw, 64px);
  letter-spacing: -0.04em;
  color: rgba(255,255,255,0.18);
  padding-left: 80px;
}
@media (min-width: 768px) { .period { display: block; } }

.period-mobile {
  display: block;
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: rgba(255,255,255,0.4);
  margin-bottom: 16px;
}
@media (min-width: 768px) { .period-mobile { display: none; } }

.entry {
  position: relative;
  padding: 4px 16px 16px 80px;
  flex: 1;
  min-width: 0;
}
@media (min-width: 768px) { .entry { padding-left: 16px; } }

.beam-track {
  position: absolute;
  top: 0;
  left: 32px;
  width: 2px;
  overflow: hidden;
  background:
    linear-gradient(to bottom, transparent, var(--glass-border) 12%, var(--glass-border) 88%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%);
}
.beam-fill {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  width: 2px;
  background: linear-gradient(to top, transparent, var(--cyan) 10%, var(--amber));
  border-radius: 999px;
  transition: height 0.15s linear, opacity 0.3s;
}
</style>
