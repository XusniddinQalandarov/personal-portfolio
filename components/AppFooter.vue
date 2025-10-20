<template>
  <main class="bg-dark-charcoal border-t glow-border">
  <div class="max-w-6xl mx-auto px-4 py-12">
        <div class="grid md:grid-cols-4 gap-8">
          <!-- About Section -->
          <div class="md:col-span-2">
            <h3 class="text-lg font-semibold text-main mb-4">Xusniddin Qalandarov</h3>
            <p class="text-sub mb-4">
              Passionate full-stack developer creating amazing digital experiences. 
              Always excited to take on new challenges and collaborate on interesting projects.
            </p>
            <div class="flex space-x-4">
              <a 
                href="https://github.com/Xusniddin-devv" 
                target="_blank"
                class="icon transition-colors pi pi-github text-2xl"
                aria-label="GitHub"
              ></a>
              <a 
                href="https://www.linkedin.com/in/xusniddin-qalandarov/" 
                target="_blank"
                class="icon transition-colors pi pi-linkedin text-2xl"
                aria-label="LinkedIn"
              ></a>
              <a 
                href="https://x.com/Xusniddin_Q" 
                target="_blank"
                class="icon transition-colors pi pi-twitter text-2xl"
                aria-label="X"
              ></a>
              <a 
                href="mailto:xusniddinqalandarov2004@gmail.com"
                class="icon transition-colors pi pi-envelope text-2xl"
                aria-label="Email"
              ></a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold text-main mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><NuxtLink to="/" class="nav-link transition-colors">Home</NuxtLink></li>
              <li><NuxtLink to="/about" class="nav-link transition-colors">About</NuxtLink></li>
              <li><NuxtLink to="/projects" class="nav-link transition-colors">Projects</NuxtLink></li>
              <li><NuxtLink to="/contact" class="nav-link transition-colors">Contact</NuxtLink></li>
            </ul>
          </div>

          <!-- Resources -->
          <div>
            <h3 class="text-lg font-semibold text-main mb-4">Resources</h3>
            <ul class="space-y-2">
              <li><a href="/resume.pdf" target="_blank" class="nav-link transition-colors">Resume</a></li>
              <li><a href="https://github.com/XusniddinQalandarov" target="_blank" class="nav-link transition-colors">GitHub</a></li>
              <li><a href="https://linkedin.com/in/xusniddin-qalandarov/" target="_blank" class="nav-link transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </div>
    </main>
</template>

<script setup>
import 'primeicons/primeicons.css';
const currentYear = new Date().getFullYear();
</script>