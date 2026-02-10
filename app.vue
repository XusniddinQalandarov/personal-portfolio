<template>
  <NuxtLayout>
    <NuxtPage :transition="{
      name: transitionName,
      appear: true
    }" />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()

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

// Define route order for directional transitions
const routeOrder = {
  'index': 1,
  'about': 2,
  'experience': 3,
  'projects': 4,
  'blogs': 5,
  'fitness': 6,
  'contact': 7
}

const transitionName = ref('slide-left')

// Watch route changes to determine direction
watch(() => route.path, (toPath, fromPath) => {
  const getOrder = (path: string) => {
    if (path === '/') return 1
    const base = path.split('/')[1]
    return routeOrder[base as keyof typeof routeOrder] || 99
  }

  const toOrder = getOrder(toPath)
  const fromOrder = getOrder(fromPath || '/')

  if (toOrder < fromOrder) {
    transitionName.value = 'slide-right'
  } else {
    transitionName.value = 'slide-left'
  }
})
</script>

<style>
/* Global Page Transitions handled in main.css */
</style>
