<template>
  <div class="min-h-screen py-24 px-4 md:px-0 transition-colors duration-300">
    <div class="max-w-5xl mx-auto w-full">
      
      <!-- Minimalist Header -->
      <div ref="headerEl" class="mb-24 text-center md:text-left opacity-0">
        <h1 class="text-6xl md:text-8xl font-display font-black tracking-tighter text-main uppercase mb-6 leading-none">
          {{ $t('about.title1') }}<br>{{ $t('about.title2') }}<br>{{ $t('about.title3') }}
        </h1>
        <div class="h-1 w-24 bg-accent-amber mt-8 mb-8 md:ml-2"></div>
      </div>

      <!-- Full-Width Editorial Layout (No Photo) -->
      <div ref="textEl" class="space-y-16 opacity-0">
        
        <!-- Intro -->
        <div class="grid md:grid-cols-12 gap-12">
          <div class="md:col-span-7">
            <h2 class="text-3xl font-display font-bold text-main mb-8 leading-tight">
              <i18n-t keypath="about.introHeading">
                <template #precision>
                  <span class="text-accent">{{ $t('about.precision') }}</span>
                </template>
                <template #purpose>
                  <span class="text-accent">{{ $t('about.purpose') }}</span>
                </template>
              </i18n-t>
            </h2>
            <div class="space-y-6 text-lg text-sub font-light leading-relaxed">
              <p>{{ $t('about.introP1') }}</p>
              <p>{{ $t('about.introP2') }}</p>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="md:col-span-5 flex flex-col justify-center">
            <div class="grid grid-cols-2 gap-8">
              <div>
                <div class="text-5xl font-display font-bold text-main mb-1">{{ yearsOfExperience }}+</div>
                <div class="text-xs font-mono text-sub uppercase tracking-widest">{{ $t('about.yearsExperience') }}</div>
              </div>
              <div>
                <div class="text-5xl font-display font-bold text-main mb-1">10+</div>
                <div class="text-xs font-mono text-sub uppercase tracking-widest">{{ $t('about.projectsShipped') }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quote (Minimal) -->
        <blockquote class="border-l-4 border-accent-amber pl-8 py-2">
          <p class="text-2xl md:text-3xl font-serif italic text-main mb-4">
            {{ $t('about.quote') }}
          </p>
          <footer class="text-sm font-mono text-sub uppercase tracking-widest">
            {{ $t('about.quoteAuthor') }}
          </footer>
        </blockquote>

        <!-- Interests (Minimal List) -->
        <div>
           <h3 class="text-sm font-bold tracking-[0.2em] text-sub uppercase mb-8">{{ $t('about.beyondIde') }}</h3>
           <ul class="space-y-6">
             <li v-for="item in interests" :key="item.key" class="flex items-start group">
               <span class="text-xl mr-4 grayscale group-hover:grayscale-0 transition-all">{{ item.emoji }}</span>
               <span class="text-lg text-sub font-light group-hover:text-main transition-colors">
                 {{ $t(item.key) }}
               </span>
             </li>
           </ul>
        </div>

        <!-- Mission -->
        <div class="pt-8 border-t border-gray-200 dark:border-white/10">
          <h3 class="text-main text-xl font-display font-bold mb-4">{{ $t('about.missionTitle') }}</h3>
          <p class="text-sub font-light leading-relaxed">
            {{ $t('about.missionText') }}
          </p>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const { t } = useI18n()

const yearsOfExperience = computed(() => new Date().getFullYear() - 2023);

const headerEl = ref(null);
const textEl = ref(null);

const interests = [
  { emoji: '⚡', key: 'about.interest1' },
  { emoji: '📚', key: 'about.interest2' },
  { emoji: '🤖', key: 'about.interest3' },
  { emoji: '💡', key: 'about.interest4' }
];

onMounted(() => {
  if(process.client) {
    const tl = gsap.timeline();
    
    tl.fromTo(headerEl.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" })
      .fromTo(textEl.value, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8");
  }
});

useSeoMeta({
  title: () => t('about.seoTitle'),
  description: () => t('about.seoDescription')
})
</script>

<style scoped>
.text-main { color: var(--color-text-primary); }
.text-sub { color: var(--color-text-secondary); }
.text-accent { color: var(--color-accent-primary); }
.bg-primary { background-color: var(--color-bg-primary); }
</style>