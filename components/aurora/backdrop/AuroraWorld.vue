<template>
  <div class="aurora-world">
    <AuroraGrid />
    <FlickerField />
    <AuroraBloom />
  </div>
</template>

<script setup lang="ts">
import AuroraGrid from './AuroraGrid.vue'
import FlickerField from './FlickerField.vue'
import AuroraBloom from './AuroraBloom.vue'
</script>

<style scoped>
.aurora-world {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>
