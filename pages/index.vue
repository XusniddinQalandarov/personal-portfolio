<template>
  <div ref="particlesContainer" class="relative min-h-screen">
    <AppMain/>
  </div>
</template>

<script setup>
const { $initParticles } = useNuxtApp();
const particlesContainer = ref(null);
let particlesEffect = null;

onMounted(() => {
  if (particlesContainer.value) {
    particlesEffect = $initParticles(particlesContainer.value);
  }
});

onUnmounted(() => {
  if (particlesEffect) {
    particlesEffect.destroy();
  }
});
</script>