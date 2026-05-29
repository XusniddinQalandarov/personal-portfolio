<template>
  <div
    class="focus-card"
    :class="{ blurred: hovered !== null && hovered !== index }"
    @pointerenter="onEnter"
    @pointerleave="onLeave"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue'
const props = defineProps<{ index: number }>()
const hovered = inject<Ref<number | null>>('focus-cards-hovered')
const setHovered = inject<(i: number | null) => void>('focus-cards-set-hovered')
const onEnter = () => setHovered?.(props.index)
const onLeave = () => setHovered?.(null)
</script>

<style scoped>
.focus-card {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  transition: filter 0.4s var(--ease-cinematic), transform 0.4s var(--ease-cinematic);
  aspect-ratio: 3 / 4;
}
.focus-card.blurred {
  filter: blur(4px);
  transform: scale(0.98);
}
</style>
