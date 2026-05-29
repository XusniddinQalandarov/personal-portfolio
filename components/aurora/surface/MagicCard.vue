<template>
  <div
    ref="root"
    class="magic-card"
    :style="cardStyle"
    @pointermove="onMove"
    @pointerenter="onEnter"
    @pointerleave="onLeave"
  >
    <div class="card-fill" aria-hidden="true" />
    <div
      v-if="mode === 'gradient'"
      class="card-glow gradient-mode"
      :style="gradientGlowStyle"
      aria-hidden="true"
    />
    <div
      v-else-if="mode === 'orb'"
      class="card-glow orb-mode"
      :style="orbStyle"
      aria-hidden="true"
    />
    <div class="card-content"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  mode?: 'gradient' | 'orb'
  gradientSize?: number
  gradientFrom?: string
  gradientTo?: string
  gradientColor?: string
  gradientOpacity?: number
  glowFrom?: string
  glowTo?: string
  glowAngle?: number
  glowSize?: number
  glowBlur?: number
  glowOpacity?: number
}>(), {
  mode: 'gradient',
  gradientSize: 200,
  gradientFrom: 'var(--amber)',
  gradientTo: 'var(--magenta)',
  gradientColor: 'rgba(232, 230, 239, 0.06)',
  gradientOpacity: 0.85,
  glowFrom: 'var(--amber)',
  glowTo: 'var(--indigo)',
  glowAngle: 90,
  glowSize: 420,
  glowBlur: 60,
  glowOpacity: 0.7,
})

const root = ref<HTMLDivElement | null>(null)
const mx = ref(-props.gradientSize)
const my = ref(-props.gradientSize)
// Spring-eased orb position
const ox = ref(-props.gradientSize)
const oy = ref(-props.gradientSize)
let vx = 0, vy = 0, rafId = 0
const orbOpacity = ref(0)

function onMove(e: PointerEvent) {
  if (!root.value) return
  const r = root.value.getBoundingClientRect()
  mx.value = e.clientX - r.left
  my.value = e.clientY - r.top
}
function onEnter() {
  if (props.mode === 'orb') orbOpacity.value = props.glowOpacity
}
function onLeave() {
  if (props.mode === 'gradient') {
    mx.value = -props.gradientSize
    my.value = -props.gradientSize
  } else {
    orbOpacity.value = 0
  }
}

function tickOrb() {
  const stiffness = 0.18, damping = 0.72
  vx = vx * damping + (mx.value - ox.value) * stiffness
  vy = vy * damping + (my.value - oy.value) * stiffness
  ox.value += vx
  oy.value += vy
  rafId = requestAnimationFrame(tickOrb)
}

const cardStyle = computed(() => ({
  background: `
    linear-gradient(var(--void) 0 0) padding-box,
    radial-gradient(${props.gradientSize}px circle at ${mx.value}px ${my.value}px,
      ${props.gradientFrom}, ${props.gradientTo}, var(--glass-border) 100%) border-box
  `,
}))
const gradientGlowStyle = computed(() => ({
  background: `radial-gradient(${props.gradientSize}px circle at ${mx.value}px ${my.value}px, ${props.gradientColor}, transparent 100%)`,
  opacity: props.gradientOpacity,
}))
const orbStyle = computed(() => ({
  width: `${props.glowSize}px`,
  height: `${props.glowSize}px`,
  transform: `translate(${ox.value - props.glowSize / 2}px, ${oy.value - props.glowSize / 2}px)`,
  borderRadius: '9999px',
  filter: `blur(${props.glowBlur}px)`,
  opacity: orbOpacity.value,
  background: `linear-gradient(${props.glowAngle}deg, ${props.glowFrom}, ${props.glowTo})`,
  mixBlendMode: 'screen' as const,
  willChange: 'transform, opacity',
}))

onMounted(() => {
  if (typeof window === 'undefined') return
  if (props.mode === 'orb') rafId = requestAnimationFrame(tickOrb)
  const onGlobalOut = (e: PointerEvent) => { if (!e.relatedTarget) onLeave() }
  window.addEventListener('pointerout', onGlobalOut)
  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('pointerout', onGlobalOut)
  })
})
</script>

<style scoped>
.magic-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid transparent;
}
.card-fill {
  position: absolute;
  inset: 1px;
  z-index: 20;
  border-radius: inherit;
  background: var(--void);
}
.card-glow {
  position: absolute;
  inset: 1px;
  z-index: 30;
  border-radius: inherit;
  pointer-events: none;
  transition: opacity 0.3s var(--ease-cinematic);
}
.card-glow.orb-mode { inset: auto; pointer-events: none; }
.card-content {
  position: relative;
  z-index: 40;
  padding: 28px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
