<template>
  <div class="focus-cards" :class="{ 'has-hovered': hovered !== null }" @pointerleave="hovered = null">
    <slot :hovered="hovered" :setHovered="setHovered" />
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
const hovered = ref<number | null>(null)
const setHovered = (i: number | null) => { hovered.value = i }
provide('focus-cards-hovered', hovered)
provide('focus-cards-set-hovered', setHovered)
</script>

<style scoped>
.focus-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
@media (min-width: 720px) { .focus-cards { grid-template-columns: repeat(3, 1fr); gap: 32px; } }
</style>
