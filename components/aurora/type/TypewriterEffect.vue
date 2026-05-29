<!-- Port of aceternity/typewriter-effect — character-stagger typing with blinking cursor -->
<template>
  <span ref="root" class="typewriter">
    <span
      v-for="(ch, i) in chars"
      :key="i"
      class="ch"
      :class="{ space: ch === ' ', shown: shown >= i }"
    >{{ ch }}</span>
    <span class="cursor" aria-hidden="true" />
  </span>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
const props = withDefaults(defineProps<{
  text: string; delayMs?: number; startOnView?: boolean
}>(), { delayMs: 60, startOnView: true })
const chars = computed(() => props.text.split(''))
const shown = ref(-1)
const root = ref<HTMLSpanElement | null>(null)
let interval = 0
function start() {
  interval = window.setInterval(() => {
    shown.value += 1
    if (shown.value >= chars.value.length - 1) clearInterval(interval)
  }, props.delayMs)
}
onMounted(() => {
  if (typeof window === 'undefined') return
  if (!props.startOnView) { start(); return }
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { start(); io.disconnect() } })
  // Observe parent so we don't need a wrapper element
  const target = root.value?.parentElement
  if (target) io.observe(target)
  onBeforeUnmount(() => { clearInterval(interval); io.disconnect() })
})
</script>
<style scoped>
.typewriter { display: inline; }
.ch { display: inline-block; opacity: 0; transform: translateY(4px); transition: opacity 0.2s, transform 0.2s; }
.ch.shown { opacity: 1; transform: translateY(0); }
.ch.space { width: 0.3em; }
.cursor {
  display: inline-block;
  width: 3px; height: 1em;
  background: var(--amber);
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 0.9s infinite;
}
@keyframes blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .cursor { animation: none; } }
</style>
