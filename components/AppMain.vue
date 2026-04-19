<template>
  <div class="h-screen w-full overflow-hidden relative flex items-center">
    
    <!-- Full-bleed background image, face positioned center-right -->
    <div class="absolute inset-0 z-0">
      <div 
        ref="heroBg"
        class="absolute inset-0 opacity-0"
        style="
          background-image: url('/images/hero3.webp');
          background-size: cover;
          background-position: center 45%;
        "
      ></div>
      <!-- Strong dark gradient on the left for text, fades out by center -->
      <div class="absolute inset-0" style="background: linear-gradient(to right, rgba(12,10,9,0.97) 0%, rgba(12,10,9,0.88) 30%, rgba(12,10,9,0.55) 52%, rgba(12,10,9,0.08) 72%, transparent 100%);"></div>
      <!-- Subtle top/bottom vignette -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50"></div>
    </div>

    <!-- Content pinned to the left ~40% -->
    <div class="relative z-10 w-full px-8 md:px-20">
      <div class="max-w-sm md:max-w-md lg:max-w-lg">

        <!-- Tag -->
        <div ref="tagEl" class="mb-5 flex items-center gap-3 opacity-0">
          <span class="w-8 h-px bg-accent-amber"></span>
          <span class="text-accent-amber font-mono text-xs uppercase tracking-widest">{{ $t('home.tag') }}</span>
        </div>

        <!-- Headline — tighter sizing so it stays in left column -->
        <h1 ref="titleEl" class="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter mb-6 uppercase opacity-0">
          {{ $t('home.headline1') }}<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-accent-amber to-accent-copper">{{ $t('home.headline2') }}</span><br>
          {{ $t('home.headline3') }}
        </h1>

        <!-- Subtitle -->
        <p ref="subtitleEl" class="text-base md:text-lg text-gray-300 font-light leading-relaxed mb-10 opacity-0">
          {{ $t('home.subtitle') }}
        </p>

        <!-- Buttons -->
        <div ref="buttonsEl" class="flex flex-wrap items-center gap-4 opacity-0">
          <NuxtLink to="/projects" class="group px-6 py-3 bg-accent-amber text-dark-900 font-bold text-sm rounded-full hover:bg-accent-copper transition-colors duration-300 flex items-center">
            {{ $t('home.viewProjects') }}
            <i class="pi pi-arrow-right ml-2 group-hover:translate-x-1 transition-transform text-sm"></i>
          </NuxtLink>
          <NuxtLink to="/contact" class="px-6 py-3 border border-white/30 text-white font-medium rounded-full hover:border-accent-amber hover:text-accent-amber transition-colors text-sm">
            {{ $t('home.contactMe') }}
          </NuxtLink>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { gsap } from 'gsap';

const tagEl = ref(null);
const titleEl = ref(null);
const subtitleEl = ref(null);
const buttonsEl = ref(null);
const heroBg = ref(null);

onMounted(() => {
  const tl = gsap.timeline();
  tl.fromTo(heroBg.value, { scale: 1.08, opacity: 0 }, { scale: 1.02, opacity: 1, duration: 2, ease: "power2.out" })
    .fromTo(tagEl.value, { x: -15, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=1.2")
    .fromTo(titleEl.value, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "power3.out" }, "-=0.8")
    .fromTo(subtitleEl.value, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.8")
    .fromTo(buttonsEl.value, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.8");
});
</script>