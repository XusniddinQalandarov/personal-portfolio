<template>
  <div class="timeline">
    <div class="beam" aria-hidden="true" />
    <div class="items"><slot /></div>
  </div>
</template>

<style scoped>
.timeline { position: relative; padding-left: 36px; max-width: 920px; margin: 0 auto; }
.beam {
  position: absolute;
  left: 8px;
  top: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--glass-border) 12%, var(--glass-border) 88%, transparent);
  pointer-events: none;
}
.items { display: flex; flex-direction: column; gap: 64px; }
.timeline :deep(.timeline-item) {
  position: relative;
  padding: 4px 0 8px 28px;
}
.timeline :deep(.timeline-item)::before {
  content: '';
  position: absolute;
  left: -33px;
  top: 14px;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--amber);
  box-shadow: 0 0 10px var(--amber);
}
.timeline :deep(.timeline-item .ti-period) {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--amber);
  margin-bottom: 10px;
  display: block;
}
.timeline :deep(.timeline-item .ti-title) {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 700;
  font-size: 28px;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 6px;
  color: var(--text);
}
.timeline :deep(.timeline-item .ti-org) {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 20px;
  color: var(--muted);
  margin-bottom: 18px;
}
.timeline :deep(.timeline-item .ti-desc) {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 300;
  font-size: 15px;
  line-height: 1.65;
  color: var(--muted);
  margin-bottom: 18px;
  max-width: 720px;
}
.timeline :deep(.timeline-item .ti-tech) {
  display: flex; flex-wrap: wrap; gap: 8px;
  margin-bottom: 18px;
}
.timeline :deep(.timeline-item .ti-tag) {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  border: 1px solid var(--glass-border);
  padding: 4px 10px;
  border-radius: 999px;
}
.timeline :deep(.timeline-item .ti-bullets) {
  margin: 0; padding-left: 0; list-style: none;
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 300;
  font-size: 14px;
  color: var(--muted);
  border-left: 1px solid var(--glass-border);
  padding-left: 18px;
}
.timeline :deep(.timeline-item .ti-bullets li) { margin-bottom: 6px; }
</style>
