<template>
  <NuxtLayout>
    <NuxtPage :transition="{
      name: 'page',
      appear: true
    }" />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Initialize theme immediately to prevent flash
useHead({
  script: [
    {
      innerHTML: `(function() {
        try {
          const localTheme = localStorage.getItem('theme');
          const supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (localTheme === 'dark' || (!localTheme && supportDarkMode)) {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
          }
        } catch (e) {}
      })()`
    }
  ]
})
</script>

<style>
/* Global Page Transitions handled in main.css */
</style>
