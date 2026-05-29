<!-- Port of magicui/text-reveal — scroll-driven word fade as the section passes the viewport -->
<template>
  <div ref="section" class="text-reveal-section">
    <div class="sticky-wrap">
      <span class="words">
        <span
          v-for="(word, i) in words"
          :key="i"
          class="word-wrap"
          :style="{ opacity: opacities[i] }"
        >{{ word }}<span v-if="i < words.length - 1">&nbsp;</span></span>
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps<{ text: string }>()
const section = ref<HTMLElement | null>(null)
const words = computed(() => props.text.split(/\s+/))
const opacities = ref<number[]>(new Array(props.text.split(/\s+/).length).fill(0.2))
function onScroll() {
  if (!section.value) return
  const r = section.value.getBoundingClientRect()
  const viewH = window.innerHeight
  // Map [start, end] section progress through 0..1
  const totalScroll = r.height - viewH
  const passed = Math.min(Math.max(0, -r.top), totalScroll)
  const progress = totalScroll > 0 ? passed / totalScroll : 0
  const n = words.value.length
  opacities.value = words.value.map((_, i) => {
    const start = i / n
    const end = (i + 1) / n
    if (progress <= start) return 0.2
    if (progress >= end) return 1
    return 0.2 + 0.8 * ((progress - start) / (end - start))
  })
}
onMounted(() => {
  if (typeof window === 'undefined') return
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })
})
</script>
<style scoped>
.text-reveal-section { position: relative; z-index: 0; height: 200vh; }
.sticky-wrap {
  position: sticky; top: 0;
  display: flex; align-items: center;
  min-height: 50vh;
  max-width: 1024px; margin: 0 auto;
  padding: 80px 32px;
}
.words {
  display: flex; flex-wrap: wrap;
  font-family: 'Instrument Serif', serif;
  font-weight: 400;
  font-size: clamp(28px, 4.5vw, 64px);
  line-height: 1.15;
  color: var(--text);
  letter-spacing: -0.02em;
}
.word-wrap { display: inline-flex; transition: opacity 0.2s linear; }
</style>
