<!-- Port of magicui/animated-circular-progress-bar — SVG gauge with CSS animation -->
<template>
  <div class="acpb" :style="cssVars">
    <svg viewBox="0 0 100 100" fill="none" stroke-width="2" class="acpb-svg">
      <!-- Background arc -->
      <circle
        v-if="currentPercent <= 90 && currentPercent >= 0"
        cx="50" cy="50" r="45"
        stroke-width="9"
        stroke-dashoffset="0"
        stroke-linecap="round"
        class="acpb-bg"
        :style="{
          stroke: gaugeSecondaryColor,
          strokeDasharray: `calc(${90 - currentPercent} * var(--percent-to-px)) var(--circumference)`,
          transform: 'rotate(calc(1turn - 90deg - (5 * 3.6deg))) scaleY(-1)',
          transformOrigin: '50px 50px',
        }"
      />
      <!-- Foreground arc -->
      <circle
        cx="50" cy="50" r="45"
        stroke-width="9"
        stroke-dashoffset="0"
        stroke-linecap="round"
        class="acpb-fg"
        :style="{
          stroke: gaugePrimaryColor,
          strokeDasharray: `calc(${currentPercent} * var(--percent-to-px)) var(--circumference)`,
          transform: 'rotate(calc(-90deg + 5 * 3.6deg))',
          transformOrigin: '50px 50px',
        }"
      />
    </svg>
    <span class="acpb-label">{{ currentPercent }}%</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: number
  max?: number
  min?: number
  gaugePrimaryColor: string
  gaugeSecondaryColor: string
}>(), { max: 100, min: 0 })

const circumference = 2 * Math.PI * 45
const percentToPx = circumference / 100

const currentPercent = computed(() =>
  Math.round(((props.value - props.min) / (props.max - props.min)) * 100)
)

const cssVars = computed(() => ({
  '--circumference': circumference,
  '--percent-to-px': `${percentToPx}px`,
}))
</script>

<style scoped>
.acpb {
  position: relative;
  width: 100px; height: 100px;
  display: flex; align-items: center; justify-content: center;
}
.acpb-svg { width: 100%; height: 100%; }
.acpb-bg, .acpb-fg {
  transition: stroke-dasharray 1s cubic-bezier(0.16, 1, 0.3, 1);
}
.acpb-label {
  position: absolute;
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.03em;
  color: var(--text);
}
</style>
