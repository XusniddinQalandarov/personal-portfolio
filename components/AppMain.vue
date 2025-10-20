<template>
        <div class="flex flex-col md:flex-row w-full h-full py-8 md:py-16 px-4 md:px-0">
            <!-- Profile Image - Hidden on mobile, shown on desktop -->
            <div ref="imageEl" class="hidden md:flex md:w-2/5 items-center justify-center">
                <NuxtImg
                  src="/images/img1.png"
                  alt="Profile Picture"
                  width="192"
                  height="192"
                  class="w-48 h-48 rounded-full object-cover shadow-lg"
                />
            </div>
            
            <!-- Content Section -->
            <div class="w-full md:w-3/5 flex items-center justify-center p-4 md:p-8">
                <div class="text-main w-full max-w-2xl">
                    <!-- Main Heading - Responsive text sizes -->
                    <h1 ref="titleEl" class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                      Building future-ready web solutions where design, performance, and AI meet.
                    </h1>

                    <div class="h-4 md:h-8"></div>

                    <!-- Subtitle - Responsive text sizes -->
                    <h2 ref="subtitleEl" class="text-base sm:text-lg md:text-xl font-semibold mb-4 md:mb-6">
                      Frontend Development | AI Automation | Fitness &amp; Discipline
                    </h2>

                    <div class="h-4 md:h-8"></div>

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