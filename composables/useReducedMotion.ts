import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useReducedMotion() {
  const prefersReduced = ref(false)
  let mq: MediaQueryList | null = null
  const update = () => { prefersReduced.value = !!mq?.matches }

  if (typeof window !== 'undefined') {
    mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReduced.value = mq.matches
  }

  onMounted(() => {
    mq?.addEventListener('change', update)
  })
  onBeforeUnmount(() => {
    mq?.removeEventListener('change', update)
  })

  return { prefersReduced }
}
