<template>
  <header class="page-hero">
    <AuroraEyebrow :text="eyebrow" />
    <h1 class="page-title">
      <span>{{ title }}</span>
      <em v-if="titleAccent"> {{ titleAccent }}</em>
    </h1>
    <p v-if="subtitle" class="page-sub">{{ subtitle }}</p>
  </header>
</template>

<script setup lang="ts">
import AuroraEyebrow from '~/components/aurora/type/AuroraEyebrow.vue'
defineProps<{ eyebrow: string; title: string; titleAccent?: string; subtitle?: string }>()
</script>

<style scoped>
.page-hero { padding: 160px 6vw 80px; max-width: 1400px; margin: 0 auto; }
.page-title {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(34px, 8vw, 120px);
  line-height: 0.95;
  letter-spacing: -0.04em;
  margin: 20px 0 28px;
  color: var(--text);
  overflow-wrap: break-word;
  hyphens: auto;
}
.page-title em {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-weight: 400;
  background: linear-gradient(120deg, var(--accent-primary, var(--amber)), var(--accent-secondary, var(--cyan)));
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
}
.page-sub {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(16px, 1.4vw, 20px);
  line-height: 1.6;
  color: var(--muted);
  max-width: 720px;
}
</style>
