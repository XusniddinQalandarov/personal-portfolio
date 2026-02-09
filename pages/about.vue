<template>
  <div class="min-h-screen py-24 px-4 md:px-0 transition-colors duration-300">
    <div class="max-w-6xl mx-auto w-full">
      
      <!-- Minimalist Header -->
      <div ref="headerEl" class="mb-24 text-center md:text-left opacity-0">
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-main uppercase mb-6 leading-none">
          Crafting<br>Digital<br>Reality
        </h1>
        <div class="h-1 w-24 bg-blue-500 mt-8 mb-8 md:ml-2"></div>
      </div>

      <!-- Main Split Layout -->
      <div class="flex flex-col md:flex-row gap-16 md:gap-32 items-start">
        
        <!-- Image Side (Sticky) -->
        <div class="w-full md:w-5/12 md:sticky md:top-32">
          <div ref="imageEl" class="relative group opacity-0">
            <div class="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700"></div>
            <NuxtImg
              src="/images/second.jpg"
              alt="About Xusniddin"
              width="600"
              height="800"
              class="relative rounded-[2rem] w-full object-cover shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
            />
          </div>
          
          <!-- Quick Stats (Floating) -->
          <div class="mt-12 grid grid-cols-2 gap-8">
            <div>
              <div class="text-4xl font-bold text-main mb-1">{{ yearsOfExperience }}+</div>
              <div class="text-xs font-mono text-sub uppercase tracking-widest">Years Experience</div>
            </div>
            <div>
              <div class="text-4xl font-bold text-main mb-1">10+</div>
              <div class="text-xs font-mono text-sub uppercase tracking-widest">Projects Shipped</div>
            </div>
          </div>
        </div>

        <!-- Text Side -->
        <div ref="textEl" class="w-full md:w-7/12 space-y-16 opacity-0">
          
          <!-- Intro -->
          <div>
            <h2 class="text-3xl font-bold text-main mb-8 leading-tight">
              A developer driven by <span class="text-blue-500">precision</span> and <span class="text-purple-500">purpose</span>.
            </h2>
            <div class="space-y-6 text-lg text-sub font-light leading-relaxed">
              <p>
                I build digital products that work as good as they look. My journey isn't just about code—it's about solving problems with clarity and efficiency.
              </p>
              <p>
                From interactive frontends to complex backend logic and AI agents, I treat every project as a piece of architecture: it needs a strong foundation, clean lines, and a purpose.
              </p>
            </div>
          </div>

          <!-- Quote (Minimal) -->
          <blockquote class="border-l-4 border-blue-500 pl-8 py-2">
            <p class="text-2xl md:text-3xl font-serif italic text-main mb-4">
              "Discipline in the gym. Precision in code."
            </p>
            <footer class="text-sm font-mono text-sub uppercase tracking-widest">
              — My Philosophy
            </footer>
          </blockquote>

          <!-- Interests (Minimal List) -->
          <div>
             <h3 class="text-sm font-bold tracking-[0.2em] text-sub uppercase mb-8">Beyond the IDE</h3>
             <ul class="space-y-6">
               <li v-for="item in interests" :key="item.text" class="flex items-start group">
                 <span class="text-xl mr-4 grayscale group-hover:grayscale-0 transition-all">{{ item.emoji }}</span>
                 <span class="text-lg text-sub font-light group-hover:text-main transition-colors">
                   {{ item.text }}
                 </span>
               </li>
             </ul>
          </div>

          <!-- Mission -->
          <div class="pt-8 border-t border-gray-200 dark:border-white/10">
            <h3 class="text-main text-xl font-bold mb-4">The Mission</h3>
            <p class="text-sub font-light leading-relaxed">
              To master technology, build impactful solutions, and create a life of freedom. I am committed to perpetual learning and leveraging AI to empower the next generation of digital experiences.
            </p>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const yearsOfExperience = computed(() => new Date().getFullYear() - 2023);

const headerEl = ref(null);
const imageEl = ref(null);
const textEl = ref(null);

const interests = [
  { emoji: '⚡', text: 'Pushing physical limits in the gym' },
  { emoji: '📚', text: 'Deep diving into system architecture & AI' },
  { emoji: '🤖', text: 'Building automated workflows and bots' },
  { emoji: '💡', text: 'Designing products that solve real problems' }
];

onMounted(() => {
  setTimeout(() => {
    if(process.client) {
      const tl = gsap.timeline();
      
      tl.fromTo(headerEl.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" })
        .fromTo(imageEl.value, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8")
        .fromTo(textEl.value, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8");
        
      // Parallax for image
      gsap.to(imageEl.value, {
        y: 50,
        scrollTrigger: {
          trigger: imageEl.value,
          start: "top center",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }, 700);
});

useSeoMeta({
  title: 'About - Xusniddin Qalandarov',
  description: 'Full-stack developer and disciplined creator.'
})
</script>

<style scoped>
.text-main { color: var(--color-text-primary); }
.text-sub { color: var(--color-text-secondary); }
.bg-primary { background-color: var(--color-bg-primary); }
</style>