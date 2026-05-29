<template>
  <Teleport to="body">
    <div v-if="isOpen && project" class="modal-root" @click="closeModal">
      <div class="backdrop" />
      <div class="modal-card" @click.stop>
        <button class="close" @click="closeModal" aria-label="Close">
          <i class="pi pi-times" />
        </button>

        <div class="hero-image">
          <img :src="project.image_url || '/images/project-placeholder.jpg'" :alt="project.title" />
          <div class="hero-overlay" />
          <div class="hero-text">
            <div class="hero-tag">{{ project.category }}</div>
            <h2 class="hero-title">{{ localField(project, 'title') }}</h2>
          </div>
        </div>

        <div class="body">
          <div class="row top-row">
            <div class="tech-row">
              <span v-for="t in project.technologies" :key="t" class="tech">{{ t }}</span>
            </div>
            <div class="links">
              <a v-if="project.demo_url" :href="project.demo_url" target="_blank" class="link primary">
                {{ $t('projectModal.liveDemo') }} <i class="pi pi-arrow-up-right" />
              </a>
              <a v-if="project.github_url" :href="project.github_url" target="_blank" class="link">
                {{ $t('projectModal.code') }} <i class="pi pi-github" />
              </a>
            </div>
          </div>

          <div class="content-grid">
            <div class="description">
              <p>{{ localField(project, 'description') }}</p>
              <p v-if="localField(project, 'long_description')">{{ localField(project, 'long_description') }}</p>
            </div>
            <aside class="aside">
              <div v-if="project.client" class="aside-row">
                <h4>{{ $t('projectModal.client') }}</h4>
                <p>{{ project.client }}</p>
              </div>
              <div v-if="project.year" class="aside-row">
                <h4>{{ $t('projectModal.year') }}</h4>
                <p>{{ project.year }}</p>
              </div>
              <div v-if="project.role" class="aside-row">
                <h4>{{ $t('projectModal.role') }}</h4>
                <p>{{ project.role }}</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const { localField } = useLocalizedContent()
const props = defineProps({ isOpen: Boolean, project: Object })
const emit = defineEmits(['close'])
const closeModal = () => emit('close')

onMounted(() => {
  if (typeof window === 'undefined') return
  const handleKeydown = (e) => { if (e.key === 'Escape' && props.isOpen) closeModal() }
  document.addEventListener('keydown', handleKeydown)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  })
})

watch(() => props.isOpen, (open) => {
  if (typeof window === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<style scoped>
.modal-root {
  position: fixed; inset: 0; z-index: 60;
  display: flex; align-items: center; justify-content: center;
  padding: 0;
}
@media (min-width: 720px) { .modal-root { padding: 24px; } }

.backdrop {
  position: fixed; inset: 0;
  background: rgba(6, 4, 14, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.modal-card {
  position: relative;
  width: 100%; max-width: 1100px;
  max-height: 95vh;
  overflow-y: auto;
  background: var(--void);
  border: 1px solid var(--glass-border);
  border-radius: 0;
  box-shadow: 0 40px 80px -20px rgba(0,0,0,0.7);
  color: var(--text);
  font-family: 'Geist', system-ui, sans-serif;
  cursor: none;
}
@media (min-width: 720px) { .modal-card { border-radius: 22px; max-height: 85vh; } }

.close {
  position: absolute; top: 16px; right: 16px;
  width: 36px; height: 36px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(12px);
  color: var(--text);
  display: flex; align-items: center; justify-content: center;
  cursor: none;
  z-index: 20;
  transition: all 0.3s var(--ease-cinematic);
}
.close:hover { border-color: var(--amber); color: var(--amber); }

.hero-image {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
}
@media (min-width: 720px) { .hero-image { aspect-ratio: 21 / 9; } }
.hero-image img { width: 100%; height: 100%; object-fit: cover; }
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(8,8,13,0.95), transparent 60%);
}
.hero-text { position: absolute; left: 28px; bottom: 24px; right: 28px; }
@media (min-width: 720px) { .hero-text { left: 48px; bottom: 36px; right: 48px; } }
.hero-tag {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--amber);
  margin-bottom: 12px;
}
.hero-title {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(28px, 4vw, 56px);
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--text);
}

.body { padding: 28px 28px 56px; }
@media (min-width: 720px) { .body { padding: 40px 48px 64px; } }

.row { display: flex; flex-wrap: wrap; gap: 18px; }
.top-row {
  justify-content: space-between;
  border-bottom: 1px dashed var(--glass-border);
  padding-bottom: 28px;
  margin-bottom: 36px;
}
.tech-row { display: flex; flex-wrap: wrap; gap: 6px; }
.tech {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
}
.links { display: flex; gap: 18px; align-items: center; }
.link {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--muted);
  cursor: none;
  transition: color 0.3s;
}
.link:hover { color: var(--amber); }
.link.primary { color: var(--text); }
.link.primary:hover { color: var(--amber); }

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}
@media (min-width: 900px) { .content-grid { grid-template-columns: 2fr 1fr; } }
.description p {
  font-weight: 300;
  font-size: 16px;
  line-height: 1.7;
  color: var(--muted);
  margin-bottom: 16px;
}
.aside { display: flex; flex-direction: column; gap: 22px; }
.aside-row h4 {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 6px;
}
.aside-row p { color: var(--text); font-size: 15px; }
</style>
