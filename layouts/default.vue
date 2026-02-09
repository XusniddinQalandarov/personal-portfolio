<template>
  <div class="min-h-screen flex flex-col bg-gradient-mesh relative">
    <AppNavbar />  
    <main class="flex-1 relative z-10">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<style>
/* Ensure mesh gradient covers the entire page */
.bg-gradient-mesh {
  background: var(--gradient-mesh-1), var(--gradient-mesh-2), var(--gradient-mesh-3), var(--color-bg-primary);
  min-height: 100vh;
}
</style>