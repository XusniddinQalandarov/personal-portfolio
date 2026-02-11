<template>
  <div class="min-h-screen py-24 px-4 md:px-0 transition-colors duration-300">
    
    <!-- Loading State -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 text-center py-20">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 text-center py-20">
      <h1 class="text-3xl font-bold mb-4">{{ $t('blogs.blogNotFound') }}</h1>
      <p class="text-sub mb-8">{{ $t('blogs.blogNotFoundDesc') }}</p>
      <NuxtLink to="/blogs" class="inline-flex items-center gap-2 text-blue-500 font-bold uppercase tracking-widest hover:underline">
        <i class="pi pi-arrow-left"></i> {{ $t('blogs.backToBlogs') }}
      </NuxtLink>
    </div>

    <!-- Blog Content -->
    <article v-else-if="blog" class="max-w-4xl mx-auto px-4 md:px-0">
      
      <!-- Back Link -->
      <NuxtLink
        to="/blogs"
        class="inline-flex items-center gap-2 text-xs font-mono text-sub uppercase tracking-widest hover:text-main mb-12 transition-colors opacity-0 back-link"
      >
        <i class="pi pi-arrow-left"></i> {{ $t('blogs.backToInsights') }}
      </NuxtLink>

      <!-- Header -->
      <header class="mb-16 text-center md:text-left opacity-0 blog-header">
        <div class="flex flex-wrap items-center gap-4 justify-center md:justify-start text-xs font-mono text-blue-500 uppercase tracking-widest mb-6">
          <span>{{ formatDate(blog.created_at) }}</span>
          <span v-if="blog.tags && blog.tags.length" class="w-1 h-1 bg-blue-500 rounded-full"></span>
          <span v-if="blog.tags && blog.tags.length">{{ blog.tags[0] }}</span>
        </div>

        <h1 class="text-4xl md:text-6xl font-black tracking-tight text-main mb-8 leading-tight">
          {{ localField(blog, 'title') }}
        </h1>
        
        <!-- Tags -->
        <div class="flex flex-wrap gap-2 justify-center md:justify-start">
          <span
            v-for="tag in blog.tags"
            :key="tag"
            class="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-mono uppercase tracking-wide text-sub"
          >
            #{{ tag }}
          </span>
        </div>
      </header>

      <!-- Featured Image (Constrained Height) -->
      <div v-if="blog.image_url" class="rounded-xl overflow-hidden mb-16 shadow-2xl opacity-0 blog-image group relative">
        <div class="absolute inset-0 bg-blue-500/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500"></div>
        <img
          :src="blog.image_url"
          :alt="blog.title"
          class="w-full h-64 md:h-[450px] object-contain hover:scale-105 transition-transform duration-700"
        />
      </div>

      <!-- Content -->
      <div v-html="renderedContent" class="blog-content text-lg md:text-xl text-sub font-light leading-relaxed mb-16 opacity-0"></div>

      <!-- Share & Footer -->
      <div class="border-t border-gray-200 dark:border-white/10 pt-12 mt-12">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div class="text-center md:text-left">
            <h3 class="text-sm font-bold uppercase tracking-widest text-main mb-2">{{ $t('blogs.shareArticle') }}</h3>
            <div class="flex gap-4">
              <a :href="shareUrls.twitter" target="_blank" class="text-sub hover:text-blue-400 transition-colors"><i class="pi pi-twitter text-xl"></i></a>
              <a :href="shareUrls.linkedin" target="_blank" class="text-sub hover:text-blue-700 transition-colors"><i class="pi pi-linkedin text-xl"></i></a>
              <button @click="copyLink" class="text-sub hover:text-main transition-colors">
                <i :class="linkCopied ? 'pi pi-check text-green-500' : 'pi pi-link'" class="text-xl"></i>
              </button>
            </div>
          </div>

          <NuxtLink to="/blogs" class="btn-primary px-8 py-3 rounded-full border border-gray-200 dark:border-white/20 hover:border-main transition-colors text-sm font-bold uppercase tracking-widest">
            {{ $t('blogs.readMore') }}
          </NuxtLink>

        </div>
      </div>

    </article>
  </div>
</template>

<script setup>
import { gsap } from 'gsap';
const { isDark } = useTheme();
const { locale } = useI18n()
const { localField } = useLocalizedContent()
const route = useRoute()
const slug = route.params.slug

const loading = ref(true)
const error = ref(false)
const blog = ref(null)
const linkCopied = ref(false)

onMounted(async () => {
  await loadBlog()
})

const loadBlog = async () => {
  try {
    loading.value = true
    error.value = false
    const { data } = await $fetch(`/api/blog/${slug}`).catch(() => ({ data: null }))
    
    if (!data) {
        if (slug === 'future-ai-agents') {
            blog.value = {
                title: "The Future of AI Agents in Web Development",
                content: "Artificial Intelligence is rapidly evolving from simple chatbots to autonomous agents capable of complex reasoning and task execution. In the realm of web development, this shift promises to revolutionize how we build, deploy, and maintain applications.\n\n### The Rise of Autonomous Coding\n\nTools like GitHub Copilot were just the beginning. The next generation of AI, often referred to as 'Agentic AI', can understand entire codebases, plan multi-step refactors, and even fix bugs autonomously. This isn't just about writing code faster; it's about shifting the developer's role from 'writer' to 'architect' and 'reviewer'.\n\n> \"The future developer will spend less time typing syntax and more time designing systems.\"\n\n### What This Means for You\n\n1. **Shift in Skills**: Problem-solving and system design become more valuable than rote syntax memorization.\n2. **Productivity Boost**: Mundane tasks like writing boilerplate, tests, and documentation can be offloaded.\n3. **New Possibilities**: Solo developers can now build complex, enterprise-grade applications that previously required large teams.\n\nEmbracing these tools is not optional; it's the new standard.",
                created_at: new Date().toISOString(),
                tags: ["AI", "Future", "WebDev"],
                image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
            }
        }
    } else {
        blog.value = data
    }

  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
    nextTick(() => {
      setTimeout(() => initAnimations(), 300);
    });
  }
}

const initAnimations = () => {
    if (!process.client) return;
    const tl = gsap.timeline();
    tl.fromTo('.back-link', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' })
      .fromTo('.blog-header', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.8')
      .fromTo('.blog-image', { y: 50, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, '-=0.8')
      .fromTo('.blog-content', { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power3.out' }, '-=1.0');
}

const renderedContent = computed(() => {
  if (!blog.value) return ''
  const content = localField(blog.value, 'content')
  if (!content) return ''
  let html = content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/> "(.*?)"/gim, '<blockquote>$1</blockquote>')
    .replace(/\n/gim, '<br>')
  return html
})

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
        setTimeout(() => linkCopied.value = false, 2000)
    } catch (e) { console.error(e) }
}

const formatDate = (date) => new Date(date).toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })

useSeoMeta({
  title: () => blog.value?.title,
  description: () => blog.value?.excerpt
})
</script>

<style>
/* Unscoped for v-html content */
.blog-content h2, .blog-content h3 {
    color: var(--color-text-primary);
    font-weight: 800;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    line-height: 1.2;
}
.blog-content h2 { font-size: 2rem; }
.blog-content h3 { font-size: 1.5rem; }
.blog-content p { margin-bottom: 1.5rem; }
.blog-content strong { color: var(--color-text-primary); font-weight: 700; }
.blog-content blockquote {
    border-left: 4px solid #3b82f6;
    padding-left: 1.5rem;
    font-size: 1.5rem;
    font-style: italic;
    color: var(--color-text-primary);
    margin: 3rem 0;
}
.blog-content a { color: #3b82f6; text-decoration: underline; }
.bg-primary { background-color: var(--color-bg-primary); }
.text-main { color: var(--color-text-primary); }
.text-sub { color: var(--color-text-secondary); }
</style>
