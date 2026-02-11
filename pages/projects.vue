<template>
  <div class="min-h-screen py-24 px-4 md:px-0">
    <div class="max-w-7xl mx-auto">
      
      <!-- Minimalist Header -->
      <div ref="headerEl" class="mb-24 text-center md:text-left border-b border-gray-200 dark:border-white/10 pb-12 opacity-0">
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-main uppercase mb-6 leading-none">
          {{ $t('projects.title1') }}<br>{{ $t('projects.title2') }}
        </h1>
        <p class="text-xl text-sub font-light max-w-2xl">
          {{ $t('projects.subtitle') }}
        </p>
      </div>

      <!-- Filter Tags (Minimalist Pill) -->
      <div ref="tagsEl" class="flex flex-wrap gap-4 mb-20 opacity-0">
        <button
          v-for="tag in filterTags"
          :key="tag"
          @click="selectedFilter = tag"
          class="px-6 py-2 rounded-full border text-sm uppercase tracking-widest transition-all duration-300"
          :class="selectedFilter === tag 
            ? 'bg-main text-charcoal border-main' 
            : 'bg-transparent text-sub border-gray-300 dark:border-white/20 hover:border-main hover:text-main'"
        >
          {{ tag === 'All' ? $t('projects.all') : tag }}
        </button>
      </div>

      <!-- Projects List (Editorial) -->
      <div v-if="loading" class="text-center py-32">
        <div class="inline-block w-2 h-2 bg-main rounded-full animate-ping"></div>
      </div>

      <div v-else-if="!filteredProjects.length" class="text-center py-32 text-sub uppercase tracking-widest">
        {{ $t('projects.noProjects') }}
      </div>

      <div ref="listEl" v-else class="space-y-32">
        <div 
          v-for="(project, index) in filteredProjects" 
          :key="project.id"
          class="project-item group relative opacity-0"
        >
          <div class="flex flex-col md:flex-row gap-12 md:gap-24 items-start">
            
            <!-- Project Image (Large) -->
            <div class="w-full md:w-3/5 overflow-hidden rounded-lg aspect-video relative cursor-pointer" @click="openProjectModal(project)">
              <div class="absolute inset-0 bg-gray-200 dark:bg-white/5 animate-pulse" v-if="!imageLoaded[project.id]"></div>
              <img 
                :src="project.image_url || '/images/project-placeholder.jpg'" 
                :alt="project.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                @load="imageLoaded[project.id] = true"
              />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span class="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {{ $t('projects.viewCaseStudy') }}
                </span>
              </div>
            </div>

            <!-- Project Details -->
            <div class="w-full md:w-2/5 flex flex-col justify-center h-full pt-4">
              <div class="text-xs font-mono text-blue-500 uppercase tracking-widest mb-4">
                0{{ index + 1 }} — {{ project.category }}
              </div>
              
              <h2 class="text-4xl md:text-5xl font-bold text-main mb-6 leading-tight group-hover:text-blue-500 transition-colors cursor-pointer" @click="openProjectModal(project)">
                {{ localField(project, 'title') }}
              </h2>
              
              <p class="text-lg text-sub font-light leading-relaxed mb-8 line-clamp-3">
                {{ localField(project, 'description') }}
              </p>

              <!-- Tech Stack -->
              <div class="flex flex-wrap gap-2 mb-8">
                <span v-for="tech in project.technologies?.slice(0, 4)" :key="tech" class="text-xs font-mono text-sub border border-gray-200 dark:border-white/10 px-3 py-1 rounded-full uppercase">
                  {{ tech }}
                </span>
              </div>

              <!-- Links -->
              <div class="flex items-center gap-6">
                 <a v-if="project.demo_url" :href="project.demo_url" target="_blank" class="text-main font-bold uppercase tracking-widest text-sm hover:text-blue-500 transition-colors flex items-center gap-2">
                   {{ $t('projects.liveDemo') }} <i class="pi pi-arrow-up-right"></i>
                 </a>
                 <a v-if="project.github_url" :href="project.github_url" target="_blank" class="text-sub font-bold uppercase tracking-widest text-sm hover:text-white transition-colors flex items-center gap-2">
                   {{ $t('projects.github') }} <i class="pi pi-github"></i>
                 </a>
              </div>
            </div>

          </div>
        </div>
      </div>
      
    </div>

    <!-- Project Modal (Reusing existing component structure) -->
    <ProjectModal 
      v-if="selectedProject"
      :isOpen="isModalOpen" 
      :project="selectedProject" 
      @close="closeProjectModal"
    />
  </div>
</template>

<script setup>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const { t } = useI18n()
const { localField } = useLocalizedContent()

const projects = ref([]);
const loading = ref(true);
const selectedFilter = ref('All');
const imageLoaded = ref({});

// Modal state
const isModalOpen = ref(false);
const selectedProject = ref(null);

const headerEl = ref(null);
const tagsEl = ref(null);
const listEl = ref(null);

// Fetch Data
onMounted(async () => {
  try {
    loading.value = true;
    const response = await $fetch('/api/projects');
    if (response?.data) {
      projects.value = response.data;
    } else if (Array.isArray(response)) {
      projects.value = response;
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
    nextTick(() => initAnimations());
  }
});

const filterTags = computed(() => ['All', ...new Set(projects.value.map(p => p.category))]);

const filteredProjects = computed(() => {
  if (selectedFilter.value === 'All') return projects.value;
  return projects.value.filter(p => p.category === selectedFilter.value);
});

const openProjectModal = (project) => {
  selectedProject.value = project;
  isModalOpen.value = true;
};

const closeProjectModal = () => {
  isModalOpen.value = false;
  selectedProject.value = null;
};

const initAnimations = () => {
  const tl = gsap.timeline();
  tl.fromTo(headerEl.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
    .fromTo(tagsEl.value, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6');

  const items = document.querySelectorAll('.project-item');
  items.forEach((item) => {
    gsap.fromTo(item, 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
        }
      }
    );
  });
};

useSeoMeta({
  title: () => t('projects.seoTitle'),
  description: () => t('projects.seoDescription')
})
</script>

<style scoped>
.bg-main {
  background-color: var(--color-text-primary);
}
.text-charcoal {
  color: var(--color-bg-primary);
}
</style>