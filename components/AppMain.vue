<template>
        <div class="flex flex-col md:flex-row w-full h-screen md:h-full py-2 md:py-16 px-2 md:px-0 relative overflow-hidden">
            <!-- Profile Image - Hidden on mobile, shown on desktop -->
            <div ref="imageEl" class="flex md:w-2/5 items-start md:items-center justify-center pt-4 md:pt-0 relative z-10">
                <NuxtImg
                  src="/images/first.jpg"
                  alt="Profile Picture"
                  width="320"
                  height="320"
                  class="w-52 h-52 md:w-80 md:h-80 rounded-full object-cover shadow-lg md:-mt-32"
                />
            </div>
            
            <!-- Content Section -->
            <div class="w-full md:w-3/5 flex items-start md:items-center justify-center p-2 md:p-8 mt-4 md:mt-0 relative z-10">
                <div class="text-main w-full max-w-2xl">
                    <!-- Main Heading - Responsive text sizes -->
                    <h1 ref="titleEl" class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight text-shadow-lg">
                      Building future-ready web solutions where design, performance, and AI meet.
                    </h1>

                    <div class="h-2 md:h-8"></div>

                    <!-- Subtitle - Responsive text sizes -->
                    <h2 ref="subtitleEl" class="text-base sm:text-lg md:text-xl font-semibold mb-4 md:mb-6">
                      Frontend Development | AI Automation | Fitness &amp; Discipline
                    </h2>

                    <div class="h-2 md:h-8"></div>

                    <!-- Action Buttons - Responsive layout -->
                    <div ref="buttonsEl" class="flex flex-wrap items-center gap-3 md:gap-8">
                      <NuxtLink 
                        to="/about" 
                        class="rounded-2xl border-2 border-white py-2 px-4 md:py-2 md:px-4 hover:bg-white hover:text-black transition-all duration-300 text-sm md:text-base backdrop-blur-md bg-white/20 font-medium"
                      >
                        About
                      </NuxtLink>

                      <NuxtLink 
                        to="/projects" 
                        class="rounded-2xl border-2 border-white py-2 px-4 md:py-2 md:px-4 hover:bg-white hover:text-black transition-all duration-300 text-sm md:text-base backdrop-blur-md bg-white/20 font-medium"
                      >
                        Projects
                      </NuxtLink>

                      <NuxtLink 
                        to="/contact" 
                        class="rounded-2xl border-2 border-white py-2 px-4 md:py-2 md:px-4 hover:bg-white hover:text-black transition-all duration-300 text-sm md:text-base backdrop-blur-md bg-white/20 font-medium"
                      >
                        Contact
                      </NuxtLink>
                    </div>

                </div>
            </div>
        </div>
</template>
 
<script setup>
import { NuxtImg } from '#components';
import { gsap } from 'gsap';

const imageEl = ref(null);
const titleEl = ref(null);
const subtitleEl = ref(null);
const buttonsEl = ref(null);

onMounted(() => {
  // Create a timeline for smooth sequential animations
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  // Set initial states (invisible)
  gsap.set([imageEl.value, titleEl.value, subtitleEl.value], { opacity: 0 });
  gsap.set(imageEl.value, { scale: 0.8 });
  gsap.set([titleEl.value, subtitleEl.value], { x: -50 });
  gsap.set(buttonsEl.value?.children || [], { y: 20, opacity: 0 });
  
  // Animate to visible states
  tl.to(imageEl.value, {
    scale: 1,
    opacity: 1,
    duration: 0.8,
  })
  .to(titleEl.value, {
    x: 0,
    opacity: 1,
    duration: 0.8,
  }, '-=0.4')
  .to(subtitleEl.value, {
    x: 0,
    opacity: 1,
    duration: 0.8,
  }, '-=0.5')
  .to(buttonsEl.value?.children || [], {
    y: 0,
    opacity: 1,
    duration: 0.6,
    stagger: 0.15,
  }, '-=0.4');
});
</script>

<style scoped>
.text-shadow-lg {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

/* Enhanced button styles */
.rounded-2xl.backdrop-blur-md {
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1), 
              0 2px 10px rgba(255, 255, 255, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.rounded-2xl.backdrop-blur-md:hover {
  box-shadow: 0 8px 30px rgba(255, 255, 255, 0.3), 
              0 4px 15px rgba(255, 255, 255, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.9);
}
</style>