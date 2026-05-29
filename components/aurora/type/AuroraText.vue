<!-- components/aurora/type/AuroraText.vue
     Port of magicui/aurora-text. -->
<template>
  <span class="aurora-text"><slot /></span>
</template>

<style scoped>
.aurora-text {
  background: linear-gradient(120deg, var(--amber), var(--magenta), var(--cyan), var(--amber));
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: auroraShift 10s ease infinite;
}
@keyframes auroraShift {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .aurora-text { animation: none; background-position: 0% 50%; }
}
</style>
