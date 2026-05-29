<!-- Port of magicui/blur-fade — IntersectionObserver-driven blur+fade+slide reveal -->
<template>
  <div ref="el" :class="['blur-fade', { visible: inView }]" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  delay?: number
  duration?: number
  offset?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  blur?: string
  once?: boolean
}>(), {
  delay: 0,
  duration: 0.5,
  offset: 16,
  direction: 'up',
  blur: '8px',
  once: true,
})

const el = ref<HTMLElement | null>(null)
const inView = ref(false)

const style = computed(() => ({
  '--bf-duration': `${props.duration}s`,
  '--bf-delay': `${props.delay}s`,
  '--bf-blur': props.blur,
  '--bf-offset': `${props.offset}px`,
}))

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (typeof window === 'undefined' || !el.value) return
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        inView.value = true
        if (props.once) observer?.disconnect()
      } else if (!props.once) {
        inView.value = false
      }
    },
    { rootMargin: '-40px' }
  )
  observer.observe(el.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
.blur-fade {
  opacity: 0;
  filter: blur(var(--bf-blur, 8px));
  transition:
    opacity var(--bf-duration, 0.5s) ease var(--bf-delay, 0s),
    filter  var(--bf-duration, 0.5s) ease var(--bf-delay, 0s),
    transform var(--bf-duration, 0.5s) cubic-bezier(0.16, 1, 0.3, 1) var(--bf-delay, 0s);
  will-change: opacity, filter, transform;
}

/* direction-specific hidden states */
.blur-fade:not(.visible) { transform: translateY(var(--bf-offset, 16px)); }

.blur-fade.visible {
  opacity: 1;
  filter: blur(0);
  transform: translate(0, 0);
}

@media (prefers-reduced-motion: reduce) {
  .blur-fade { transition: none; }
}
</style>
