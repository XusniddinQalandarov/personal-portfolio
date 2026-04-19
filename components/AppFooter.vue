<template>
  <footer class="py-16 px-6 md:px-12">
    <div class="max-w-6xl mx-auto">
      
      <!-- Top Section: Large CTA -->
      <div class="text-center mb-20">
        <h2 class="text-4xl md:text-6xl font-display font-black text-main tracking-tighter mb-6">
          Let's build something<br>
          <span class="text-gradient">extraordinary.</span>
        </h2>
        <NuxtLink to="/contact" class="inline-flex items-center gap-3 px-8 py-4 bg-accent-amber text-dark-900 font-bold text-sm uppercase tracking-[0.15em] rounded-full hover:bg-accent-copper transition-all duration-300 group">
          {{ $t('contact.sendMessage') || 'Get In Touch' }}
          <i class="pi pi-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </NuxtLink>
      </div>

      <!-- Divider -->
      <div class="h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent mb-12"></div>

      <!-- Bottom Section: Minimal Info Row -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-8">
        
        <!-- Left: Brand & Copyright -->
        <div class="text-center md:text-left">
          <span class="font-display font-bold text-lg text-gradient">Xusniddin Qalandarov</span>
          <p class="text-sub text-sm mt-1">
            {{ $t('footer.copyright', { year: currentYear }) }}
          </p>
        </div>

        <!-- Center: Quick Links -->
        <div class="flex flex-wrap items-center justify-center gap-6">
          <NuxtLink to="/about" class="footer-link">{{ $t('nav.about') }}</NuxtLink>
          <NuxtLink to="/projects" class="footer-link">{{ $t('nav.projects') }}</NuxtLink>
          <NuxtLink to="/experience" class="footer-link">{{ $t('nav.experience') }}</NuxtLink>
          <a href="/resume.pdf" target="_blank" class="footer-link">{{ $t('footer.resume') }}</a>
        </div>

        <!-- Right: Social Icons -->
        <div class="flex items-center gap-4">
          <a href="https://github.com/Xusniddin-devv" target="_blank" class="social-icon" aria-label="GitHub">
            <i class="pi pi-github text-lg"></i>
          </a>
          <a href="https://www.linkedin.com/in/xusniddin-qalandarov/" target="_blank" class="social-icon" aria-label="LinkedIn">
            <i class="pi pi-linkedin text-lg"></i>
          </a>
          <a href="https://x.com/Xusniddin_Q" target="_blank" class="social-icon" aria-label="X">
            <i class="pi pi-twitter text-lg"></i>
          </a>
          <a href="https://t.me/invaluable_me" target="_blank" class="social-icon" aria-label="Telegram">
            <i class="pi pi-send text-lg"></i>
          </a>
        </div>

      </div>

    </div>
  </footer>
</template>

<script setup>
import 'primeicons/primeicons.css';
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--color-text-secondary);
  transition: all 0.3s ease;
}

.social-icon:hover {
  color: var(--color-accent-primary);
  transform: translateY(-3px);
}

.footer-link {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: var(--color-accent-primary);
}
</style>