<!-- Port of magicui/hyper-text — scrambles letters before settling on target -->
<template>
  <span ref="el" class="hyper-text" @mouseenter="onEnter">
    <span v-for="(ch, i) in display" :key="i" :class="{ space: ch === ' ' }">{{ ch.toUpperCase() }}</span>
  </span>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
const props = withDefaults(defineProps<{
  text: string; duration?: number; delay?: number; startOnView?: boolean; animateOnHover?: boolean; characterSet?: string[]
}>(), {
  duration: 800, delay: 0, startOnView: false, animateOnHover: true,
  characterSet: () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
})
const el = ref<HTMLSpanElement | null>(null)
const display = ref(props.text.split(''))
let rafId = 0
function run() {
  const chars = props.characterSet
  const start = performance.now()
  function frame(t: number) {
    const progress = Math.min((t - start) / props.duration, 1)
    const i = progress * props.text.length
    display.value = props.text.split('').map((c, idx) => c === ' ' ? c : idx <= i ? c : chars[Math.floor(Math.random() * chars.length)])
    if (progress < 1) rafId = requestAnimationFrame(frame)
    else rafId = 0
  }
  rafId = requestAnimationFrame(frame)
}
function onEnter() { if (props.animateOnHover && !rafId) run() }
onMounted(() => {
  if (typeof window === 'undefined') return
  if (!props.startOnView) { setTimeout(run, props.delay); return }
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { setTimeout(run, props.delay); io.disconnect() }
  }, { threshold: 0.1, rootMargin: '-30% 0px -30% 0px' })
  if (el.value) io.observe(el.value)
  onBeforeUnmount(() => { cancelAnimationFrame(rafId); io.disconnect() })
})
</script>
<style scoped>
.hyper-text { display: inline-block; font-family: 'Geist Mono', monospace; }
.hyper-text > span { display: inline-block; }
.hyper-text > span.space { width: 0.45em; }
@media (prefers-reduced-motion: reduce) { .hyper-text > span { animation: none; } }
</style>
