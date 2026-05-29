<template>
  <div data-aurora="grid" class="aurora-grid" aria-hidden="true" />
</template>

<style scoped>
.aurora-grid {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(to right, var(--line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--line) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 100% 80% at 50% 0%, #000 30%, transparent 95%);
  -webkit-mask-image: radial-gradient(ellipse 100% 80% at 50% 0%, #000 30%, transparent 95%);
}
</style>
