<template>
  <div data-aurora="blooms" aria-hidden="true">
    <div class="bloom bloom-1" />
    <div class="bloom bloom-2" />
  </div>
</template>

<style scoped>
.bloom {
  position: fixed;
  border-radius: 50%;
  filter: blur(60px);
  z-index: 0;
  pointer-events: none;
}
.bloom-1 {
  width: 60vw; height: 60vw;
  top: -25vw; right: -15vw;
  background: radial-gradient(circle,
    color-mix(in srgb, var(--accent-primary) 30%, transparent) 0%,
    color-mix(in srgb, var(--accent-secondary) 15%, transparent) 40%,
    transparent 70%);
  animation: bloomDrift 24s var(--ease-cinematic) infinite;
}
.bloom-2 {
  width: 40vw; height: 40vw;
  bottom: -10vw; left: -10vw;
  background: radial-gradient(circle,
    color-mix(in srgb, var(--accent-tertiary) 22%, transparent) 0%,
    transparent 70%);
  filter: blur(50px);
  animation: bloomDrift2 30s var(--ease-cinematic) infinite;
}
@keyframes bloomDrift {
  0%, 100% { transform: translate(0, 0); }
  50%      { transform: translate(-6vw, 4vw); }
}
@keyframes bloomDrift2 {
  0%, 100% { transform: translate(0, 0); }
  50%      { transform: translate(4vw, -3vw); }
}
@media (max-width: 640px) {
  .bloom-2 { display: none; }
}
</style>
