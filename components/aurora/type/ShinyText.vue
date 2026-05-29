<!-- components/aurora/type/ShinyText.vue
     Port of magicui/animated-shiny-text. -->
<template>
  <span class="shiny-text"><slot /></span>
</template>

<style scoped>
.shiny-text {
  background: linear-gradient(90deg, var(--muted) 30%, #fff 50%, var(--muted) 70%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 6s linear infinite;
}
@keyframes shine {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .shiny-text { animation: none; }
}
</style>
