<template>
  <svg
    fill="none"
    :width="dims.w"
    :height="dims.h"
    xmlns="http://www.w3.org/2000/svg"
    class="animated-beam"
    :viewBox="`0 0 ${dims.w} ${dims.h}`"
  >
    <path :d="pathD" :stroke="pathColor" :stroke-width="pathWidth" :stroke-opacity="pathOpacity" stroke-linecap="round" />
    <path :d="pathD" :stroke-width="pathWidth" :stroke="`url(#${gradId})`" stroke-linecap="round" />
    <defs>
      <linearGradient :id="gradId" gradientUnits="userSpaceOnUse" :x1="g.x1" :x2="g.x2" :y1="g.y1" :y2="g.y2">
        <stop :stop-color="gradientStartColor" stop-opacity="0" />
        <stop :stop-color="gradientStartColor" />
        <stop offset="32.5%" :stop-color="gradientStopColor" />
        <stop offset="100%" :stop-color="gradientStopColor" stop-opacity="0" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, watch, type Ref } from 'vue'

const props = withDefaults(defineProps<{
  containerRef: Ref<HTMLElement | null>
  fromRef: Ref<HTMLElement | null>
  toRef: Ref<HTMLElement | null>
  curvature?: number
  reverse?: boolean
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  duration?: number
  delay?: number
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
}>(), {
  curvature: 0,
  reverse: false,
  pathColor: 'rgba(255,255,255,0.16)',
  pathWidth: 2,
  pathOpacity: 0.2,
  gradientStartColor: 'var(--amber)',
  gradientStopColor: 'var(--indigo)',
  duration: 5,
  delay: 0,
  startXOffset: 0,
  startYOffset: 0,
  endXOffset: 0,
  endYOffset: 0,
})

const gradId = `ab-${Math.random().toString(36).slice(2, 8)}`
const pathD = ref('')
const dims = reactive({ w: 0, h: 0 })

// Animated gradient endpoints: cycle between the "from" and "to" positions.
const g = reactive({ x1: '0%', x2: '0%', y1: '0%', y2: '0%' })
let animFrame = 0
let startT = 0

function updatePath() {
  if (!props.containerRef.value || !props.fromRef.value || !props.toRef.value) return
  const cr = props.containerRef.value.getBoundingClientRect()
  const a = props.fromRef.value.getBoundingClientRect()
  const b = props.toRef.value.getBoundingClientRect()
  dims.w = cr.width
  dims.h = cr.height
  const startX = a.left - cr.left + a.width / 2 + props.startXOffset
  const startY = a.top - cr.top + a.height / 2 + props.startYOffset
  const endX = b.left - cr.left + b.width / 2 + props.endXOffset
  const endY = b.top - cr.top + b.height / 2 + props.endYOffset
  const ctrlY = startY - props.curvature
  pathD.value = `M ${startX},${startY} Q ${(startX + endX) / 2},${ctrlY} ${endX},${endY}`
}

function tick(t: number) {
  if (!startT) startT = t + props.delay * 1000
  const elapsed = Math.max(0, t - startT) / 1000
  const prog = (elapsed % props.duration) / props.duration
  // Travel gradient stops from from→to (or reverse).
  if (props.reverse) {
    g.x1 = `${90 - prog * 100}%`
    g.x2 = `${100 - prog * 100}%`
  } else {
    g.x1 = `${10 + prog * 100}%`
    g.x2 = `${0 + prog * 100}%`
  }
  animFrame = requestAnimationFrame(tick)
}

let ro: ResizeObserver | null = null
onMounted(() => {
  if (typeof window === 'undefined') return
  updatePath()
  if (props.containerRef.value && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(updatePath)
    ro.observe(props.containerRef.value)
  }
  animFrame = requestAnimationFrame(tick)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(animFrame)
  ro?.disconnect()
})
watch(() => [props.fromRef.value, props.toRef.value, props.containerRef.value], updatePath)
</script>

<style scoped>
.animated-beam {
  pointer-events: none;
  position: absolute;
  top: 0; left: 0;
  transform: translateZ(0);
  stroke-width: 2;
}
@media (prefers-reduced-motion: reduce) { .animated-beam { display: none; } }
</style>
