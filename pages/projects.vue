<template>
  <div class="min-h-screen py-12 md:py-20 projects-container">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div ref="headerEl" class="text-center mb-12 md:mb-16">
        <h1
          :class="[
            'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6',
            isDark ? 'text-white' : 'text-gray-900'
          ]"
        >
          Pioneering Projects &amp; Innovations
        </h1>
        <p
          :class="[
            'text-base md:text-lg lg:text-xl max-w-2xl mx-auto',
            isDark ? 'text-[#BDC1CAFF]' : 'text-gray-600'
          ]"
        >
          A curated selection of my work in Frontend Development, AI Automation, and inspired by a disciplined lifestyle. Each project reflects a commitment to precision and impactful solutions.
        </p>
      </div>

      <!-- Filter Tags -->
      <div ref="tagsEl" class="flex flex-wrap justify-center gap-3 mb-12">
        <button
          v-for="tag in filterTags"
          :key="tag"
          @click="selectedFilter = tag"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedFilter === tag
              ? (isDark ? 'bg-white text-black' : 'bg-gray-900 text-white')
              : (isDark
                  ? 'bg-transparent text-white border border-white'
                  : 'bg-transparent text-gray-900 border border-gray-900 hover:bg-gray-100')
          ]"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div
          :class="[
            'inline-block animate-spin rounded-full h-12 w-12 border-b-2',
            isDark ? 'border-white' : 'border-gray-900'
          ]"
        ></div>
        <p
          :class="[
            'mt-4',
            isDark ? 'text-gray-400' : 'text-gray-600'
          ]"
        >
          Loading projects...
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 text-lg">{{ error }}</p>
      </div>

      <!-- Projects Grid -->
      <div v-else>
        <!-- Show grid if there are projects -->
        <div v-if="projects.length > 0" ref="gridEl" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <ProjectCard 
            v-for="project in filteredProjects" 
            :key="project.id"
            :project="project"
            :detailed="true"
            @openProject="openProjectModal"
          />
        </div>
        
        <!-- Empty State - No projects at all -->
        <div v-if="projects.length === 0" class="text-center py-12">
          <p
            :class="[
              'text-lg mb-2',
              isDark ? 'text-gray-500' : 'text-gray-600'
            ]"
          >
            No projects found.
          </p>
        </div>

        <!-- Empty State - Filter has no results -->
        <div v-else-if="filteredProjects.length === 0" class="text-center py-12">
          <p
            :class="[
              'text-lg mb-2',
              isDark ? 'text-gray-500' : 'text-gray-600'
            ]"
          >
            No projects found for the selected filter.
          </p>
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
        <p
          :class="[
            'mb-4',
            isDark ? 'text-[#BDC1CAFF]' : 'text-gray-600'
          ]"
        >
          Want to see more of my work?
        </p>
        <NuxtLink
          href="https://github.com/XusniddinQalandarov"
          target="_blank"
          class="btn-primary inline-flex items-center gap-2 px-4 py-2"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
          </svg>
          View GitHub Profile
        </NuxtLink>
      </div>
    </div>
    
    <!-- Project Modal -->
    <ProjectModal 
      v-if="selectedProject"
      :isOpen="isModalOpen" 
      :project="selectedProject" 
      @close="closeProjectModal"
    />
  </div>
</template>

<script setup>
// Theme composable
const { isDark } = useTheme();

const projects = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedFilter = ref('All');

// Modal state
const isModalOpen = ref(false);
const selectedProject = ref(null);

// Template refs
const headerEl = ref(null);
const tagsEl = ref(null);
const gridEl = ref(null);

// Animation state
const isAnimating = ref(false);
let animationContext = {
  headerAnimation: null,
  tagsAnimation: null,
  gridAnimation: null,
  scrollTrigger: null
};

// Clean animation function
const cleanupAnimations = () => {
  // Kill specific animations
  if (animationContext.headerAnimation) animationContext.headerAnimation.kill();
  if (animationContext.tagsAnimation) animationContext.tagsAnimation.kill();
  if (animationContext.gridAnimation) animationContext.gridAnimation.kill();
  if (animationContext.scrollTrigger) animationContext.scrollTrigger.kill();
  
  // Reset context
  animationContext = {
    headerAnimation: null,
    tagsAnimation: null,
    gridAnimation: null,
    scrollTrigger: null
  };
  
  isAnimating.value = false;
};

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
    
    // Only animate on client side and after proper DOM mounting
    if (process.client) {
      await nextTick();
      requestAnimationFrame(() => {
        initializeAnimations();
      });
    }
    
    // Fallback: ensure content is visible even if animations fail
    setTimeout(() => {
      if (headerEl.value) headerEl.value.style.opacity = '1';
      if (tagsEl.value) tagsEl.value.style.opacity = '1';
      if (gridEl.value) gridEl.value.style.opacity = '1';
    }, 100);
  }
});

// Cleanup on unmount
onUnmounted(() => {
  // Clear timeout
  if (filterTimeout) {
    clearTimeout(filterTimeout);
    filterTimeout = null;
  }
  
  // Clean up animations
  cleanupAnimations();
});

// Initialize animations only once on mount
const initializeAnimations = async () => {
  if (isAnimating.value || !process.client) return;
  
  // Verify all elements exist
  if (!headerEl.value || !tagsEl.value || !gridEl.value) {
    console.warn('Animation elements not ready');
    return;
  }
  
  try {
    // Ensure GSAP is available
    const { gsap } = await import('gsap');
    
    isAnimating.value = true;
    
    // Clean up any existing animations first
    cleanupAnimations();
    
    // Make sure elements are visible first (set to default state)
    gsap.set([headerEl.value, tagsEl.value.children, gridEl.value.children], {
      opacity: 1,
      scale: 1,
      y: 0
    });
    
    // Header animation - start from hidden state
    gsap.set(headerEl.value, { opacity: 0, y: -30 });
    animationContext.headerAnimation = gsap.to(headerEl.value, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
    });
    
    // Tags animation - start from hidden state
    const tagElements = tagsEl.value.children;
    if (tagElements.length > 0) {
      gsap.set(tagElements, { opacity: 0, y: 20 });
      animationContext.tagsAnimation = gsap.to(tagElements, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3,
      });
    }
    
    // Grid animation - start from hidden state
    const gridElements = gridEl.value.children;
    if (gridElements.length > 0) {
      gsap.set(gridElements, { opacity: 0, y: 50 });
      animationContext.gridAnimation = gsap.to(gridElements, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.5,
      });
    }
    
  } catch (error) {
    console.error('Animation error:', error);
    // Fallback: ensure elements are visible if animation fails
    if (headerEl.value) headerEl.value.style.opacity = '1';
    if (tagsEl.value) tagsEl.value.style.opacity = '1';
    if (gridEl.value) gridEl.value.style.opacity = '1';
  } finally {
    isAnimating.value = false;
  }
};

// Simple filter animation
const animateFilterChange = async () => {
  if (isAnimating.value || !process.client) return;
  
  const gridElements = gridEl.value?.children;
  if (!gridElements || gridElements.length === 0) return;
  
  try {
    const { gsap } = await import('gsap');
    
    isAnimating.value = true;
    
    // Kill existing grid animation
    if (animationContext.gridAnimation) {
      animationContext.gridAnimation.kill();
    }
    
    // Ensure elements are visible first, then animate from a slightly scaled/faded state
    gsap.set(gridElements, { 
      opacity: 1,  // Make sure they're visible
      scale: 0.95, 
      y: 10
    });
    
    animationContext.gridAnimation = gsap.to(gridElements, {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power2.out',
    });
    
  } catch (error) {
    console.error('Filter animation error:', error);
    // Fallback: ensure elements are visible
    if (gridElements) {
      Array.from(gridElements).forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  } finally {
    isAnimating.value = false;
  }
};

// Watch for filter changes with debounce
let filterTimeout = null;
watch(selectedFilter, () => {
  if (filterTimeout) {
    clearTimeout(filterTimeout);
  }
  
  filterTimeout = setTimeout(async () => {
    await nextTick(); // Wait for DOM updates
    
    if (process.client) {
      requestAnimationFrame(() => {
        animateFilterChange();
      });
    }
  }, 150);
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

// Modal functions
const openProjectModal = (project) => {
  selectedProject.value = project;
  isModalOpen.value = true;
};

const closeProjectModal = () => {
  isModalOpen.value = false;
  selectedProject.value = null;
};

// SEO Meta
useSeoMeta({
  title: 'Projects - Xusniddin Qalandarov',
  ogTitle: 'Projects - Xusniddin Qalandarov',
  description: 'A collection of projects that showcase my skills and passion for creating digital solutions.',
  ogDescription: 'A collection of projects that showcase my skills and passion for creating digital solutions.',
})
</script>

<style scoped>
/* Ensure elements are visible by default - GSAP animations enhance but don't break */
.projects-container {
  opacity: 1;
  transform: none;
}

/* Fallback visibility for critical elements */
[ref="headerEl"],
[ref="tagsEl"], 
[ref="gridEl"] {
  opacity: 1 !important;
  transform: none !important;
}

/* Smooth transitions for filter changes */
.project-card {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
</style>