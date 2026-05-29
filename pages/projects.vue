<template>
  <article class="projects-page">
    <AuroraPageHero
      :eyebrow="$t('aurora.cursor.projects')"
      :title="$t('projects.title1').toLowerCase()"
      :title-accent="$t('projects.title2').toLowerCase()"
      :subtitle="$t('projects.subtitle')"
    />

    <!-- Filter pills -->
    <section ref="filterEl" class="filter-row reveal">
      <button
        v-for="tag in filterTags"
        :key="tag"
        class="pill"
        :class="{ active: selectedFilter === tag }"
        :data-cursor-label="tag === 'All' ? $t('projects.all') : tag"
        @click="selectedFilter = tag"
      >{{ tag === 'All' ? $t('projects.all') : tag }}</button>
    </section>

    <!-- Loading -->
    <div v-if="loading" class="state">
      <span class="dot-pulse" />
    </div>

    <!-- Empty -->
    <div v-else-if="!filteredProjects.length" class="state empty">
      {{ $t('projects.noProjects') }}
    </div>

    <!-- Grid -->
    <section v-else ref="gridEl" class="grid-wrap">
      <FocusCards>
        <FocusCard
          v-for="(project, i) in filteredProjects"
          :key="project.id"
          :index="i"
          class="focus-card-override"
        >
          <MagicCard
            class="project-card reveal-card"
            :class="{ featured: i === 0 }"
            data-cursor-card
            :data-cursor-label="$t('projects.viewCaseStudy')"
            @click="openProjectModal(project)"
          >
            <BorderBeam v-if="i === 0" />
            <div class="thumb">
              <img
                :src="project.image_url || '/images/project-placeholder.jpg'"
                :alt="project.title"
                @load="imageLoaded[project.id] = true"
              />
            </div>
            <div class="meta">
              <span class="index">{{ String(i + 1).padStart(2, '0') }} · {{ project.category }}</span>
              <span class="year" v-if="project.year">{{ project.year }}</span>
            </div>
            <h3 class="title">{{ localField(project, 'title') }}</h3>
            <p class="desc">{{ localField(project, 'description') }}</p>
            <div class="bottom">
              <div class="tags">
                <span v-for="tech in (project.technologies || []).slice(0, 3)" :key="tech" class="tag">{{ tech }}</span>
              </div>
              <span class="open-arrow" aria-hidden="true">↗</span>
            </div>
          </MagicCard>
        </FocusCard>
      </FocusCards>
    </section>

    <ProjectModal
      v-if="selectedProject"
      :isOpen="isModalOpen"
      :project="selectedProject"
      @close="closeProjectModal"
    />
  </article>
</template>

<script setup>
definePageMeta({ layout: 'aurora' })
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AuroraPageHero from '~/components/aurora/layout/AuroraPageHero.vue'
import MagicCard from '~/components/aurora/surface/MagicCard.vue'
import BorderBeam from '~/components/aurora/surface/BorderBeam.vue'
import FocusCards from '~/components/aurora/surface/FocusCards.vue'
import FocusCard from '~/components/aurora/surface/FocusCard.vue'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()
const { localField } = useLocalizedContent()

const projects = ref([])
const loading = ref(true)
const selectedFilter = ref('All')
const imageLoaded = ref({})

const isModalOpen = ref(false)
const selectedProject = ref(null)

const filterEl = ref(null)
const gridEl = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/projects').catch(() => null)
    if (response?.data) projects.value = response.data
    else if (Array.isArray(response)) projects.value = response
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
    nextTick(() => initAnimations())
  }
})

const filterTags = computed(() => ['All', ...new Set(projects.value.map(p => p.category).filter(Boolean))])
const filteredProjects = computed(() =>
  selectedFilter.value === 'All' ? projects.value : projects.value.filter(p => p.category === selectedFilter.value)
)

const openProjectModal = (p) => { selectedProject.value = p; isModalOpen.value = true }
const closeProjectModal = () => { isModalOpen.value = false; selectedProject.value = null }

function initAnimations() {
  if (typeof window === 'undefined') return
  if (filterEl.value) gsap.fromTo(filterEl.value, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
  document.querySelectorAll('.reveal-card').forEach((el) => {
    gsap.fromTo(el, { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    })
  })
}

useSeoMeta({
  title: () => t('projects.seoTitle'),
  description: () => t('projects.seoDescription'),
})
</script>

<style scoped>
.projects-page {
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 220px;
  font-family: 'Geist', system-ui, sans-serif;
  color: var(--text);
}

.filter-row {
  display: flex; flex-wrap: wrap; gap: 10px;
  padding: 0 6vw 56px;
  max-width: 1200px;
  margin: 0 auto;
  opacity: 0;
}
.pill {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
  background: transparent;
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  padding: 9px 18px;
  cursor: none;
  transition: all 0.3s var(--ease-cinematic);
}
.pill:hover { color: var(--text); border-color: rgba(255,255,255,0.18); }
.pill.active {
  background: var(--text);
  color: var(--void);
  border-color: var(--text);
}

.state {
  text-align: center;
  padding: 80px 0;
  font-family: 'Geist Mono', monospace;
  color: var(--muted);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-size: 11px;
}
.dot-pulse { display: inline-block; width: 8px; height: 8px; background: var(--amber); border-radius: 50%; animation: pulse 1.2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.2); } }

.grid-wrap {
  padding: 0 6vw;
  max-width: 1400px;
  margin: 0 auto;
}
.focus-card-override {
  /* Reset FocusCard's aspect-ratio so MagicCard controls height */
  aspect-ratio: unset !important;
  border-radius: 22px !important;
  background: transparent !important;
  border: none !important;
}
.project-card { cursor: none; }
.project-card :deep(.card-content) { padding: 0; }

.thumb {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 22px 22px 0 0;
  background: rgba(255,255,255,0.03);
  margin: -1px -1px 0;
}
.thumb img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.6s var(--ease-cinematic);
}
.project-card:hover .thumb img { transform: scale(1.04); }

.meta {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 24px 0;
}
.index, .year {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--amber);
}
.year { color: var(--muted); }

.title {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  padding: 12px 24px 8px;
  color: var(--text);
}
.desc {
  font-weight: 300;
  font-size: 14px;
  line-height: 1.6;
  color: var(--muted);
  padding: 0 24px 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.bottom {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 24px 24px;
}
.tags { display: flex; gap: 6px; flex-wrap: wrap; }
.tag {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 4px 9px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
}
.open-arrow {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  display: flex; align-items: center; justify-content: center;
  color: var(--muted);
  transition: all 0.3s var(--ease-cinematic);
}
.project-card:hover .open-arrow { border-color: var(--amber); color: var(--amber); transform: rotate(-45deg); }

.reveal-card { opacity: 0; }
</style>
