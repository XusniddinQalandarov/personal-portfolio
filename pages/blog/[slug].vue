<template>
  <article class="blog-detail-page">

    <!-- Loading -->
    <div v-if="loading" class="state">
      <span class="dot-pulse" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state error">
      <h1 class="error-title">{{ $t('blogs.blogNotFound') }}</h1>
      <p class="error-desc">{{ $t('blogs.blogNotFoundDesc') }}</p>
      <NuxtLink to="/blogs" class="back-link">
        <i class="pi pi-arrow-left" /> {{ $t('blogs.backToBlogs') }}
      </NuxtLink>
    </div>

    <!-- Content -->
    <div v-else-if="blog" class="detail-wrap">

      <!-- Back Link -->
      <NuxtLink to="/blogs" class="back-link back-anim">
        <i class="pi pi-arrow-left" /> {{ $t('blogs.backToInsights') }}
      </NuxtLink>

      <!-- Header -->
      <header class="blog-header header-anim">
        <div class="meta-row">
          <span class="date">{{ formatDate(blog.created_at) }}</span>
          <span v-if="blog.tags?.length" class="meta-sep">·</span>
          <span v-if="blog.tags?.length" class="topic">#{{ blog.tags[0] }}</span>
        </div>

        <h1 class="blog-title">{{ localField(blog, 'title') }}</h1>

        <div class="tags-row">
          <span v-for="tag in blog.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
      </header>

      <!-- Featured Image -->
      <div v-if="blog.image_url" class="blog-image image-anim">
        <img :src="blog.image_url" :alt="blog.title" />
      </div>

      <!-- Rendered Content -->
      <div v-html="renderedContent" class="blog-content content-anim" />

      <!-- Footer -->
      <footer class="blog-footer">
        <div class="share-section">
          <span class="share-label">{{ $t('blogs.shareArticle') }}</span>
          <div class="share-btns">
            <a :href="shareUrls.twitter" target="_blank" class="share-btn" aria-label="Share on Twitter">
              <i class="pi pi-twitter" />
            </a>
            <a :href="shareUrls.linkedin" target="_blank" class="share-btn" aria-label="Share on LinkedIn">
              <i class="pi pi-linkedin" />
            </a>
            <button @click="copyLink" class="share-btn" :aria-label="linkCopied ? 'Copied!' : 'Copy link'">
              <i :class="linkCopied ? 'pi pi-check' : 'pi pi-link'" :style="linkCopied ? { color: 'var(--cyan)' } : {}" />
            </button>
          </div>
        </div>
        <NuxtLink to="/blogs" class="read-more-btn">{{ $t('blogs.readMore') }} →</NuxtLink>
      </footer>

    </div>
  </article>
</template>

<script setup>
definePageMeta({ layout: 'aurora' })
import { gsap } from 'gsap'
import { marked } from 'marked'

const { locale } = useI18n()
const { localField } = useLocalizedContent()
const route = useRoute()
const slug = route.params.slug

marked.setOptions({ gfm: true, breaks: true, async: false })

const loading = ref(true)
const error = ref(false)
const blog = ref(null)
const linkCopied = ref(false)

onMounted(async () => { await loadBlog() })

const loadBlog = async () => {
  try {
    loading.value = true
    error.value = false
    const { data } = await $fetch(`/api/blog/${slug}`).catch(() => ({ data: null }))

    if (!data) {
      if (slug === 'future-ai-agents') {
        blog.value = {
          title: 'The Future of AI Agents in Web Development',
          content: "Artificial Intelligence is rapidly evolving from simple chatbots to autonomous agents capable of complex reasoning and task execution. In the realm of web development, this shift promises to revolutionize how we build, deploy, and maintain applications.\n\n### The Rise of Autonomous Coding\n\nTools like GitHub Copilot were just the beginning. The next generation of AI, often referred to as 'Agentic AI', can understand entire codebases, plan multi-step refactors, and even fix bugs autonomously. This isn't just about writing code faster; it's about shifting the developer's role from 'writer' to 'architect' and 'reviewer'.\n\n> \"The future developer will spend less time typing syntax and more time designing systems.\"\n\n### What This Means for You\n\n1. **Shift in Skills**: Problem-solving and system design become more valuable than rote syntax memorization.\n2. **Productivity Boost**: Mundane tasks like writing boilerplate, tests, and documentation can be offloaded.\n3. **New Possibilities**: Solo developers can now build complex, enterprise-grade applications that previously required large teams.\n\nEmbracing these tools is not optional; it's the new standard.",
          created_at: new Date().toISOString(),
          tags: ['AI', 'Future', 'WebDev'],
          image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
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
    nextTick(() => setTimeout(() => initAnimations(), 100))
  }
}

const initAnimations = () => {
  if (typeof window === 'undefined') return
  const tl = gsap.timeline()
  tl.fromTo('.back-anim', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
    .fromTo('.header-anim', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.6')
    .fromTo('.image-anim', { y: 40, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, '-=0.7')
    .fromTo('.content-anim', { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power3.out' }, '-=0.8')
}

const renderedContent = computed(() => {
  if (!blog.value) return ''
  const content = localField(blog.value, 'content')
  if (!content) return ''
  return marked.parse(String(content))
})

const shareUrls = computed(() => {
  if (!blog.value || typeof window === 'undefined') return {}
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(blog.value.title)
  return {
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  }
})

const copyLink = async () => {
  if (typeof window === 'undefined') return
  try {
    await navigator.clipboard.writeText(window.location.href)
    linkCopied.value = true
    setTimeout(() => { linkCopied.value = false }, 2000)
  } catch (e) { console.error(e) }
}

const formatDate = (date) =>
  new Date(date).toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

useSeoMeta({
  title: () => blog.value?.title,
  description: () => blog.value?.excerpt,
})
</script>

<style scoped>
.blog-detail-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 6vw 200px;
  font-family: 'Geist', system-ui, sans-serif;
  color: var(--text);
}

/* ── States ── */
.state {
  text-align: center;
  padding: 120px 0;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
}
.dot-pulse {
  display: inline-block;
  width: 8px; height: 8px;
  background: var(--amber);
  border-radius: 50%;
  animation: pulse 1.2s ease-in-out infinite;
}
@keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.2); } }

.error-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}
.error-desc {
  font-size: 15px;
  color: var(--muted);
  margin-bottom: 32px;
}

/* ── Back link ── */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  margin-bottom: 56px;
  transition: color 0.25s var(--ease-cinematic);
  opacity: 0;
}
.back-link:hover { color: var(--text); }

/* ── Header ── */
.blog-header {
  margin-bottom: 48px;
  opacity: 0;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin-bottom: 24px;
}
.date  { color: var(--amber); }
.meta-sep { color: var(--muted); }
.topic { color: var(--muted); }

.blog-title {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(32px, 5vw, 60px);
  line-height: 1.05;
  letter-spacing: -0.04em;
  color: var(--text);
  margin-bottom: 28px;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.tag {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  border: 1px solid var(--glass-border);
  padding: 4px 12px;
  border-radius: 999px;
}

/* ── Image ── */
.blog-image {
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 56px;
  opacity: 0;
}
.blog-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
  transition: transform 0.6s var(--ease-cinematic);
}
.blog-image:hover img { transform: scale(1.02); }

/* ── Rendered content ── */
.blog-content { opacity: 0; }
</style>

<style>
/* Unscoped — targets v-html rendered markdown */
.blog-content p {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 300;
  font-size: 18px;
  line-height: 1.75;
  color: rgba(232, 230, 239, 0.8);
  margin-bottom: 1.6rem;
}
.blog-content h2,
.blog-content h3 {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text);
  margin-top: 2.8rem;
  margin-bottom: 1rem;
  line-height: 1.15;
}
.blog-content h2 { font-size: 32px; }
.blog-content h3 { font-size: 24px; }
.blog-content ul,
.blog-content ol {
  margin: 1.5rem 0;
  padding-left: 1.5rem;
  color: rgba(232, 230, 239, 0.75);
  font-size: 17px;
  line-height: 1.7;
}
.blog-content li { margin-bottom: 0.5rem; }
.blog-content strong {
  color: var(--text);
  font-weight: 600;
}
.blog-content blockquote {
  border-left: 3px solid var(--amber);
  padding: 4px 0 4px 24px;
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  font-size: 22px;
  line-height: 1.5;
  color: var(--text);
  margin: 2.5rem 0;
}
.blog-content a {
  color: var(--amber);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 0.2s;
}
.blog-content a:hover { opacity: 0.75; }
.blog-content code {
  font-family: 'Geist Mono', monospace;
  font-size: 0.875em;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 5px;
  padding: 2px 7px;
  color: var(--cyan);
}
.blog-content pre {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  overflow-x: auto;
  margin: 2rem 0;
}
.blog-content pre code {
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  color: var(--text);
}
.blog-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  display: block;
  overflow-x: auto;
  font-size: 15px;
}
.blog-content th,
.blog-content td {
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.7rem 1rem;
  text-align: left;
  color: rgba(232, 230, 239, 0.75);
}
.blog-content th {
  color: var(--text);
  font-weight: 600;
  background: rgba(255, 255, 255, 0.04);
}
</style>

<style scoped>
/* ── Footer ── */
.blog-footer {
  display: flex;
  flex-direction: column;
  gap: 32px;
  border-top: 1px solid var(--glass-border);
  padding-top: 48px;
  margin-top: 72px;
}
@media (min-width: 600px) {
  .blog-footer { flex-direction: row; align-items: center; justify-content: space-between; }
}

.share-section { display: flex; flex-direction: column; gap: 14px; }
.share-label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
}
.share-btns { display: flex; gap: 18px; }
.share-btn {
  background: none;
  border: none;
  padding: 0;
  color: var(--muted);
  font-size: 18px;
  cursor: none;
  transition: color 0.25s var(--ease-cinematic);
}
.share-btn:hover { color: var(--text); }

.read-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--void);
  background: var(--text);
  padding: 12px 28px;
  border-radius: 999px;
  text-decoration: none;
  transition: opacity 0.25s var(--ease-cinematic);
  white-space: nowrap;
}
.read-more-btn:hover { opacity: 0.85; }
</style>
