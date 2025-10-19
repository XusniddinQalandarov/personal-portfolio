<template>
  <div class="min-h-screen flex flex-col">
    <AppNavbar />  
    <main class="flex-1 bg-dark-charcoal">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
</script>