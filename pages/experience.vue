<template>
  <section class="experience-page">
    <ScrollProgress />
    <BackgroundBeams />

    <article class="experience-inner">

      <!-- Hero -->
      <AuroraPageHero
        :eyebrow="$t('aurora.cursor.experience')"
        :title="$t('experience.title').toLowerCase()"
        :subtitle="$t('experience.subtitle')"
      />

      <!-- ── Timeline ────────────────────────────────────── -->
      <div class="timeline-section">

        <!-- Scrolling beam line -->
        <div class="beam-track">
          <div ref="beamEl" class="beam-fill" />
        </div>

        <div
          v-for="(e, i) in experiences"
          :key="e.id"
          ref="entryRefs"
          class="tl-row"
          :class="{ 'is-visible': visibleSet.has(e.id) }"
        >
          <!-- Left: date -->
          <div class="tl-date">
            <span class="tl-period">{{ localField(e, 'period') }}</span>
            <span class="tl-domain">{{ localField(e, 'domain') }}</span>
          </div>

          <!-- Center: dot -->
          <div class="tl-spine">
            <div class="tl-dot" :class="{ featured: i === 0 }">
              <div class="tl-dot-inner" />
            </div>
          </div>

          <!-- Right: card -->
          <div class="tl-content">
            <MagicCard class="tl-card" :class="{ featured: i === 0 }">
              <BorderBeam v-if="i === 0" />
              <div class="tl-body">
                <div class="tl-header">
                  <div>
                    <h2 class="tl-title">{{ localField(e, 'title') }}</h2>
                    <div class="tl-org-row">
                      <AnimatedTooltip :items="companyTooltipItem(e)" />
                      <span class="tl-org">{{ localField(e, 'company') }}</span>
                    </div>
                  </div>
                </div>
                <p class="tl-desc">{{ localField(e, 'description') }}</p>
                <div class="tl-tags">
                  <span v-for="tech in e.technologies" :key="tech" class="tl-tag">{{ tech }}</span>
                </div>
                <ul v-if="localAchievements(e).length" class="tl-bullets">
                  <li v-for="a in localAchievements(e)" :key="a">{{ a }}</li>
                </ul>
              </div>
            </MagicCard>
          </div>
        </div>

      </div>

      <!-- ── Education ───────────────────────────────────── -->
      <section class="edu-section">
        <div class="section-eyebrow">
          <HyperText :text="$t('experience.educationTitle').toUpperCase()" :start-on-view="true" />
        </div>
        <div class="edu-grid">
          <MagicCard v-for="edu in educationList" :key="edu.id" class="edu-card">
            <div class="edu-body">
              <div class="edu-year">{{ localField(edu, 'year') }}</div>
              <h3 class="edu-degree">{{ localField(edu, 'degree') }}</h3>
              <div class="edu-school">{{ localField(edu, 'school') }}</div>
              <p class="edu-desc">{{ localField(edu, 'description') }}</p>
            </div>
          </MagicCard>
        </div>
        <div class="resume-row">
          <ShimmerButton href="/resume.pdf" target="_blank">{{ $t('experience.downloadResume') }}</ShimmerButton>
        </div>
      </section>

    </article>
  </section>
</template>

<script setup>
definePageMeta({ layout: 'aurora' })
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AuroraPageHero from '~/components/aurora/layout/AuroraPageHero.vue'
import MagicCard from '~/components/aurora/surface/MagicCard.vue'
import BorderBeam from '~/components/aurora/surface/BorderBeam.vue'
import AnimatedTooltip from '~/components/aurora/surface/AnimatedTooltip.vue'
import BackgroundBeams from '~/components/aurora/surface/BackgroundBeams.vue'
import ScrollProgress from '~/components/aurora/surface/ScrollProgress.vue'
import HyperText from '~/components/aurora/type/HyperText.vue'
import ShimmerButton from '~/components/aurora/primitives/ShimmerButton.vue'

const { t } = useI18n()
const { localField, locale } = useLocalizedContent()

const localAchievements = (item) => {
  if (locale.value === 'ru' && item.achievements_ru?.length) return item.achievements_ru
  return item.achievements || []
}

const companyTooltipItem = (e) => [{
  id: e.id,
  name: localField(e, 'company'),
  designation: e.period,
  image: 'https://api.dicebear.com/9.x/initials/svg?seed=' + encodeURIComponent(localField(e, 'company')),
}]

// ── Scroll beam + entry visibility ──────────────────────────
const beamEl = ref(null)
const entryRefs = ref([])
const visibleSet = ref(new Set())

let scrollHandler = null
let observers = []

onMounted(() => {
  // Beam fill on scroll
  scrollHandler = () => {
    if (!beamEl.value) return
    const section = beamEl.value.closest('.timeline-section')
    if (!section) return
    const { top, height } = section.getBoundingClientRect()
    const progress = Math.min(Math.max((-top) / (height - window.innerHeight), 0), 1)
    beamEl.value.style.height = `${progress * 100}%`
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })

  // Entry reveal via IntersectionObserver
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = Number(entry.target.dataset.entryId)
          visibleSet.value = new Set([...visibleSet.value, id])
        }
      })
    },
    { threshold: 0.15 }
  )
  nextTick(() => {
    entryRefs.value.forEach((el, i) => {
      if (el) {
        el.dataset.entryId = experiences.value[i]?.id
        io.observe(el)
      }
    })
  })
  observers.push(io)
})

onBeforeUnmount(() => {
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  observers.forEach(o => o.disconnect())
})

// ── Data ─────────────────────────────────────────────────────
const experiences = ref([
  {
    id: 1,
    title: 'Frontend Developer', title_ru: 'Фронтенд Разработчик',
    company: 'UZINFOCOM', company_ru: 'УЗИНФОКОМ',
    period: 'May 2025 – June 2026', period_ru: 'Май 2025 – Июнь 2026',
    domain: 'Full Stack', domain_ru: 'Фулл Стек',
    description: 'Building responsive SPAs and improving UX across multiple projects. Developing interactive data visualization solutions and modernizing university websites.',
    description_ru: 'Создание адаптивных SPA и улучшение UX в нескольких проектах. Разработка интерактивных решений для визуализации данных и модернизация университетских сайтов.',
    technologies: ['Angular 19', 'Tailwind CSS', 'ECharts', 'RxJS'],
    achievements: ['Improved page load times by ~20%', 'Built interactive SVG map of Uzbekistan', 'Reduced manual reporting by 30%'],
    achievements_ru: ['Улучшил время загрузки страниц на ~20%', 'Создал интерактивную SVG-карту Узбекистана', 'Сократил ручную отчётность на 30%'],
  },
  {
    id: 2,
    title: 'Mobile Developer', title_ru: 'Мобильный Разработчик',
    company: 'Startup', company_ru: 'Стартап',
    period: 'June 2025 – Present', period_ru: 'Июнь 2025 – наст. время',
    domain: 'Mobile', domain_ru: 'Мобильная',
    description: 'Developing a React Native Expo mobile app for stadium booking. Integrated push notifications and OTA updates.',
    description_ru: 'Разработка мобильного приложения на React Native Expo для бронирования стадионов.',
    technologies: ['React Native', 'Expo', 'Firebase', 'CodePush'],
    achievements: ['Integrated deep linking & OTA updates', 'Optimized list rendering performance'],
    achievements_ru: ['Интегрировал deep linking и OTA-обновления', 'Оптимизировал производительность рендеринга списков'],
  },
  {
    id: 3,
    title: 'AI & Automation Developer', title_ru: 'Разработчик ИИ и Автоматизации',
    company: 'Independent', company_ru: 'Независимый',
    period: 'Dec 2024 – Present', period_ru: 'Дек 2024 – наст. время',
    domain: 'AI / Automation', domain_ru: 'ИИ / Автоматизация',
    description: 'Developing intelligent automation tools and AI-powered applications for various clients.',
    description_ru: 'Разработка интеллектуальных инструментов автоматизации и приложений на основе ИИ.',
    technologies: ['Node.js', 'OpenAI API', 'Python', 'Angular'],
    achievements: ['Built Content Creator Bot with auto-posting', 'Developed Notifier Bot sold to US logistics co.'],
    achievements_ru: ['Создал бот для генерации контента с автопостингом', 'Разработал бот-уведомитель, проданный логистической компании в США'],
  },
  {
    id: 4,
    title: 'IELTS Instructor', title_ru: 'Преподаватель IELTS',
    company: "King's Academy", company_ru: "King's Academy",
    period: 'Oct 2023 – Oct 2024', period_ru: 'Окт 2023 – Окт 2024',
    domain: 'Teaching', domain_ru: 'Преподавание',
    description: 'Teaching English and IELTS preparation to 100+ students with structured study plans.',
    description_ru: 'Преподавание английского языка и подготовка к IELTS для 100+ студентов.',
    technologies: ['Leadership', 'Communication', 'Planning'],
    achievements: ['+1.5 average band-score improvement', '85% pass rate for students'],
    achievements_ru: ['Средний рост балла на +1.5', '85% студентов успешно сдали экзамен'],
  },
  {
    id: 5,
    title: 'Frontend Developer', title_ru: 'Фронтенд Разработчик',
    company: 'Selected Projects', company_ru: 'Избранные проекты',
    period: 'Dec 2024 – Apr 2025', period_ru: 'Дек 2024 – Апр 2025',
    domain: 'Frontend', domain_ru: 'Фронтенд',
    description: 'Developing various front-end applications including e-commerce platforms.',
    description_ru: 'Разработка различных фронтенд-приложений, включая платформы электронной коммерции.',
    technologies: ['Angular', 'GraphQL', 'RxJS', 'Material'],
    achievements: ['Built secure e-commerce platform', 'Cut initial payload by 25%'],
    achievements_ru: ['Создал защищённую платформу электронной коммерции', 'Сократил начальную загрузку на 25%'],
  },
])


const educationList = ref([
  {
    id: 1,
    degree: 'B.Sc. Computer Science', degree_ru: 'Бакалавр Информатики',
    school: 'Presidential University, Tashkent', school_ru: 'Президентский Университет, Ташкент',
    year: 'Expected 2026', year_ru: 'Ожид. 2026',
    description: 'Focus on Data Structures, Algorithms, and AI Agents.',
    description_ru: 'Фокус на структурах данных, алгоритмах и ИИ-агентах.',
  },
  {
    id: 2,
    degree: 'High School Diploma', degree_ru: 'Аттестат о среднем образовании',
    school: 'Khiva Presidential School', school_ru: 'Хивинская Президентская школа',
    year: '2022',
    description: 'GPA: 4.92/5.00 · IELTS: 7.5 · SAT: 1270',
    description_ru: 'Средний балл: 4.92/5.00 · IELTS: 7.5 · SAT: 1270',
  },
  {
    id: 3,
    degree: 'Frontend Certification', degree_ru: 'Сертификация по Фронтенд-разработке',
    school: 'USTUDY', school_ru: 'USTUDY',
    year: '2025',
    description: 'Advanced modern web development practices.',
    description_ru: 'Продвинутые практики современной веб-разработки.',
  },
])

useSeoMeta({
  title: () => t('experience.seoTitle'),
  description: () => t('experience.seoDescription'),
})
</script>

<style scoped>
/* ── Page shell ──────────────────────────────────────────────── */
.experience-page {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  overflow: hidden;
}
.experience-inner {
  position: relative;
  z-index: 2;
  padding-bottom: 220px;
  font-family: 'Geist', system-ui, sans-serif;
  color: var(--text);
}

/* ── Section label ───────────────────────────────────────────── */
.section-eyebrow {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 40px;
}

/* ═══════════════════════════════════════════════════════════════
   TIMELINE
═══════════════════════════════════════════════════════════════ */
.timeline-section {
  position: relative;
  padding: 0 6vw 80px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Vertical beam track */
.beam-track {
  position: absolute;
  left: calc(6vw + 220px); /* aligns with spine center */
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--glass-border);
}
.beam-fill {
  width: 100%;
  height: 0%;
  background: linear-gradient(to bottom, var(--amber), var(--magenta));
  transition: height 0.1s linear;
  box-shadow: 0 0 8px var(--amber);
}

/* Each timeline row */
.tl-row {
  display: grid;
  grid-template-columns: 200px 40px 1fr;
  gap: 0 0;
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1);
}
.tl-row.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Left: date column */
.tl-date {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 24px;
  padding-top: 22px;
  gap: 6px;
}
.tl-period {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--amber);
  text-align: right;
  line-height: 1.4;
}
.tl-domain {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  text-align: right;
}

/* Center: spine + dot */
.tl-spine {
  display: flex;
  justify-content: center;
  padding-top: 24px;
  position: relative;
}
.tl-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  background: var(--void);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.tl-dot.featured {
  border-color: var(--amber);
  box-shadow: 0 0 10px var(--amber);
}
.tl-row.is-visible .tl-dot {
  border-color: var(--amber);
}
.tl-dot-inner {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--amber);
  opacity: 0;
  transition: opacity 0.3s 0.2s;
}
.tl-row.is-visible .tl-dot-inner {
  opacity: 1;
}

/* Right: card */
.tl-content { padding-left: 24px; }
.tl-card { cursor: default; }
.tl-card :deep(.card-content) { padding: 0; }
.tl-card.featured :deep(.card-content) { padding: 0; }

.tl-body { padding: 24px; }

.tl-header { margin-bottom: 14px; }
.tl-title {
  font-weight: 700;
  font-size: 22px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 8px;
}
.tl-card.featured .tl-title { font-size: 26px; }

.tl-org-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.tl-org {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 17px;
  color: var(--muted);
}

.tl-desc {
  font-weight: 300;
  font-size: 14px;
  line-height: 1.65;
  color: var(--muted);
  margin-bottom: 16px;
}

.tl-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
.tl-tag {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 4px 9px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
}

.tl-bullets {
  margin: 0;
  padding: 0;
  list-style: none;
  border-left: 1px solid var(--glass-border);
  padding-left: 16px;
}
.tl-bullets li {
  font-weight: 300;
  font-size: 13px;
  line-height: 1.6;
  color: var(--muted);
  margin-bottom: 4px;
}
.tl-bullets li::before {
  content: '— ';
  color: var(--amber);
  opacity: 0.7;
}

/* Mobile: stack timeline */
@media (max-width: 720px) {
  .beam-track { display: none; }
  .tl-row { grid-template-columns: 32px 1fr; }
  .tl-date { display: none; }
  .tl-spine { padding-top: 22px; }
}

/* ═══════════════════════════════════════════════════════════════
   EDUCATION
═══════════════════════════════════════════════════════════════ */
.edu-section {
  padding: 80px 6vw 0;
  max-width: 1200px;
  margin: 0 auto;
  border-top: 1px solid var(--glass-border);
}
.edu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 40px;
}
@media (max-width: 900px) { .edu-grid { grid-template-columns: 1fr; } }

.edu-card :deep(.card-content) { padding: 0; }
.edu-body { padding: 24px; }
.edu-year {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--amber);
  margin-bottom: 12px;
}
.edu-degree {
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
  color: var(--text);
}
.edu-school {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 15px;
  color: var(--muted);
  margin-bottom: 10px;
}
.edu-desc {
  font-weight: 300;
  font-size: 13px;
  line-height: 1.6;
  color: var(--muted);
}
.resume-row {
  margin-top: 48px;
  display: flex;
  justify-content: flex-start;
}
</style>
