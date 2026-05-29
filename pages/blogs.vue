<template>
  <article class="blogs-page">
    <HeroHighlight>
      <AuroraPageHero
        :eyebrow="$t('aurora.cursor.blogs')"
        :title="$t('blogs.title').toLowerCase()"
        :subtitle="$t('blogs.subtitle')"
      />
      <div class="hero-tagline">
        <Highlight>{{ $t('blogs.subtitle') }}</Highlight>
      </div>
    </HeroHighlight>

    <section ref="filtersEl" class="filters reveal">
      <div class="search-wrap">
        <i class="pi pi-search search-icon" aria-hidden="true" />
        <input
          v-model="searchQuery"
          @input="searchBlogs"
          type="text"
          :placeholder="$t('blogs.searchPlaceholder')"
          class="search-input"
        />
      </div>
      <div class="tag-row">
        <button
          v-for="tag in allTags"
          :key="tag"
          class="tag-btn"
          :class="{ active: selectedTag === tag }"
          @click="toggleTag(tag)"
          :data-cursor-label="`#${tag}`"
        >#{{ tag }}</button>
      </div>
    </section>

    <div v-if="loading" class="state"><span class="dot-pulse" /></div>
    <div v-else-if="!filteredBlogs.length" class="state empty">{{ $t('blogs.noArticles') }}</div>

    <section v-else ref="listEl" class="grid">
      <MagicCard
        v-for="blog in filteredBlogs"
        :key="blog.id"
        class="blog-card reveal-card"
        data-cursor-card
        :data-cursor-label="$t('blogs.readArticle')"
        @click="navigateTo(`/blog/${blog.slug}`)"
      >
        <div class="thumb">
          <img v-if="blog.image_url" :src="blog.image_url" :alt="blog.title" />
          <div v-else class="thumb-fallback"><i class="pi pi-image" /></div>
        </div>
        <div class="meta">
          <span class="date">{{ formatDate(blog.created_at) }}</span>
          <span v-if="blog.tags?.length" class="dot">·</span>
          <span v-if="blog.tags?.length" class="topic">#{{ blog.tags[0] }}</span>
        </div>
        <h3 class="title">{{ localField(blog, 'title') }}</h3>
        <p class="excerpt">{{ localField(blog, 'excerpt') }}</p>
        <div class="read">{{ $t('blogs.readArticle') }} <span class="arrow">→</span></div>
      </MagicCard>
    </section>
  </article>
</template>

<script setup>
definePageMeta({ layout: 'aurora' })
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AuroraPageHero from '~/components/aurora/layout/AuroraPageHero.vue'
import MagicCard from '~/components/aurora/surface/MagicCard.vue'
import HeroHighlight from '~/components/aurora/surface/HeroHighlight.vue'
import Highlight from '~/components/aurora/type/Highlight.vue'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const { t, locale } = useI18n()
const { localField } = useLocalizedContent()

const loading = ref(true)
const blogs = ref([])
const filteredBlogs = ref([])
const searchQuery = ref('')
const selectedTag = ref('')
const allTags = ref([])

const filtersEl = ref(null)
const listEl = ref(null)

onMounted(async () => {
  await loadBlogs()
  if (typeof window === 'undefined') return
  nextTick(() => {
    if (filtersEl.value) gsap.fromTo(filtersEl.value, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
    document.querySelectorAll('.reveal-card').forEach((el) => {
      gsap.fromTo(el, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      })
    })
  })
})

const loadBlogs = async () => {
  try {
    loading.value = true
    const { data } = await $fetch('/api/blogs').catch(() => ({ data: [] }))
    if (!data || !data.length) {
      blogs.value = [
        { id: 1, title: 'The Future of AI Agents in Web Development', slug: 'future-ai-agents', excerpt: 'Exploring how autonomous agents like Devin and others are reshaping the landscape of frontend engineering.', created_at: new Date().toISOString(), tags: ['AI', 'Future'], image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995' },
        { id: 2, title: 'Mastering Tailwind CSS for Large Scale Apps', slug: 'mastering-tailwind', excerpt: 'Best practices for organizing utility classes and maintaining a consistent design system in enterprise applications.', created_at: new Date().toISOString(), tags: ['CSS', 'Frontend'], image_url: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159' },
      ]
    } else {
      blogs.value = data
    }
    filteredBlogs.value = blogs.value
    const set = new Set()
    blogs.value.forEach(b => b.tags?.forEach(t => set.add(t)))
    allTags.value = Array.from(set).sort()
  } catch (e) {
    console.error('Failed to load blogs:', e)
  } finally {
    loading.value = false
  }
}

const searchBlogs = () => {
  let r = blogs.value
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    r = r.filter(b => b.title.toLowerCase().includes(q) || b.excerpt?.toLowerCase().includes(q))
  }
  if (selectedTag.value) r = r.filter(b => b.tags?.includes(selectedTag.value))
  filteredBlogs.value = r
}

const toggleTag = (tag) => { selectedTag.value = selectedTag.value === tag ? '' : tag; searchBlogs() }

const formatDate = (date) => new Date(date).toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })

useSeoMeta({
  title: () => t('blogs.seoTitle'),
  description: () => t('blogs.seoDescription'),
})
</script>

<style scoped>
.blogs-page {
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 220px;
  font-family: 'Geist', system-ui, sans-serif;
  color: var(--text);
}

.hero-tagline {
  text-align: center;
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 300;
  font-size: 16px;
  color: var(--muted);
  padding: 0 6vw 16px;
}

.filters {
  display: flex; flex-direction: column; gap: 24px;
  padding: 0 6vw 56px;
  max-width: 1200px;
  margin: 0 auto;
  opacity: 0;
}
@media (min-width: 720px) { .filters { flex-direction: row; justify-content: space-between; align-items: center; gap: 32px; } }

.search-wrap { position: relative; width: 100%; max-width: 360px; }
.search-icon {
  position: absolute; left: 0; top: 50%; transform: translateY(-50%);
  font-size: 12px; color: var(--muted);
}
.search-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--glass-border);
  padding: 12px 0 12px 24px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text);
  outline: none;
  transition: border-color 0.3s;
}
.search-input::placeholder { color: var(--muted); }
.search-input:focus { border-bottom-color: var(--amber); }

.tag-row { display: flex; flex-wrap: wrap; gap: 14px; }
.tag-btn {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  background: transparent;
  border: none;
  cursor: none;
  transition: color 0.3s;
}
.tag-btn:hover { color: var(--text); }
.tag-btn.active { color: var(--amber); text-decoration: underline; text-underline-offset: 4px; }

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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 22px;
  padding: 0 6vw;
  max-width: 1400px;
  margin: 0 auto;
}
.blog-card { cursor: none; }
.blog-card :deep(.card-content) { padding: 0; }

.thumb {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 22px 22px 0 0;
  background: rgba(255,255,255,0.03);
  margin: -1px -1px 0;
}
.thumb img {
  width: 100%; height: 100%; object-fit: cover;
  filter: grayscale(1);
  transition: filter 0.6s, transform 0.6s var(--ease-cinematic);
}
.blog-card:hover .thumb img { filter: grayscale(0); transform: scale(1.04); }
.thumb-fallback {
  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
  color: var(--muted); font-size: 32px;
}

.meta {
  display: flex; align-items: center; gap: 8px;
  padding: 18px 24px 0;
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
.date { color: var(--amber); }
.dot { color: var(--muted); }
.topic { color: var(--muted); }

.title {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.15;
  letter-spacing: -0.02em;
  padding: 12px 24px 8px;
  color: var(--text);
}
.excerpt {
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
.read {
  padding: 0 24px 24px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text);
  display: flex; align-items: center; gap: 8px;
}
.arrow { color: var(--amber); transition: transform 0.3s var(--ease-cinematic); }
.blog-card:hover .arrow { transform: translateX(4px); }

.reveal-card { opacity: 0; }
</style>
