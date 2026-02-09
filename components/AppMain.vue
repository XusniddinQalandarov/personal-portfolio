<template>
  <div class="h-screen w-full flex flex-col justify-center px-6 md:px-24 overflow-hidden relative">
    
    <!-- Background Gradient Mesh -->
    <div class="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none">
      <div class="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-500/30 rounded-full blur-[100px] animate-float"></div>
      <div class="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-500/30 rounded-full blur-[100px] animate-float" style="animation-delay: 2s"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto w-full">
      
      <!-- Greeting / Tag -->
      <div ref="tagEl" class="mb-6 flex items-center gap-3 opacity-0">
        <span class="w-12 h-[1px] bg-blue-500"></span>
        <span class="text-blue-500 font-mono text-sm uppercase tracking-widest">Full-Stack Developer</span>
      </div>

      <!-- Main Headline -->
      <h1 ref="titleEl" class="text-5xl md:text-7xl lg:text-9xl font-black text-main leading-[0.9] tracking-tighter mb-8 uppercase opacity-0">
        Building<br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Digital</span><br>
        Future.
      </h1>

      <!-- Subtitle -->
      <p ref="subtitleEl" class="text-lg md:text-2xl text-sub max-w-2xl font-light leading-relaxed mb-12 opacity-0">
        I engineer high-performance web applications and AI agents where design meets precision. Forging code with discipline.
      </p>

      <!-- Buttons -->
      <div ref="buttonsEl" class="flex flex-wrap items-center gap-6 opacity-0">
        <NuxtLink to="/projects" class="group relative px-8 py-4 bg-main text-charcoal font-bold text-lg rounded-full overflow-hidden hover:text-black transition-colors duration-300">
          <span class="relative z-10 flex items-center">
            View Projects 
            <i class="pi pi-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
          </span>
        </NuxtLink>

        <NuxtLink to="/contact" class="px-8 py-4 border border-main/20 text-main font-medium rounded-full hover:border-main transition-colors text-lg">
          Contact Me
        </NuxtLink>
      </div>

    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-12 left-6 md:left-24 animate-bounce">
      <i class="pi pi-arrow-down text-2xl text-sub"></i>
    </div>

    <!-- Floating Image (Right Side) -->
    <div ref="imageEl" class="absolute top-1/2 right-[5%] -translate-y-1/2 hidden lg:block w-[400px] h-[500px] z-50 opacity-0">
      <NuxtImg
        src="/images/first.jpg"
        alt="Profile"
        class="w-full h-full object-cover rounded-[2rem] shadow-2xl transition-all duration-700 hover:scale-105 opacity-80 hover:opacity-100"
      />
    </div>

  </div>
</template>

<script setup>
import { gsap } from 'gsap';

const tagEl = ref(null);
const titleEl = ref(null);
const subtitleEl = ref(null);
const buttonsEl = ref(null);
const imageEl = ref(null);

onMounted(() => {
  const tl = gsap.timeline();

  tl.fromTo(tagEl.value, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out" })
    .fromTo(titleEl.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=0.8")
    .fromTo(subtitleEl.value, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8")
    .fromTo(buttonsEl.value, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8")
    .fromTo(imageEl.value, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, "-=1");
});
</script>

<style scoped>
.bg-main {
  /* Adapts to theme */
  background: var(--color-text-primary);
}
.text-charcoal {
  color: var(--color-bg-primary);
}
.border-main\/20 {
  border-color: rgba(var(--color-text-primary-rgb), 0.2); 
  /* Fallback if rgb var missing: */
  border-color: currentColor;
  opacity: 0.6;
}
</style>