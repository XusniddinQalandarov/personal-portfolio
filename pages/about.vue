<template>
  <article class="about-page">

    <!-- Hero -->
    <AuroraPageHero
      :eyebrow="$t('aurora.cursor.about')"
      :title="`${$t('about.title1')} ${$t('about.title2')}`"
      :title-accent="$t('about.title3')"
    />

    <!-- Rotating role subtitle -->
    <BlurFade :delay="0.1" class="role-rotate-wrap section">
      <span class="role-prefix">{{ $t('about.introHeading').split(' ')[0] }} — </span>
      <WordRotate
        :words="[$t('about.roleWeb'), $t('about.roleMobile'), $t('about.roleAI'), $t('about.roleTeacher')]"
        class="role-word"
      />
    </BlurFade>

    <!-- Stats row -->
    <BlurFade :delay="0.15" class="section stats-strip">
      <div class="stat-block">
        <div class="stat-row">
          <NumberTicker :value="yearsOfExperience" class="stat-num" />
          <span class="stat-suf">+</span>
        </div>
        <div class="stat-label">{{ $t('about.yearsExperience') }}</div>
      </div>
      <div class="stat-sep" />
      <div class="stat-block">
        <div class="stat-row">
          <NumberTicker :value="30" class="stat-num" />
          <span class="stat-suf">+</span>
        </div>
        <div class="stat-label">{{ $t('about.projectsShipped') }}</div>
      </div>
    </BlurFade>

    <!-- Intro text with TextReveal -->
    <BlurFade :delay="0.2" class="section">
      <TextReveal :text="$t('about.introP1') + ' ' + $t('about.introP2')" />
    </BlurFade>

    <!-- Quote card -->
    <BlurFade :delay="0.1" class="section">
      <TextRevealCard :text="$t('about.quote')" :reveal-text="$t('about.quoteAuthor')" />
    </BlurFade>

    <!-- Tech stack — interactive icon grid -->
    <BlurFade :delay="0.1" class="section">
      <div class="section-label">Stack</div>
      <div class="tech-grid">
        <MagicCard
          v-for="tech in techStack"
          :key="tech.name"
          class="tech-card"
        >
          <img v-if="tech.icon" :src="tech.icon" :alt="tech.name" class="tech-icon" />
          <span v-else class="tech-initial">{{ tech.name[0] }}</span>
          <span class="tech-name">{{ tech.name }}</span>
        </MagicCard>
      </div>
    </BlurFade>

    <!-- Beyond IDE — interests bento -->
    <BlurFade :delay="0.1" class="section">
      <div class="section-label">{{ $t('about.beyondIde') }}</div>
      <AuroraBento :cols="2">
        <div v-for="(item, i) in interests" :key="item.key" class="tile interest-tile">
          <span class="interest-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="interest-text">{{ $t(item.key) }}</span>
        </div>
      </AuroraBento>
    </BlurFade>

    <!-- Marquee — scrolling tech names -->
    <BlurFade :delay="0.1" class="section marquee-section">
      <Marquee :pause-on-hover="true" :duration="32">
        <span v-for="tech in techStrip" :key="tech" class="tech-pill">{{ tech }}</span>
      </Marquee>
    </BlurFade>

    <!-- Mission card -->
    <BlurFade :delay="0.1" class="section mission">
      <MagicCard mode="orb" class="mission-card">
        <h3 class="mission-title">{{ $t('about.missionTitle') }}</h3>
        <p class="body">{{ $t('about.missionText') }}</p>
      </MagicCard>
    </BlurFade>

  </article>
</template>

<script setup>
definePageMeta({ layout: 'aurora' })
import AuroraPageHero from '~/components/aurora/layout/AuroraPageHero.vue'
import AuroraBento from '~/components/aurora/surface/AuroraBento.vue'
import MagicCard from '~/components/aurora/surface/MagicCard.vue'
import BlurFade from '~/components/aurora/surface/BlurFade.vue'
import Marquee from '~/components/aurora/layout/Marquee.vue'
import NumberTicker from '~/components/aurora/type/NumberTicker.vue'
import TextReveal from '~/components/aurora/type/TextReveal.vue'
import TextRevealCard from '~/components/aurora/surface/TextRevealCard.vue'
import WordRotate from '~/components/aurora/type/WordRotate.vue'

const { t } = useI18n()
const yearsOfExperience = computed(() => new Date().getFullYear() - 2023)

const interests = [
  { key: 'about.interest1' },
  { key: 'about.interest2' },
  { key: 'about.interest3' },
  { key: 'about.interest4' },
]

const techStack = [
  { name: 'Vue',        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
  { name: 'Nuxt',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg' },
  { name: 'Angular',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'React',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Next.js',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name: 'Node.js',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'Python',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'Supabase',   icon: null },
  { name: 'Tailwind',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'GSAP',       icon: null },
  { name: 'OpenAI',     icon: null },
]

const techStrip = ['Vue', 'Nuxt', 'TypeScript', 'Tailwind', 'GSAP', 'Three.js', 'Supabase', 'PostgreSQL', 'Node.js', 'Python', 'OpenAI', 'Angular', 'RxJS', 'Expo', 'Firebase']

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
  margin: 0 auto 8px;
}

/* Role rotate */
.role-rotate-wrap {
  padding-top: 0;
  padding-bottom: 8px;
}
.role-prefix {
  font-family: 'Geist Mono', monospace;
  font-size: 13px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
}
.role-word {
  font-family: 'Geist Mono', monospace;
  font-size: 13px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--amber);
}

/* Stats strip */
.stats-strip {
  display: flex;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  padding-top: 24px;
  padding-bottom: 40px;
}
.stat-block { display: flex; flex-direction: column; align-items: flex-start; }
.stat-row { display: flex; align-items: baseline; gap: 2px; }
.stat-num {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(48px, 6vw, 72px);
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--text);
}
.stat-suf {
  font-weight: 800;
  font-size: clamp(32px, 4vw, 48px);
  color: var(--amber);
  letter-spacing: -0.04em;
}
.stat-label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--muted);
  margin-top: 6px;
}
.stat-sep {
  width: 1px;
  height: 56px;
  background: var(--glass-border);
  flex-shrink: 0;
}

/* Tech grid */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 18px;
}
.tech-card {
  cursor: none;
}
.tech-card :deep(.card-content) {
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-height: 88px;
  justify-content: center;
}
.tech-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: grayscale(0.3);
  transition: filter 0.3s;
}
.tech-card:hover .tech-icon { filter: grayscale(0); }
.tech-initial {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Geist Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: var(--amber);
}
.tech-name {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  text-align: center;
}

/* Section label */
.section-label {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 18px;
}

/* Interests bento */
.interest-tile {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 20px 24px;
}
.interest-num {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--amber);
  flex-shrink: 0;
}
.interest-text {
  font-weight: 300;
  font-size: 15px;
  color: var(--text);
}

/* Marquee */
.marquee-section { padding-top: 16px; padding-bottom: 16px; }
.tech-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 18px;
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

/* Mission */
.mission { border-top: 1px dashed var(--glass-border); padding-top: 56px; }
.mission-card { padding: 0; }
.mission-title {
  font-weight: 700;
  font-size: 22px;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 16px;
}
.body {
  font-weight: 300;
  font-size: 16px;
  line-height: 1.7;
  color: var(--muted);
  max-width: 640px;
}
</style>
