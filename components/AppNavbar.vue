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

        <!-- Theme Toggle & Mobile Menu Button -->
        <div class="flex items-center space-x-2">
          <!-- Theme Toggle Button -->
          <button
            @click="toggleTheme"
            class="theme-toggle p-2"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <i v-if="isDark" class="pi pi-sun text-lg"></i>
            <i v-else class="pi pi-moon text-lg"></i>
          </button>

          <!-- Mobile Menu Button -->
          <button
            @click.stop="toggleMobileMenu"
            class="md:hidden p-2"
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
            
            <!-- Mobile Theme Toggle -->
            <button
              @click="toggleTheme"
              class="theme-toggle p-2 mx-2 flex items-center gap-2"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <i v-if="isDark" class="pi pi-sun"></i>
              <i v-else class="pi pi-moon"></i>
              <span>{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </nav>

  <!-- Spacer to prevent content from hiding behind fixed navbar -->
  <div class="h-16 bg-transparent"></div>
</template>

<script setup>
const { isDark, toggleTheme, initTheme } = useTheme()

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

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

watch(() => useRoute().path, () => {
  closeMobileMenu();
});

// Initialize theme on mount
onMounted(() => {
  initTheme()
  
  // Add a small delay to ensure DOM is ready
  nextTick(() => {
    initTheme()
  })
  
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