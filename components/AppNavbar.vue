<template>
  <!-- Floating Pill Navbar Container -->
  <div class="fixed top-4 left-4 right-4 z-50">
    <nav class="pill-nav max-w-5xl mx-auto">
      <div class="flex items-center justify-between h-14 px-2">
        <!-- Logo/Brand (optional - currently hidden) -->
        <div class="hidden lg:flex items-center">
          <NuxtLink to="/" class="text-lg font-bold text-gradient">XQ</NuxtLink>
        </div>

        <!-- Desktop Navigation Centered -->
        <div class="flex-1 flex items-center justify-center">
          <div class="hidden md:flex items-center space-x-1">
            <NuxtLink 
              v-for="item in navigation" 
              :key="item.name"
              :to="item.href"
              :class="[
                'nav-link text-sm font-medium',
                $route.path === item.href ? 'active' : ''
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
            class="theme-toggle"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <i v-if="isDark" class="pi pi-sun text-base"></i>
            <i v-else class="pi pi-moon text-base"></i>
          </button>

          <!-- Mobile Menu Button -->
          <button
            @click.stop="toggleMobileMenu"
            class="md:hidden theme-toggle"
            aria-label="Toggle menu"
          >
            <svg v-if="!isMobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Navigation Dropdown -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-4 scale-95"
    >
      <div 
        v-if="isMobileMenuOpen" 
        class="md:hidden mt-2 max-w-5xl mx-auto glass-panel p-4"
      >
        <div class="flex flex-col space-y-2">
          <NuxtLink 
            v-for="item in navigation" 
            :key="item.name"
            :to="item.href"
            @click="closeMobileMenu"
            :class="[
              'nav-link font-medium px-4 py-2 rounded-full text-center',
              $route.path === item.href ? 'active bg-white/10' : ''
            ]"
          >
            {{ item.name }}
          </NuxtLink>
          
          <!-- Mobile Theme Toggle -->
          <button
            @click="toggleTheme"
            class="theme-toggle mx-2 flex items-center justify-center gap-2 py-2"
          >
            <i v-if="isDark" class="pi pi-sun"></i>
            <i v-else class="pi pi-moon"></i>
            <span>{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>

  <!-- Spacer to prevent content from hiding behind fixed navbar -->
  <div class="h-24"></div>
</template>

<script setup>
import { gsap } from 'gsap';

const { isDark, toggleTheme, initTheme } = useTheme()

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Experience', href: '/experience' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'Fitness', href: '/fitness' },
  { name: 'Contact', href: '/contact' }
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
    if (isMobileMenuOpen.value && !event.target.closest('nav') && !event.target.closest('.glass-panel')) {
      closeMobileMenu();
    }
  };
  document.addEventListener('click', handleClickOutside);
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});
</script>

<style scoped>
/* Ensure nav links have proper hover state */
.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--color-accent-gradient);
  transition: all 0.3s ease;
  transform: translateX(-50%);
  border-radius: 1px;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 60%;
}
</style>