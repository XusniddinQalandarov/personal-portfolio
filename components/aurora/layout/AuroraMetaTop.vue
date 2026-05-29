<!-- components/aurora/layout/AuroraMetaTop.vue
     Top-right: live "Tashkent" indicator + live UTC+5 clock.
     Locale + theme toggles live here too. -->
<template>
  <div class="meta-top">
    <span class="live">{{ $t('aurora.live') }}</span>
    <span class="clock">{{ time }}</span>
    <button class="meta-btn" data-cursor-state="link" :data-cursor-label="locale === 'en' ? 'RU' : 'EN'" @click="toggleLocale">
      {{ locale === 'en' ? 'RU' : 'EN' }}
    </button>
    <button class="meta-btn" data-cursor-state="link" :data-cursor-label="isDark ? 'Light' : 'Dark'" @click="toggleTheme" :aria-label="isDark ? $t('nav.lightMode') : $t('nav.darkMode')">
      <i v-if="isDark" class="pi pi-sun" />
      <i v-else class="pi pi-moon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from '~/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
const { locale, setLocale } = useI18n()
const toggleLocale = () => setLocale(locale.value === 'en' ? 'ru' : 'en')

const time = ref('--:--:--')
let intervalId = 0

function tickClock() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const tashkent = new Date(utc + 5 * 3600 * 1000)
  const hh = String(tashkent.getHours()).padStart(2, '0')
  const mm = String(tashkent.getMinutes()).padStart(2, '0')
  const ss = String(tashkent.getSeconds()).padStart(2, '0')
  time.value = `${hh}:${mm}:${ss}`
}

onMounted(() => {
  if (typeof window === 'undefined') return
  tickClock()
  intervalId = window.setInterval(tickClock, 1000)
})
onBeforeUnmount(() => clearInterval(intervalId))
</script>

<style scoped>
.meta-top {
  position: fixed; top: 32px; right: 32px;
  z-index: 50;
  display: flex; gap: 20px; align-items: center;
  font-family: 'Geist Mono', monospace;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
}
.live::before {
  content: ''; display: inline-block;
  width: 6px; height: 6px; border-radius: 50%; background: var(--cyan);
  box-shadow: 0 0 8px var(--cyan);
  margin-right: 8px; vertical-align: middle;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.meta-btn {
  background: transparent; border: none;
  color: var(--text);
  font-family: inherit; font-size: inherit; letter-spacing: inherit;
  cursor: none;
  transition: color 0.3s;
}
.meta-btn:hover { color: var(--amber); }
</style>
