<template>
  <article class="experience-page">
    <AuroraPageHero
      :eyebrow="$t('aurora.cursor.experience')"
      :title="$t('experience.title').toLowerCase()"
      :subtitle="$t('experience.subtitle')"
    />

    <!-- HyperText hero + NumberTicker years stat -->
    <section class="reveal hero-stat">
      <div class="hero-stat-inner">
        <div class="years-block">
          <NumberTicker :value="yearsOfExperience" class="years-num" />
          <span class="years-suffix">+</span>
          <div class="years-label">
            <HyperText text="YEARS BUILDING" :duration="700" :start-on-view="true" />
          </div>
        </div>
      </div>
    </section>

    <section ref="timelineSection" class="reveal">
      <AuroraTimeline :data="experiences.map(e => ({ title: e.period, slot: `entry-${e.id}` }))">
        <template v-for="e in experiences" :key="e.id" #[`entry-${e.id}`]>
          <h2 class="ti-title">{{ localField(e, 'title') }}</h2>
          <div class="ti-org">{{ localField(e, 'company') }}</div>
          <p class="ti-desc">{{ localField(e, 'description') }}</p>
          <div class="ti-tech">
            <span v-for="tech in e.technologies" :key="tech" class="ti-tag">{{ tech }}</span>
          </div>
          <ul v-if="localAchievements(e).length" class="ti-bullets">
            <li v-for="a in localAchievements(e)" :key="a">{{ a }}</li>
          </ul>
        </template>
      </AuroraTimeline>
    </section>

    <section ref="eduSection" class="reveal edu-section">
      <h2 class="edu-title">{{ $t('experience.educationTitle').toLowerCase() }}</h2>
      <AuroraBento :cols="1">
        <div v-for="edu in educationList" :key="edu.id" class="tile edu-item">
          <div class="edu-year">{{ edu.year }}</div>
          <h3 class="edu-degree">{{ localField(edu, 'degree') }}</h3>
          <div class="edu-school">{{ localField(edu, 'school') }}</div>
          <p class="edu-desc">{{ localField(edu, 'description') }}</p>
        </div>
      </AuroraBento>
    </section>
  </article>
</template>

<script setup>
definePageMeta({ layout: 'aurora' })
import { gsap } from 'gsap'
import AuroraPageHero from '~/components/aurora/layout/AuroraPageHero.vue'
import AuroraTimeline from '~/components/aurora/layout/AuroraTimeline.vue'
import AuroraBento from '~/components/aurora/surface/AuroraBento.vue'
import NumberTicker from '~/components/aurora/type/NumberTicker.vue'
import HyperText from '~/components/aurora/type/HyperText.vue'

const { t } = useI18n()
const { localField, locale } = useLocalizedContent()

const yearsOfExperience = computed(() => new Date().getFullYear() - 2023)

const localAchievements = (item) => {
  if (locale.value === 'ru' && item.achievements_ru?.length) return item.achievements_ru
  return item.achievements || []
}

const experiences = ref([
  {
    id: 1,
    title: "Frontend Developer",
    title_ru: "Фронтенд Разработчик",
    company: "UZINFOCOM",
    company_ru: "УЗИНФОКОМ",
    period: "May 2025 - Present",
    description: "Building responsive SPAs and improving UX across multiple projects. Developing interactive data visualization solutions and modernizing university websites.",
    description_ru: "Создание адаптивных SPA и улучшение UX в нескольких проектах. Разработка интерактивных решений для визуализации данных и модернизация университетских сайтов.",
    technologies: ["Angular 19", "Tailwind CSS", "ECharts", "RxJS"],
    achievements: [
      "Improved page load times by ~20%",
      "Built interactive SVG map of Uzbekistan",
      "Reduced manual reporting by 30%"
    ],
    achievements_ru: [
      "Улучшил время загрузки страниц на ~20%",
      "Создал интерактивную SVG-карту Узбекистана",
      "Сократил ручную отчётность на 30%"
    ]
  },
  {
    id: 2,
    title: "Mobile Developer",
    title_ru: "Мобильный Разработчик",
    company: "Startup",
    company_ru: "Стартап",
    period: "June 2025 - Present",
    description: "Developing a React Native Expo mobile app for stadium booking. Integrated push notifications and OTA updates.",
    description_ru: "Разработка мобильного приложения на React Native Expo для бронирования стадионов. Интеграция push-уведомлений и OTA-обновлений.",
    technologies: ["React Native", "Expo", "Firebase", "CodePush"],
    achievements: [
      "Integrated deep linking & OTA updates",
      "Optimized list rendering performance"
    ],
    achievements_ru: [
      "Интегрировал deep linking и OTA-обновления",
      "Оптимизировал производительность рендеринга списков"
    ]
  },
  {
    id: 3,
    title: "AI & Automation Developer",
    title_ru: "Разработчик ИИ и Автоматизации",
    company: "Independent",
    company_ru: "Независимый",
    period: "Dec 2024 - Present",
    description: "Developing intelligent automation tools and AI-powered applications for various clients.",
    description_ru: "Разработка интеллектуальных инструментов автоматизации и приложений на основе ИИ для различных клиентов.",
    technologies: ["Node.js", "OpenAI API", "Python", "Angular"],
    achievements: [
      "Built Content Creator Bot with auto-posting",
      "Developed Notifier Bot sold to US logistics co."
    ],
    achievements_ru: [
      "Создал бот для генерации контента с автопостингом",
      "Разработал бот-уведомитель, проданный логистической компании в США"
    ]
  },
  {
    id: 4,
    title: "IELTS Instructor",
    title_ru: "Преподаватель IELTS",
    company: "King's Academy",
    company_ru: "King's Academy",
    period: "Oct 2023 - Oct 2024",
    description: "Teaching English and IELTS preparation to 100+ students.",
    description_ru: "Преподавание английского языка и подготовка к IELTS для 100+ студентов.",
    technologies: ["Leadership", "Communication", "Planning"],
    achievements: [
      "+1.5 average band-score improvement",
      "85% pass rate for students"
    ],
    achievements_ru: [
      "Средний рост балла на +1.5",
      "85% студентов успешно сдали экзамен"
    ]
  },
  {
    id: 5,
    title: "Frontend Developer",
    title_ru: "Фронтенд Разработчик",
    company: "Selected Projects",
    company_ru: "Избранные проекты",
    period: "Dec 2024 - Apr 2025",
    description: "Developing various front-end applications including e-commerce platforms.",
    description_ru: "Разработка различных фронтенд-приложений, включая платформы электронной коммерции.",
    technologies: ["Angular", "GraphQL", "RxJS", "Material"],
    achievements: [
      "Built secure e-commerce platform",
      "Cut initial payload by 25%"
    ],
    achievements_ru: [
      "Создал защищённую платформу электронной коммерции",
      "Сократил начальную загрузку на 25%"
    ]
  }
])

const educationList = ref([
  {
    id: 1,
    degree: "B.Sc. Computer Science",
    degree_ru: "Бакалавр Информатики",
    school: "Presidential University, Tashkent",
    school_ru: "Президентский Университет, Ташкент",
    year: "Expected 2026",
    description: "Focus on Data Structures, Algorithms, and AI Agents.",
    description_ru: "Фокус на структурах данных, алгоритмах и ИИ-агентах."
  },
  {
    id: 2,
    degree: "High School Diploma",
    degree_ru: "Аттестат о среднем образовании",
    school: "Khiva Presidential School",
    school_ru: "Хивинская Президентская школа",
    year: "2022",
    description: "GPA: 4.92/5.00 | IELTS: 7.5 | SAT: 1270",
    description_ru: "Средний балл: 4.92/5.00 | IELTS: 7.5 | SAT: 1270"
  },
  {
    id: 3,
    degree: "Frontend Certification",
    degree_ru: "Сертификация по Фронтенд-разработке",
    school: "USTUDY",
    school_ru: "USTUDY",
    year: "2025",
    description: "Advanced modern web development practices.",
    description_ru: "Продвинутые практики современной веб-разработки."
  }
])

const timelineSection = ref(null)
const eduSection = ref(null)

onMounted(() => {
  if (typeof window === 'undefined') return
  const els = [timelineSection.value, eduSection.value].filter(Boolean)
  els.forEach((el, i) => {
    gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.15 * i })
  })
})

useSeoMeta({
  title: () => t('experience.seoTitle'),
  description: () => t('experience.seoDescription'),
})
</script>

<style scoped>
.experience-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 0 200px;
  font-family: 'Geist', system-ui, sans-serif;
  color: var(--text);
}
.reveal { opacity: 0; }

.hero-stat {
  padding: 48px 6vw 32px;
  max-width: 1200px;
  margin: 0 auto 24px;
}
.hero-stat-inner { display: flex; align-items: flex-end; gap: 48px; }
.years-block { display: flex; flex-direction: column; align-items: flex-start; }
.years-num {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(72px, 10vw, 120px);
  line-height: 1;
  letter-spacing: -0.05em;
  color: var(--text);
}
.years-suffix {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(48px, 6vw, 80px);
  line-height: 1;
  color: var(--amber);
  margin-left: 4px;
}
.years-label {
  margin-top: 8px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.28em;
  color: var(--muted);
}

.edu-section {
  max-width: 920px;
  margin: 96px auto 0;
  padding: 0 6vw;
}
.edu-title {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(36px, 5vw, 72px);
  line-height: 1;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  margin-bottom: 36px;
  color: var(--text);
}
.edu-item { display: grid; grid-template-columns: 140px 1fr; gap: 24px; align-items: baseline; }
@media (max-width: 720px) { .edu-item { grid-template-columns: 1fr; } }
.edu-year {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--amber);
}
.edu-degree {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
  color: var(--text);
}
.edu-school {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 18px;
  color: var(--muted);
  margin-bottom: 10px;
}
.edu-desc {
  font-weight: 300;
  font-size: 14px;
  line-height: 1.65;
  color: var(--muted);
}

/* Timeline entry content styles (page-specific) */
.ti-title {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 700;
  font-size: 28px;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 6px;
  color: var(--text);
}
.ti-org {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 20px;
  color: var(--muted);
  margin-bottom: 18px;
}
.ti-desc {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 300;
  font-size: 15px;
  line-height: 1.65;
  color: var(--muted);
  margin-bottom: 18px;
  max-width: 720px;
}
.ti-tech {
  display: flex; flex-wrap: wrap; gap: 8px;
  margin-bottom: 18px;
}
.ti-tag {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  border: 1px solid var(--glass-border);
  padding: 4px 10px;
  border-radius: 999px;
}
.ti-bullets {
  margin: 0; padding-left: 0; list-style: none;
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 300;
  font-size: 14px;
  color: var(--muted);
  border-left: 1px solid var(--glass-border);
  padding-left: 18px;
}
.ti-bullets li { margin-bottom: 6px; }
</style>
