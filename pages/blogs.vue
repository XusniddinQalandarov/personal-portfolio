<template>
  <div class="min-h-screen py-24 px-4 md:px-0">
    <div class="max-w-5xl mx-auto">
      
      <!-- Minimalist Header -->
      <div ref="headerEl" class="mb-24 text-center md:text-left border-b border-gray-200 dark:border-white/10 pb-12 opacity-0">
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-main uppercase mb-6">
          Insights
        </h1>
        <p class="text-xl text-sub font-light max-w-2xl">
          Thoughts on code, design, and the future of web development.
        </p>
      </div>

      <!-- Search & Filter (Minimalist) -->
      <div ref="filtersEl" class="mb-20 flex flex-col md:flex-row gap-8 items-center justify-between opacity-0">
        <div class="relative w-full md:w-96">
          <input
            v-model="searchQuery"
            @input="searchBlogs"
            type="text"
            placeholder="SEARCH ARTICLES..."
            class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-3 text-lg text-main placeholder-sub focus:outline-none focus:border-blue-500 transition-colors uppercase tracking-widest"
          />
        </div>
        
        <div class="flex flex-wrap gap-4">
          <button
            v-for="tag in allTags"
            :key="tag"
            @click="toggleTag(tag)"
            class="text-sm font-mono uppercase tracking-wider transition-colors"
            :class="selectedTag === tag 
              ? 'text-blue-500 underline underline-offset-4' 
              : 'text-sub hover:text-main'"
          >
            #{{ tag }}
          </button>
        </div>
      </div>

      <!-- Blog List (Editorial Style) -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block w-2 h-2 bg-main rounded-full animate-ping"></div>
      </div>

      <div v-else-if="!filteredBlogs.length" class="text-center py-20 text-sub uppercase tracking-widest">
        No articles found
      </div>

      <div ref="listEl" v-else class="space-y-24">
        <div
          v-for="(blog, index) in filteredBlogs"
          :key="blog.id"
          class="blog-item group block cursor-pointer opacity-0"
          @click="navigateTo(`/blog/${blog.slug}`)"
        >
          <div class="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            
            <!-- Image (Parallax reveal on hover) -->
            <div class="w-full md:w-5/12 overflow-hidden aspect-[4/3] relative rounded-lg">
              <div v-if="blog.image_url" 
                   class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                   :style="{ backgroundImage: `url(${blog.image_url})` }">
              </div>
              <div v-else class="absolute inset-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-sub">
                <i class="pi pi-image text-4xl"></i>
              </div>
            </div>

            <!-- Content -->
            <div class="w-full md:w-7/12">
              <div class="flex items-center gap-4 text-xs font-mono text-blue-500 uppercase tracking-widest mb-4">
                <span>{{ formatDate(blog.created_at) }}</span>
                <span v-if="blog.tags && blog.tags.length" class="w-1 h-1 bg-blue-500 rounded-full"></span>
                <span v-if="blog.tags && blog.tags.length">{{ blog.tags[0] }}</span>
              </div>
              
              <h2 class="text-3xl md:text-5xl font-bold text-main mb-6 group-hover:text-blue-500 transition-colors leading-tight">
                {{ blog.title }}
              </h2>
              
              <p class="text-lg text-sub font-light leading-relaxed mb-8 line-clamp-3">
                {{ blog.excerpt }}
              </p>
              
              <div class="flex items-center text-main font-bold uppercase tracking-widest text-sm group-hover:translate-x-2 transition-transform">
                Read Article
                <i class="pi pi-arrow-right ml-3 text-blue-500"></i>
              </div>
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

const loading = ref(true)
const blogs = ref([])
const filteredBlogs = ref([])
const searchQuery = ref('')
const selectedTag = ref('')
const allTags = ref([])

const headerEl = ref(null)
const filtersEl = ref(null)
const listEl = ref(null)

onMounted(async () => {
  await loadBlogs()
  
  if (process.client) {
    setTimeout(() => {
      nextTick(() => {
        // Animations
        const tl = gsap.timeline();
        tl.fromTo(headerEl.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
          .fromTo(filtersEl.value, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5');

        // List Items
        const items = document.querySelectorAll('.blog-item');
        items.forEach((item, i) => {
          gsap.fromTo(item, 
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              scrollTrigger: {
                trigger: item,
                start: "top 90%",
              }
            }
          );
        });
      });
    }, 700);
  }
})

const loadBlogs = async () => {
  try {
    loading.value = true
    // Mock data if API fails or for dev
    // In real app, remove mock fallback if strict
    const { data } = await $fetch('/api/blogs').catch(() => ({ data: [] }))
    
    // Fallback Mock Data if empty (just for demo visibility)
    if (!data || !data.length) {
      blogs.value = [
        {
          id: 1,
          title: "The Future of AI Agents in Web Development",
          slug: "future-ai-agents",
          excerpt: "Exploring how autonomous agents like Devin and others are reshaping the landscape of frontend engineering.",
          created_at: new Date().toISOString(),
          tags: ["AI", "Future"],
          image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
        },
        {
          id: 2,
          title: "Mastering Tailwind CSS for Large Scale Apps",
          slug: "mastering-tailwind",
          excerpt: "Best practices for organizing utility classes and maintaining a consistent design system in enterprise applications.",
          created_at: new Date().toISOString(),
          tags: ["CSS", "Frontend"],
          image_url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159"
        }
      ]
    } else {
      blogs.value = data
    }

    filteredBlogs.value = blogs.value
    
    // Extract tags
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

const searchBlogs = () => {
  let results = blogs.value
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    results = results.filter(blog =>
      blog.title.toLowerCase().includes(query) ||
      blog.excerpt?.toLowerCase().includes(query)
    )
  }
  if (selectedTag.value) {
    results = results.filter(blog => blog.tags?.includes(selectedTag.value))
  }
  filteredBlogs.value = results
}

const toggleTag = (tag) => {
  selectedTag.value = selectedTag.value === tag ? '' : tag
  searchBlogs()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

useSeoMeta({
  title: 'Insights - Xusniddin Qalandarov',
  description: 'Thoughts on code and design.'
})
</script>

<style scoped>
.text-main {
  color: var(--color-text-primary);
}
.text-sub {
  color: var(--color-text-secondary);
}
.bg-main {
  background-color: var(--color-text-primary);
}
.placeholder-sub::placeholder {
  color: var(--color-text-muted);
}
</style>
