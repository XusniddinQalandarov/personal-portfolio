<template>
  <div class="min-h-screen py-20 px-4 md:px-0">
    <div class="max-w-5xl mx-auto">
      
      <!-- Minimalist Header -->
      <div ref="headerEl" class="mb-24 px-4 md:px-0 opacity-0">
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-main opacity-90">
          {{ $t('experience.title') }}
        </h1>
        <p class="text-xl md:text-2xl font-light text-sub max-w-2xl leading-relaxed">
          {{ $t('experience.subtitle') }}
        </p>
      </div>

      <!-- Minimalist Timeline -->
      <div ref="timelineEl" class="relative pl-8 md:pl-0">
        <!-- Vertical Line (Desktop Centered, Mobile Left) -->
        <div class="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-white/20 to-transparent"></div>

        <div v-for="(experience, index) in experiences" :key="experience.id" 
             class="group relative mb-24 md:mb-32 flex flex-col md:flex-row w-full opacity-0"
             :class="index % 2 === 0 ? 'md:flex-row-reverse' : ''">
          
          <!-- Timeline Dot -->
          <div class="absolute left-[-4.5px] md:left-1/2 md:-ml-[5px] top-2 w-2.5 h-2.5 bg-blue-500 rounded-full z-10 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>

          <!-- Spacer for Desktop -->
          <div class="hidden md:block md:w-1/2"></div>
          
          <!-- Content Side -->
          <div class="md:w-1/2 pl-8 md:px-12 relative">
            
            <!-- Period -->
            <span class="inline-block text-sm font-mono text-blue-500 mb-2 tracking-widest uppercase opacity-80">
              {{ experience.period }}
            </span>

            <!-- Title & Company -->
            <h2 class="text-3xl md:text-4xl font-bold text-main mb-1 group-hover:text-blue-500 transition-colors duration-300">
              {{ localField(experience, 'title') }}
            </h2>
            <h3 class="text-xl text-sub font-medium mb-6">{{ localField(experience, 'company') }}</h3>

            <!-- Description -->
            <p class="text-lg text-sub font-light leading-relaxed mb-6">
              {{ localField(experience, 'description') }}
            </p>

            <!-- Tech Stack (Minimal) -->
            <div class="flex flex-wrap gap-x-6 gap-y-2 mb-6">
              <span v-for="tech in experience.technologies" :key="tech" 
                    class="text-sm font-mono text-gray-500 dark:text-gray-400 group-hover:text-main transition-colors">
                #{{ tech }}
              </span>
            </div>

            <!-- Achievements (Bulleted, Minimal) -->
            <ul v-if="localAchievements(experience).length" class="space-y-2 border-l border-gray-300 dark:border-white/10 pl-6">
              <li v-for="ach in localAchievements(experience)" :key="ach" class="text-sub text-sm leading-relaxed">
                {{ ach }}
              </li>
            </ul>

          </div>
        </div>
      </div>

      <!-- Education Section (List Style) -->
      <div class="mt-32 px-4 md:px-0">
        <h2 class="text-4xl md:text-5xl font-black text-main mb-16 tracking-tight">{{ $t('experience.educationTitle') }}</h2>
        <div class="grid gap-12 border-t border-gray-200 dark:border-white/10 pt-12">
          <div v-for="edu in educationList" :key="edu.id" class="grid md:grid-cols-12 gap-6 group hover:bg-gray-100 dark:hover:bg-gray-800 p-6 rounded-lg transition-colors -mx-6">
            <div class="md:col-span-3 text-sub font-mono text-sm">{{ edu.year }}</div>
            <div class="md:col-span-9">
              <h3 class="text-2xl font-bold text-main mb-2 group-hover:text-blue-500 transition-colors">{{ localField(edu, 'degree') }}</h3>
              <div class="text-xl text-sub mb-4">{{ localField(edu, 'school') }}</div>
              <p class="text-sub font-light">{{ localField(edu, 'description') }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const { t } = useI18n()
const { localField, locale } = useLocalizedContent()

// Helper for arrays (achievements)
const localAchievements = (item) => {
  if (locale.value === 'ru' && item.achievements_ru && item.achievements_ru.length) {
    return item.achievements_ru
  }
  return item.achievements || []
}

// Data with bilingual support
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
]);

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
]);

const headerEl = ref(null);
const timelineEl = ref(null);

onMounted(() => {
  if (process.client) {
    // Header Animation
    gsap.fromTo(headerEl.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" });

    // Timeline Items Animation
    const items = timelineEl.value.querySelectorAll('.group');
    items.forEach((item, i) => {
      gsap.fromTo(item, 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }
});

useSeoMeta({
  title: () => t('experience.seoTitle'),
  description: () => t('experience.seoDescription')
})
</script>

<style scoped>
.text-main { color: var(--color-text-primary); }
.text-sub { color: var(--color-text-secondary); }
.bg-primary { background-color: var(--color-bg-primary); }
</style>