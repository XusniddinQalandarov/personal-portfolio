<!-- Port of aceternity/spotlight — soft Gaussian-blurred ellipse moving in -->
<template>
  <svg
    class="spotlight"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 3787 2842"
    fill="none"
    preserveAspectRatio="xMidYMid slice"
  >
    <g filter="url(#sp-filter)">
      <ellipse
        cx="1924.71" cy="273.501" rx="1924.71" ry="273.501"
        transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
        :fill="fill"
        fill-opacity="0.18"
      />
    </g>
    <defs>
      <filter
        id="sp-filter"
        x="0.860352" y="0.838989"
        width="3785.16" height="2840.26"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur" />
      </filter>
    </defs>
  </svg>
</template>
<script setup lang="ts">
withDefaults(defineProps<{ fill?: string }>(), { fill: '#ffffff' })
</script>
<style scoped>
.spotlight {
  pointer-events: none;
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  z-index: 1;
  height: 169%;
  width: 138%;
  opacity: 0;
  animation: spotlight-in 2.4s var(--ease-cinematic) 0.75s 1 forwards;
}
@media (min-width: 1024px) { .spotlight { width: 84%; } }
@keyframes spotlight-in {
  0% { opacity: 0; transform: translate(-72%, -62%) scale(0.5); }
  100% { opacity: 1; transform: translate(-50%, -40%) scale(1); }
}
@media (prefers-reduced-motion: reduce) { .spotlight { opacity: 1; animation: none; transform: translate(-50%, -40%); } }
</style>
