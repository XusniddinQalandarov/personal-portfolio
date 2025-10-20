<template>
  <div ref="vantaContainer" class="relative min-h-screen bg-dark-charcoal">
    <AppMain/>
  </div>
</template>

<script setup>
const { $vantaNet } = useNuxtApp();
const vantaContainer = ref(null);
let vantaEffect = null;

onMounted(() => {
  if (vantaContainer.value) {
    vantaEffect = $vantaNet(vantaContainer.value, {
      color: 0x808080, // Gray lines instead of white/cyan
      backgroundColor: 0x000000, // Pure black - matches navbar
      points: 14.00, // More points for more movement
      maxDistance: 21.00, // Shorter connection distance = smaller groups
      spacing: 22.00, // More spacing = more separation
      showDots: true, // Show the connection points
    });
  }
});

onUnmounted(() => {
  if (vantaEffect) {
    vantaEffect.destroy();
  }
});
</script>