<template>
  <footer class="py-8 px-4 md:px-8">
    <div class="max-w-5xl mx-auto">
      <div class="pill-footer p-8 md:p-12">
        <div class="grid md:grid-cols-3 gap-8 md:gap-12">
          <!-- About Section -->
          <div class="md:col-span-1">
            <h3 class="text-xl font-bold text-gradient mb-4">Xusniddin Qalandarov</h3>
            <p class="text-sub text-sm leading-relaxed mb-6">
              {{ $t('footer.description') }}
            </p>
            <div class="flex space-x-4">
              <a 
                href="https://github.com/Xusniddin-devv" 
                target="_blank"
                class="social-icon"
                aria-label="GitHub"
              >
                <i class="pi pi-github text-xl"></i>
              </a>
              <a 
                href="https://www.linkedin.com/in/xusniddin-qalandarov/" 
                target="_blank"
                class="social-icon"
                aria-label="LinkedIn"
              >
                <i class="pi pi-linkedin text-xl"></i>
              </a>
              <a 
                href="https://x.com/Xusniddin_Q" 
                target="_blank"
                class="social-icon"
                aria-label="X"
              >
                <i class="pi pi-twitter text-xl"></i>
              </a>
              <a 
                href="mailto:xusniddinqalandarov2004@gmail.com"
                class="social-icon"
                aria-label="Email"
              >
                <i class="pi pi-envelope text-xl"></i>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold text-main mb-4">{{ $t('footer.quickLinks') }}</h3>
            <ul class="space-y-3">
              <li><NuxtLink to="/" class="footer-link">{{ $t('nav.home') }}</NuxtLink></li>
              <li><NuxtLink to="/about" class="footer-link">{{ $t('nav.about') }}</NuxtLink></li>
              <li><NuxtLink to="/projects" class="footer-link">{{ $t('nav.projects') }}</NuxtLink></li>
              <li><NuxtLink to="/contact" class="footer-link">{{ $t('nav.contact') }}</NuxtLink></li>
            </ul>
          </div>

          <!-- Resources -->
          <div>
            <h3 class="text-lg font-semibold text-main mb-4">{{ $t('footer.resources') }}</h3>
            <ul class="space-y-3">
              <li><a href="/resume.pdf" target="_blank" class="footer-link">{{ $t('footer.resume') }}</a></li>
              <li><a href="https://github.com/XusniddinQalandarov" target="_blank" class="footer-link">GitHub</a></li>
              <li><a href="https://linkedin.com/in/xusniddin-qalandarov/" target="_blank" class="footer-link">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <!-- Divider -->
        <div class="mt-8 pt-8 border-t border-white/10">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-sub text-sm text-center md:text-left">
              {{ $t('footer.copyright', { year: currentYear }) }}
            </p>
            
          </div>
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
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--color-text-primary);
  transition: all 0.3s ease;
}

.social-icon:hover {
  border-color: var(--glass-border-accent);
  color: var(--color-accent-primary);
  box-shadow: var(--glow-cyan);
  transform: translateY(-3px);
}

.footer-link {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-link:hover {
  color: var(--color-accent-primary);
  transform: translateX(4px);
}
</style>