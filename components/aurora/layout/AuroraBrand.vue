<!-- components/aurora/layout/AuroraBrand.vue -->
<template>
  <NuxtLink to="/" class="brand" :data-cursor-label="$t('aurora.cursor.home')">
    x<span class="dot">·</span>q
  </NuxtLink>
</template>

<style scoped>
.brand {
  position: fixed; top: 28px; left: 32px;
  z-index: 50;
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 26px;
  letter-spacing: -0.02em;
  color: var(--text);
  text-decoration: none;
  cursor: none;
}
.brand .dot { color: var(--amber); margin: 0 4px; }
</style>
