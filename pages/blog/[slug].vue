<template>
  <div class="min-h-screen py-20">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 text-center py-20">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      <p class="text-main mt-4">Loading blog...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 text-center py-20">
      <i class="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
      <h1 class="text-3xl text-main font-bold mb-4">Blog Not Found</h1>
      <p class="text-sub mb-8">The blog post you're looking for doesn't exist.</p>
      <NuxtLink to="/blogs" class="btn-primary inline-block px-6 py-3">
        Back to Blogs
      </NuxtLink>
    </div>

    <!-- Blog Content -->
    <article v-else-if="blog" class="max-w-4xl mx-auto px-4">
      <!-- Back Button -->
      <NuxtLink
        to="/blogs"
        class="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
      >
        <i class="pi pi-arrow-left"></i>
        Back to Blogs
      </NuxtLink>

      <!-- Header -->
      <header class="mb-12 glass-panel p-6 md:p-8">
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-main font-bold mb-6">
          {{ blog.title }}
        </h1>
        
        <!-- Meta -->
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
          <span class="flex items-center gap-2">
            <i class="pi pi-calendar"></i>
            {{ formatDate(blog.created_at) }}
          </span>
          <span class="flex items-center gap-2">
            <i class="pi pi-eye"></i>
            {{ blog.views || 0 }} views
          </span>
          <span v-if="blog.updated_at && blog.updated_at !== blog.created_at" class="flex items-center gap-2">
            <i class="pi pi-refresh"></i>
            Updated {{ formatDate(blog.updated_at) }}
          </span>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in blog.tags"
            :key="tag"
            class="px-3 py-1 bg-cyan-400/10 text-cyan-400 rounded-full text-sm border border-cyan-400/30"
          >
            {{ tag }}
          </span>
        </div>
      </header>

      <!-- Featured Image -->
      <div v-if="blog.image_url" class="rounded-lg overflow-hidden mb-12 mx-auto max-w-2xl">
        <img
          :src="blog.image_url"
          :alt="blog.title"
          class="w-full h-auto rounded-lg"
        />
      </div>

      <!-- Excerpt -->
      <div v-if="blog.excerpt" class="glass-panel p-4 md:p-6 mb-8 md:mb-12">
        <p class="text-lg md:text-xl text-sub leading-relaxed italic">
          {{ blog.excerpt }}
        </p>
      </div>

      <!-- Content -->
      <div class="glass-panel p-4 md:p-8 mb-8 md:mb-12">
        <div v-html="renderedContent" class="blog-content"></div>
      </div>

      <!-- Share Buttons -->
      <div class="glass-panel p-4 md:p-8 mb-8 md:mb-12">
        <h3 class="text-lg md:text-xl text-main font-semibold mb-4">Share this post</h3>
        <div class="flex flex-wrap gap-3 md:gap-4">
          <a
            :href="shareUrls.twitter"
            target="_blank"
            rel="noopener noreferrer"
            class="px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-transparent border border-white text-main rounded-full hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-all duration-300"
          >
            <i class="pi pi-twitter mr-2"></i>
            Twitter
          </a>
          <a
            :href="shareUrls.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-transparent border border-white text-main rounded-full hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-all duration-300"
          >
            <i class="pi pi-linkedin mr-2"></i>
            LinkedIn
          </a>
          <button
            @click="copyLink"
            class="px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-transparent border border-white text-main rounded-full hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-all duration-300"
          >
            <i class="pi pi-link mr-2"></i>
            {{ linkCopied ? 'Copied!' : 'Copy Link' }}
          </button>
        </div>
      </div>

      <!-- Related Tags -->
      <div v-if="blog.tags?.length" class="glass-panel p-4 md:p-8">
        <h3 class="text-lg md:text-xl text-main font-semibold mb-4">Explore more topics</h3>
        <div class="flex flex-wrap gap-2 md:gap-3">
          <NuxtLink
            v-for="tag in blog.tags"
            :key="tag"
            :to="`/blogs?tag=${tag}`"
            class="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-transparent border border-white text-main rounded-full hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-all duration-300"
          >
            {{ tag }}
          </NuxtLink>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
const route = useRoute()
const slug = route.params.slug

const loading = ref(true)
const error = ref(false)
const blog = ref(null)
const linkCopied = ref(false)

// Load blog on mount
onMounted(async () => {
  await loadBlog()
})

const loadBlog = async () => {
  try {
    loading.value = true
    error.value = false
    
    const { data } = await $fetch(`/api/blog/${slug}`)
    blog.value = data
    
  } catch (err) {
    console.error('Failed to load blog:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// Render markdown content (client-side only)
const renderedContent = computed(() => {
  if (!blog.value?.content) return ''
  
  // Simple markdown rendering without external library
  let html = blog.value.content
  
  // Convert headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  
  // Convert bold and italic
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>')
  
  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
  
  // Convert line breaks
  html = html.replace(/\n/gim, '<br>')
  
  return html
})

// Share URLs (client-side only)
const shareUrls = computed(() => {
  if (!blog.value || !process.client) return {}
  
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(blog.value.title)
  
  return {
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  }
})

const copyLink = async () => {
  if (!process.client) return
  
  try {
    await navigator.clipboard.writeText(window.location.href)
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// SEO Meta
useSeoMeta({
  title: () => blog.value?.title || 'Blog Post',
  description: () => blog.value?.excerpt || 'Read this blog post',
  ogTitle: () => blog.value?.title,
  ogDescription: () => blog.value?.excerpt,
  ogImage: () => blog.value?.image_url,
  twitterCard: 'summary_large_image'
})
</script>

<style scoped>
.blog-content {
  color: var(--text-primary);
  line-height: 1.8;
  font-size: 1.125rem;
}

.blog-content :deep(h1) {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  margin-top: 2.5rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.blog-content :deep(h2) {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  margin-top: 2rem;
}

.blog-content :deep(h3) {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
}

.blog-content :deep(p) {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.8;
}

.blog-content :deep(a) {
  color: var(--color-cyan);
  text-decoration: underline;
  transition: color 0.3s;
}

.blog-content :deep(a:hover) {
  color: var(--color-violet);
}

.blog-content :deep(ul),
.blog-content :deep(ol) {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  margin-left: 2rem;
}

.blog-content :deep(li) {
  margin-bottom: 0.75rem;
  line-height: 1.8;
}

.blog-content :deep(code) {
  background: var(--bg-panel);
  color: var(--color-cyan);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-family: 'Monaco', 'Courier New', monospace;
  border: 1px solid var(--border-color);
}

.blog-content :deep(pre) {
  background: var(--bg-panel);
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  border: 1px solid var(--border-color);
}

.blog-content :deep(pre code) {
  background: transparent;
  padding: 0;
  border: none;
}

.blog-content :deep(blockquote) {
  border-left: 4px solid var(--color-cyan);
  padding-left: 1.5rem;
  font-style: italic;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  background: var(--bg-panel);
  padding: 1rem 1.5rem;
  border-radius: 0 0.5rem 0.5rem 0;
}

.blog-content :deep(img) {
  border-radius: 0.5rem;
  margin: 2rem 0;
  width: 100%;
  height: auto;
}

.blog-content :deep(table) {
  width: 100%;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
}

.blog-content :deep(th) {
  background: var(--bg-panel);
  color: var(--text-primary);
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  font-weight: 600;
}

.blog-content :deep(td) {
  color: var(--text-secondary);
  padding: 0.75rem;
  border: 1px solid var(--border-color);
}

.blog-content :deep(strong) {
  color: var(--text-primary);
  font-weight: 600;
}

.blog-content :deep(em) {
  color: var(--color-cyan);
  font-style: italic;
}
</style>
