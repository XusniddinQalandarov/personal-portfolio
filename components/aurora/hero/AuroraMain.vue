<!-- components/aurora/hero/AuroraMain.vue
     The home hero composition. -->
<template>
  <section class="hero">
    <div class="hero-inner">
      <div class="eyebrow-wrap">
        <AuroraEyebrow :text="$t('aurora.eyebrow')" shine />
      </div>

      <h1 class="name-wrap">
        <TextHoverOutline :text="$t('aurora.name')" />
      </h1>

      <div class="surname">
        <AuroraText>{{ $t('aurora.surname') }}</AuroraText>
      </div>

      <TextGenerate
        class="subtitle"
        :text="$t('aurora.subtitle')"
        :base-delay="1.0"
        :stagger="0.045"
      />

      <div class="cta-row">
        <AuroraButton
          to="/projects"
          variant="primary"
          show-arrow
          :cursor-label="$t('aurora.cursor.view')"
        >{{ $t('aurora.viewWork') }}</AuroraButton>

        <AuroraButton
          to="/contact"
          variant="ghost"
          :cursor-label="$t('aurora.cursor.reachOut')"
        >{{ $t('aurora.getInTouch') }}</AuroraButton>
      </div>

      <div class="scroll-marker">
        <span class="line" />
        <span>{{ $t('aurora.scrollMarker') }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AuroraEyebrow from '~/components/aurora/type/AuroraEyebrow.vue'
import AuroraText from '~/components/aurora/type/AuroraText.vue'
import TextHoverOutline from '~/components/aurora/type/TextHoverOutline.vue'
import TextGenerate from '~/components/aurora/type/TextGenerate.vue'
import AuroraButton from '~/components/aurora/primitives/AuroraButton.vue'
</script>

<style scoped>
.hero {
  position: relative; z-index: 5;
  min-height: 100vh;
  display: flex; align-items: center;
  padding: 0 6vw;
}
.hero-inner { width: 100%; max-width: 1400px; }

.eyebrow-wrap {
  margin-bottom: 32px;
  opacity: 0;
  animation: fadeUp 0.9s var(--ease-cinematic) 0.3s forwards;
}
.name-wrap {
  opacity: 0;
  animation: fadeUp 1.2s var(--ease-cinematic) 0.5s forwards;
}
.surname {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(52px, 11vw, 180px);
  line-height: 0.88;
  letter-spacing: -0.02em;
  margin-top: -8px;
  margin-left: -4px;
  opacity: 0;
  animation: fadeUp 1.2s var(--ease-cinematic) 0.8s forwards;
}
.subtitle { margin-top: 36px; }
.cta-row {
  margin-top: 44px;
  display: flex; gap: 16px; flex-wrap: wrap; align-items: center;
  opacity: 0;
  animation: fadeUp 0.9s var(--ease-cinematic) 2.0s forwards;
}
.scroll-marker {
  position: absolute; bottom: 120px; left: 6vw;
  display: flex; align-items: center; gap: 14px;
  font-family: 'Geist Mono', monospace;
  font-size: 10px; font-weight: 500;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--muted);
  opacity: 0;
  animation: fadeUp 0.8s var(--ease-cinematic) 2.6s forwards;
}
.scroll-marker .line {
  width: 60px; height: 1px;
  background: linear-gradient(90deg, var(--muted), transparent);
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .eyebrow-wrap, .name-wrap, .surname, .cta-row, .scroll-marker {
    animation-duration: 0.001ms !important;
    opacity: 1;
  }
}
</style>
