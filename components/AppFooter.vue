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
                href="https://github.com/yourusername" 
                target="_blank"
                class="icon transition-colors"
                aria-label="GitHub"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
                </svg>
              </a>
              <a 
                href="https://linkedin.com/in/yourusername" 
                target="_blank"
                class="icon transition-colors"
                aria-label="LinkedIn"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                </svg>
              </a>
              <a 
                href="https://twitter.com/yourusername" 
                target="_blank"
                class="icon transition-colors"
                aria-label="Twitter"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a 
                href="mailto:your.email@example.com"
                class="icon transition-colors"
                aria-label="Email"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </a>
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
              <li><a href="https://github.com/yourusername" target="_blank" class="nav-link transition-colors">GitHub</a></li>
              <li><a href="https://linkedin.com/in/yourusername" target="_blank" class="nav-link transition-colors">LinkedIn</a></li>
              <li><NuxtLink to="/contact" class="nav-link transition-colors">Get In Touch</NuxtLink></li>
            </ul>
          </div>
        </div>
      </div>
    </main>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>