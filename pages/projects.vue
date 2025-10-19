<template>
  <div class="min-h-screen py-20">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl text-white font-bold mb-6">Pioneering Projects &amp; Innovations</h1>
        <p class="text-xl text-[#BDC1CAFF] max-w-2xl mx-auto">
A curated selection of my work in Frontend Development, AI Automation, and inspired by a disciplined lifestyle. Each project reflects a commitment to precision and impactful solutions.        </p>
      </div>

      <!-- Filter Tags -->
      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <button
          v-for="tag in filterTags"
          :key="tag"
          @click="selectedFilter = tag"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedFilter === tag
              ? 'bg-white text-black'
              : 'bg-transparent text-white border border-white rounded-[50%]'
          ]"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <p class="text-gray-400 mt-4">Loading projects...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 text-lg">{{ error }}</p>
      </div>

      <!-- Projects Grid -->
      <div v-else>
        <!-- Show grid if there are projects -->
        <div v-if="projects.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <ProjectCard 
            v-for="project in filteredProjects" 
            :key="project.id"
            :project="project"
            :detailed="true"
          />
        </div>
        
        <!-- Empty State - No projects at all -->
        <div v-if="projects.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg mb-2">No projects found.</p>
        </div>
        
        <!-- Empty State - Filter has no results -->
        <div v-else-if="filteredProjects.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg mb-2">No projects found for the selected filter.</p>
          <button 
            @click="selectedFilter = 'All'"
            class="btn-primary mt-4"
          >
            View All Projects
          </button>
        </div>
      </div>

      <!-- GitHub Link -->
      <div class="text-center">
        <p class="text-[#BDC1CAFF] mb-4">
          Want to see more of my work?
        </p>
        <NuxtLink
          href="https://github.com/XusniddinQalandarov" 
          target="_blank"
          class="btn-primary inline-flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
          </svg>
          View GitHub Profile
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const projects = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedFilter = ref('All');

// Load projects from database
onMounted(async () => {
  try {
    loading.value = true;
    const response = await $fetch('/api/projects');
    
    // Handle response format { success: true, data: [...] }
    if (response && typeof response === 'object' && 'data' in response) {
      projects.value = Array.isArray(response.data) ? response.data : [];
    } else if (Array.isArray(response)) {
      projects.value = response;
    } else {
      projects.value = [];
    }
  } catch (err) {
    console.error('Failed to load projects:', err);
    error.value = 'Failed to load projects. Please try again later.';
    projects.value = []; // Ensure it's an array even on error
  } finally {
    loading.value = false;
  }
});

const filterTags = computed(() => {
  if (!Array.isArray(projects.value)) {
    return ['All'];
  }
  const tags = ['All'];
  const categories = [...new Set(projects.value.map(p => p.category))];
  return tags.concat(categories);
});

const filteredProjects = computed(() => {
  if (!Array.isArray(projects.value)) {
    return [];
  }
  if (selectedFilter.value === 'All') {
    return projects.value;
  }
  return projects.value.filter(project => project.category === selectedFilter.value);
});

// SEO Meta
useSeoMeta({
  title: 'Projects - Xusniddin Qalandarov',
  ogTitle: 'Projects - Xusniddin Qalandarov',
  description: 'A collection of projects that showcase my skills and passion for creating digital solutions.',
  ogDescription: 'A collection of projects that showcase my skills and passion for creating digital solutions.',
})
</script>