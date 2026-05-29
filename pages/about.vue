<template>
  <article class="about-page">
    <AuroraPageHero
      :eyebrow="$t('aurora.cursor.about')"
      :title="`${$t('about.title1')} ${$t('about.title2')}`"
      :title-accent="$t('about.title3')"
    />

    <!-- Stats row with NumberTicker -->
    <section class="reveal section stats-row">
      <div class="stat-block">
        <NumberTicker :value="yearsOfExperience" class="stat-num" />
        <span class="stat-suffix">+</span>
        <div class="stat-label">{{ $t('about.yearsExperience') }}</div>
      </div>
      <div class="stat-block">
        <NumberTicker :value="10" class="stat-num" />
        <span class="stat-suffix">+</span>
        <div class="stat-label">{{ $t('about.projectsShipped') }}</div>
      </div>
    </section>

    <!-- Intro heading with HyperText scramble -->
    <section ref="introEl" class="reveal section">
      <div class="intro-grid">
        <div class="intro-text">
          <h2 class="intro-heading">
            <i18n-t keypath="about.introHeading">
              <template #precision><span class="accent">{{ $t('about.precision') }}</span></template>
              <template #purpose><span class="accent">{{ $t('about.purpose') }}</span></template>
            </i18n-t>
          </h2>
          <!-- HyperText scrambles the sub-label on hover -->
          <div class="hyper-label">
            <HyperText :text="$t('about.introP1').slice(0, 40)" :duration="600" :start-on-view="true" />
          </div>
        </div>
        <AuroraBento :cols="2" class="intro-stats">
          <div class="tile stat">
            <div class="stat-value">{{ yearsOfExperience }}+</div>
            <div class="stat-label">{{ $t('about.yearsExperience') }}</div>
          </div>
          <div class="tile stat">
            <div class="stat-value">10+</div>
            <div class="stat-label">{{ $t('about.projectsShipped') }}</div>
          </div>
        </AuroraBento>
      </div>
    </section>

    <!-- TextReveal: intro paragraphs scroll-fade word-by-word -->
    <TextReveal :text="$t('about.introP1') + ' ' + $t('about.introP2')" />

    <!-- Quote with TextRevealCard — sweep reveals author -->
    <section ref="quoteEl" class="reveal section">
      <TextRevealCard :text="$t('about.quote')" :reveal-text="$t('about.quoteAuthor')" />
    </section>

    <section ref="interestsEl" class="reveal section">
      <div class="section-label">{{ $t('about.beyondIde') }}</div>
      <AuroraBento :cols="2">
        <div v-for="item in interests" :key="item.key" class="tile interest">
          <span class="emoji">{{ item.emoji }}</span>
          <span class="interest-text">{{ $t(item.key) }}</span>
        </div>
      </AuroraBento>
    </section>

    <section class="reveal section">
      <div class="section-label">Tech stack</div>
      <Marquee :pause-on-hover="true" :duration="35">
        <span v-for="tech in techStrip" :key="tech" class="tech-pill">{{ tech }}</span>
      </Marquee>
    </section>

    <!-- Mission wrapped in MagicCard orb mode -->
    <section ref="missionEl" class="reveal section mission">
      <MagicCard mode="orb" class="mission-card">
        <h3 class="mission-title">{{ $t('about.missionTitle') }}</h3>
        <p class="body">{{ $t('about.missionText') }}</p>
      </MagicCard>
    </section>
  </article>
</template>

<script setup>
definePageMeta({ layout: 'aurora' })
import { gsap } from 'gsap'
import AuroraPageHero from '~/components/aurora/layout/AuroraPageHero.vue'
import AuroraBento from '~/components/aurora/surface/AuroraBento.vue'
import MagicCard from '~/components/aurora/surface/MagicCard.vue'
import Marquee from '~/components/aurora/layout/Marquee.vue'
import NumberTicker from '~/components/aurora/type/NumberTicker.vue'
import HyperText from '~/components/aurora/type/HyperText.vue'
import TextReveal from '~/components/aurora/type/TextReveal.vue'
import TextRevealCard from '~/components/aurora/surface/TextRevealCard.vue'

const { t } = useI18n()
const yearsOfExperience = computed(() => new Date().getFullYear() - 2023)

const introEl = ref(null)
const quoteEl = ref(null)
const interestsEl = ref(null)
const missionEl = ref(null)

const interests = [
  { emoji: '⚡', key: 'about.interest1' },
  { emoji: '📚', key: 'about.interest2' },
  { emoji: '🤖', key: 'about.interest3' },
  { emoji: '💡', key: 'about.interest4' },
]

const techStrip = ['Vue', 'Nuxt', 'TypeScript', 'Tailwind', 'GSAP', 'Three.js', 'Supabase', 'PostgreSQL', 'Node.js', 'Python', 'OpenAI', 'Angular']

onMounted(() => {
  if (typeof window === 'undefined') return
  const els = [introEl.value, quoteEl.value, interestsEl.value, missionEl.value].filter(Boolean)
  els.forEach((el, i) => {
    gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.15 * i })
  })
})

useSeoMeta({
  title: () => t('about.seoTitle'),
  description: () => t('about.seoDescription'),
})
</script>

<style scoped>
.about-page {
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 200px;
  font-family: 'Geist', system-ui, sans-serif;
  color: var(--text);
}
.section {
  padding: 32px 6vw;
  max-width: 1200px;
  margin: 0 auto 24px;
}
.reveal { opacity: 0; }

/* Stats row */
.stats-row {
  display: flex;
  gap: 64px;
  align-items: flex-start;
  padding-top: 48px;
}
.stat-block { display: flex; flex-direction: column; align-items: flex-start; }
.stat-num {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(56px, 7vw, 80px);
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--text);
}
.stat-suffix {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(40px, 5vw, 64px);
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--amber);
  margin-left: 2px;
}
.stat-label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--muted);
  margin-top: 8px;
}

.hyper-label {
  margin-bottom: 18px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--muted);
}

.intro-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 48px;
  align-items: start;
}
@media (max-width: 900px) { .intro-grid { grid-template-columns: 1fr; } }

.intro-heading {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 700;
  font-size: clamp(24px, 2.4vw, 34px);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
  color: var(--text);
}
.accent {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-weight: 400;
  background: linear-gradient(120deg, var(--amber), var(--magenta));
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.body {
  font-weight: 300;
  font-size: 16px;
  line-height: 1.7;
  color: var(--muted);
  margin-bottom: 16px;
  max-width: 640px;
}

.stat { text-align: left; }
.stat-value {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(40px, 4vw, 56px);
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--text);
  margin-bottom: 8px;
}

.section-label {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 18px;
}

.interest { display: flex; gap: 14px; align-items: center; }
.emoji { font-size: 22px; }
.interest-text {
  font-weight: 300;
  font-size: 15px;
  color: var(--text);
}

.tech-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
  background: var(--glass-bg);
}

.mission { border-top: 1px dashed var(--glass-border); padding-top: 56px; margin-top: 24px; }
.mission-card { padding: 0; }
.mission-title {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 16px;
}
</style>
