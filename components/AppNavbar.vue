<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-dark-charcoal border-b glow-border">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Desktop Navigation Centered -->
        <div class="flex-1 flex items-center justify-center">
          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink 
              v-for="item in navigation" 
              :key="item.name"
              :to="item.href"
              :class="[
                'nav-link font-medium',
                $route.path === item.href ? 'text-quote-cyan' : ''
              ]"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex items-center">
          <button
            @click.stop="toggleMobileMenu"
            class="md:hidden p-2 ml-2"
            aria-label="Toggle menu"
          >
            <svg v-if="!isMobileMenuOpen" class="w-6 h-6 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <svg v-else class="w-6 h-6 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="isMobileMenuOpen" class="md:hidden py-4 border-t glow-border bg-transparent glass-panel">
          <div class="flex flex-col space-y-4">
            <NuxtLink 
              v-for="item in navigation" 
              :key="item.name"
              :to="item.href"
              @click="closeMobileMenu"
              :class="[
                'nav-link font-medium px-2 py-1',
                $route.path === item.href ? 'text-quote-cyan' : ''
              ]"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </div>
  </nav>

  <!-- Spacer to prevent content from hiding behind fixed navbar -->
  <div class="h-16 bg-transparent"></div>
</template>

<script setup>
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Experience', href: '/experience' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'Fitness', href: '/fitness' },
  { name: 'Contact', href: '/contact' }
  // Note: Admin page removed from nav for security - access via /admin URL directly
];

const isMobileMenuOpen = ref(false);
const isDark = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  // You can implement actual theme switching here
  // For now, it's just a visual toggle
};

watch(() => useRoute().path, () => {
  closeMobileMenu();
});

// Close mobile menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    if (isMobileMenuOpen.value && !event.target.closest('nav')) {
      closeMobileMenu();
    }
  };
  document.addEventListener('click', handleClickOutside);
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});
</script>