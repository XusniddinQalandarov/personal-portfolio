<template>
        <div class="flex flex-col md:flex-row w-full h-screen md:h-full py-2 md:py-16 px-2 md:px-0">
            <!-- Profile Image - Hidden on mobile, shown on desktop -->
            <div ref="imageEl" class="flex md:w-2/5 items-start md:items-center justify-center pt-4 md:pt-0">
                <NuxtImg
                  src="/images/first.jpg"
                  alt="Profile Picture"
                  width="320"
                  height="320"
                  class="w-52 h-52 md:w-80 md:h-80 rounded-full object-cover shadow-lg md:-mt-32"
                />
            </div>
            
            <!-- Content Section -->
            <div class="w-full md:w-3/5 flex items-start md:items-center justify-center p-2 md:p-8 mt-4 md:mt-0">
                <div class="text-main w-full max-w-2xl">
                    <!-- Main Heading - Responsive text sizes -->
                    <h1 ref="titleEl" class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
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
                        class="rounded-2xl border border-white py-2 px-4 md:py-1 md:px-3 hover:bg-white hover:text-dark-charcoal transition-colors text-sm md:text-base"
                      >
                        About
                      </NuxtLink>

                      <NuxtLink 
                        to="/projects" 
                        class="rounded-2xl border border-white py-2 px-4 md:py-1 md:px-3 hover:bg-white hover:text-dark-charcoal transition-colors text-sm md:text-base"
                      >
                        Projects
                      </NuxtLink>

                      <NuxtLink 
                        to="/contact" 
                        class="rounded-2xl border border-white py-2 px-4 md:py-1 md:px-3 hover:bg-white hover:text-dark-charcoal transition-colors text-sm md:text-base"
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
  
  // Animate profile image (scale + fade in)
  tl.from(imageEl.value, {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
  });
  
  // Animate title (slide in from left + fade)
  tl.from(titleEl.value, {
    x: -50,
    opacity: 0,
    duration: 0.8,
  }, '-=0.4'); // Start 0.4s before previous animation ends
  
  // Animate subtitle (slide in from left + fade)
  tl.from(subtitleEl.value, {
    x: -50,
    opacity: 0,
    duration: 0.8,
  }, '-=0.5');
  
  // Animate buttons (slide up + fade, stagger each button)
  tl.from(buttonsEl.value?.children || [], {
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15, // 0.15s delay between each button
  }, '-=0.4');
});
</script>