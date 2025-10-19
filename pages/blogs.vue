<template>
  <div class="min-h-screen py-20">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl text-white font-bold mb-6">Blog & Insights</h1>
        <p class="text-xl text-[#BDC1CAFF] max-w-2xl mx-auto">
          Thoughts, tutorials, and insights on web development
        </p>
      </div>

      <!-- Search & Filter -->
      <div class="mb-12 flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            @input="searchBlogs"
            type="text"
            placeholder="Search blogs..."
            class="w-full px-4 py-3 bg-transparent text-white rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <select
            v-model="selectedTag"
            @change="filterByTag"
            class="w-full md:w-48 px-4 py-3 bg-transparent text-white rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="" class="bg-[#0A1128]">All Tags</option>
            <option v-for="tag in allTags" :key="tag" :value="tag" class="bg-[#0A1128]">
              {{ tag }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
        <p class="text-white mt-4">Loading blogs...</p>
      </div>

      <!-- No Blogs -->
      <div v-else-if="!filteredBlogs.length" class="text-center py-20">
        <i class="pi pi-inbox text-6xl text-gray-600 mb-4"></i>
        <p class="text-xl text-sub">No blogs found</p>
        <p class="text-sub mt-2">Check back later for new content!</p>
      </div>

      <!-- Blog Grid -->
      <div v-else class="grid md:grid-cols-2 gap-8">
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
            <h3 class="text-2xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors">
              {{ blog.title }}
            </h3>
            
            <p class="text-[#BDC1CAFF] text-sm mb-4 line-clamp-2 leading-relaxed">
              {{ blog.excerpt || 'Read more...' }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in blog.tags?.slice(0, 3)"
                :key="tag"
                class="px-3 py-1 bg-cyan-400/10 text-cyan-400 rounded-full text-xs border border-cyan-400/30"
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
        <h2 class="text-2xl text-white font-semibold mb-6 text-center">Popular Tags</h2>
        <div class="flex flex-wrap justify-center gap-3">
          <button
            v-for="tag in allTags"
            :key="tag"
            @click="selectedTag = tag; filterByTag()"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
              selectedTag === tag
                ? 'bg-white text-black'
                : 'bg-transparent text-white border border-white hover:border-cyan-400 hover:text-cyan-400'
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
const loading = ref(true)
const blogs = ref([])
const filteredBlogs = ref([])
const searchQuery = ref('')
const selectedTag = ref('')
const allTags = ref([])

// Load blogs on mount
onMounted(async () => {
  await loadBlogs()
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
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
