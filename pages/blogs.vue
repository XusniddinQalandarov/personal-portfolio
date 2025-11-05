<template>
  <div class="min-h-screen py-12 md:py-20">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div ref="headerEl" class="text-center mb-12 md:mb-16">
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-main font-bold mb-6">Blog & Insights</h1>
        <p class="text-base md:text-lg lg:text-xl text-sub max-w-2xl mx-auto">
          Thoughts, tutorials, and insights on web development
        </p>
      </div>

      <!-- Search & Filter -->
      <div ref="filtersEl" class="mb-12 flex flex-col md:flex-row gap-4">
        <!-- Search Input -->
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i class="pi pi-search text-gray-400"></i>
          </div>
          <input
            v-model="searchQuery"
            @input="searchBlogs"
            type="text"
            placeholder="Search blogs..."
            class="w-full pl-12 pr-4 py-3 bg-charcoal text-main rounded-lg border border-white/10 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all placeholder-gray-400"
          />
        </div>
        
        <!-- Tag Selector -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i class="pi pi-tag text-gray-400"></i>
          </div>
          <select
            v-model="selectedTag"
            @change="filterByTag"
            class="w-full md:w-56 pl-12 pr-10 py-3 bg-charcoal text-main rounded-lg border border-white/10 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all appearance-none cursor-pointer"
          >
            <option value="" class="bg-charcoal text-main py-2">All Tags</option>
            <option v-for="tag in allTags" :key="tag" :value="tag" class="bg-charcoal text-main py-2">
              {{ tag }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <i class="pi pi-chevron-down text-gray-400 text-sm"></i>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
        <p class="text-main mt-4">Loading blogs...</p>
      </div>

      <!-- No Blogs -->
      <div v-else-if="!filteredBlogs.length" class="text-center py-20">
        <i class="pi pi-inbox text-6xl text-gray-600 mb-4"></i>
        <p class="text-xl text-sub">No blogs found</p>
        <p class="text-sub mt-2">Check back later for new content!</p>
      </div>

      <!-- Blog Grid -->
      <div ref="gridEl" v-else class="grid md:grid-cols-2 gap-8">
        <NuxtLink
          v-for="blog in filteredBlogs"
          :key="blog.id"
          :to="`/blog/${blog.slug}`"
          class="blog-card glass-panel group p-6"
        >
          <!-- Image -->
          <div class="relative overflow-hidden rounded-lg h-48 mb-4 bg-charcoal">
            <img
              v-if="blog.image_url"
              :src="blog.image_url"
              :alt="blog.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div v-else class="flex items-center justify-center h-full text-6xl">
              <i class="pi pi-file text-gray-600"></i>
            </div>
          </div>

          <!-- Content -->
          <div>
            <h3 class="text-2xl font-semibold text-main mb-3 group-hover:text-blue-400 transition-colors">
              {{ blog.title }}
            </h3>
            
            <p class="text-sub text-sm mb-4 line-clamp-2 leading-relaxed">
              {{ blog.excerpt || 'Read more...' }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in blog.tags?.slice(0, 3)"
                :key="tag"
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                  isDark
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30'
                    : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 hover:bg-blue-200'
                ]"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Meta -->
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <i class="pi pi-calendar"></i>
                {{ formatDate(blog.created_at) }}
              </span>
              <span class="flex items-center gap-1">
                <i class="pi pi-eye"></i>
                {{ blog.views || 0 }} views
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Popular Tags -->
      <div v-if="allTags.length" class="mt-16">
        <h2 class="text-2xl text-main font-semibold mb-6 text-center">Popular Tags</h2>
        <div class="flex flex-wrap justify-center gap-3">
          <button
            v-for="tag in allTags"
            :key="tag"
            @click="selectedTag = tag; filterByTag()"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
              selectedTag === tag
                ? 'bg-white text-black'
                : 'bg-transparent text-main border border-white hover:border-blue-400 hover:text-blue-400'
            ]"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Theme composable
const { isDark } = useTheme();

const loading = ref(true)
const blogs = ref([])
const filteredBlogs = ref([])
const searchQuery = ref('')
const selectedTag = ref('')
const allTags = ref([])

const headerEl = ref(null)
const filtersEl = ref(null)
const gridEl = ref(null)

// Load blogs on mount
onMounted(async () => {
  await loadBlogs()
  await animateBlogs()
})

const loadBlogs = async () => {
  try {
    loading.value = true
    const { data } = await $fetch('/api/blogs')
    blogs.value = data || []
    filteredBlogs.value = blogs.value
    
    // Extract all unique tags
    const tagsSet = new Set()
    blogs.value.forEach(blog => {
      blog.tags?.forEach(tag => tagsSet.add(tag))
    })
    allTags.value = Array.from(tagsSet).sort()
    
  } catch (error) {
    console.error('Failed to load blogs:', error)
  } finally {
    loading.value = false
  }
}

const animateBlogs = () => {
  // Set initial states
  gsap.set(headerEl.value, { y: -30, opacity: 0 })
  gsap.set(filtersEl.value, { y: 20, opacity: 0 })
  
  // Animate header to visible
  gsap.to(headerEl.value, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
  })
  
  // Animate filters to visible
  gsap.to(filtersEl.value, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    delay: 0.3,
    ease: 'power3.out',
  })
  
  // Animate blog cards with stagger
  if (gridEl.value) {
    const cards = gridEl.value.querySelectorAll('.blog-card')
    if (cards.length > 0) {
      // Set initial states for cards
      gsap.set(cards, { y: 30, opacity: 0 })
      
      gsap.to(cards, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridEl.value,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })
    }
  }
}

const searchBlogs = () => {
  let results = blogs.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    results = results.filter(blog =>
      blog.title.toLowerCase().includes(query) ||
      blog.excerpt?.toLowerCase().includes(query)
    )
  }

  // Filter by tag
  if (selectedTag.value) {
    results = results.filter(blog =>
      blog.tags?.includes(selectedTag.value)
    )
  }

  filteredBlogs.value = results
  
  // Re-animate grid after filter
  nextTick(() => {
    if (gridEl.value) {
      const cards = gridEl.value.querySelectorAll('.blog-card')
      if (cards.length > 0) {
        // Set initial states for filter animation
        gsap.set(cards, { scale: 0.9, opacity: 0 })
        
        gsap.to(cards, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: 'back.out(1.2)',
        })
      }
    }
  })
}

const filterByTag = () => {
  searchBlogs()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// SEO Meta
useSeoMeta({
  title: 'Blog - Latest Articles & Tutorials',
  description: 'Read my latest blog posts about web development, programming, and technology.',
  ogTitle: 'Blog - Latest Articles & Tutorials',
  ogDescription: 'Read my latest blog posts about web development, programming, and technology.'
})
</script>

<style scoped>
.blog-card {
  display: block;
  transition: all 0.3s ease;
}

.blog-card:hover {
  transform: translateY(-4px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
