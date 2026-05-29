<!-- components/aurora/type/TextGenerate.vue
     Port of aceternity/text-generate-effect. -->
<template>
  <p class="text-generate">
    <span
      v-for="(word, i) in words"
      :key="i"
      class="word"
      :style="{ animationDelay: `${baseDelay + i * stagger}s` }"
    >{{ word }}<span v-if="i < words.length - 1">&nbsp;</span></span>
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  text: string
  baseDelay?: number
  stagger?: number
}>(), {
  baseDelay: 0,
  stagger: 0.045,
})
const words = computed(() => props.text.split(/\s+/))
const baseDelay = computed(() => props.baseDelay)
const stagger = computed(() => props.stagger)
</script>

<style scoped>
.text-generate {
  font-family: 'Geist', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.65;
  color: var(--muted);
  font-weight: 300;
  max-width: 540px;
}
.word {
  opacity: 0;
  display: inline-block;
  filter: blur(8px);
  animation: blurIn 0.6s var(--ease-cinematic) forwards;
}
@keyframes blurIn { to { opacity: 1; filter: blur(0); } }
@media (prefers-reduced-motion: reduce) {
  .word { animation: none; opacity: 1; filter: none; }
}
</style>
