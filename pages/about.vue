<template>
  <div class="min-h-screen py-12 md:py-20">
    <div class="max-w-4xl mx-auto px-4">
      <div ref="headerEl" class="text-center mb-12 md:mb-16">
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">Crafting Digital Experiences. Forged by Discipline.</h1>
        <p class="text-base md:text-lg text-[#BDC1CAFF] mx-auto">
            A deeper dive into my journey, philosophy, and the principles that drive my work and life.
        </p>
      </div>

    </div>
        <!-- Main Content -->
       <div ref="mainContentEl" class="grid lg:grid-cols-2 gap-8 md:gap-12 items-center bg-[#171A1FFF] p-6 md:p-12 lg:p-24 shadow-lg mx-4 md:mx-auto rounded-lg">
          <div class="bg-[#1E2128FF] p-6 md:p-8 rounded-lg flex items-center justify-center max-h-[280px] max-w-[300px] mx-auto">
          <NuxtImg
            src="/images/img1.png"
            alt="About Me Photo"
            width="250"
            height="250"
            class="w-[200px] h-[200px] md:w-[250px] md:h-[250px] rounded-full object-cover shadow-md"
          />
          </div>
          <!-- Bio Section -->
          <div>
          <div class="-mt-4">
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4">My Story</h2>
            <div class="space-y-4 text-white text-sm md:text-base">
              <p>
                Hello! I'm a passionate full-stack developer with {{ yearsOfExperience }} years of experience 
                in creating digital solutions that make a difference. My journey in tech started with 
                curiosity and has evolved into a deep passion for building innovative applications.
              </p>
              <p>
                I specialize in modern web technologies and enjoy working on projects that challenge 
                me to grow and learn new skills. When I'm not coding, you can find me exploring new 
                technologies, contributing to open-source projects, or sharing knowledge with the community.
              </p>
              <p>
                I believe in writing clean, maintainable code and creating user experiences that are 
                both functional and delightful. Every project is an opportunity to solve real problems 
                and create value for users.
              </p>
            </div>
          </div>
        </div>
     </div>

    <div class="h-8 md:h-16"></div>


     <div ref="quoteEl" class="mt-8 md:mt-16 w-full md:w-[85%] lg:w-[70%] flex justify-center items-center bg-[#0F1729FF] rounded-lg p-6 md:p-12 lg:p-16 mx-auto">
        <h2 class="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold italic text-center">"Discipline in the gym. Precision in code."</h2>
     </div>


     <div class="h-8 md:h-16"></div>
     

  <div ref="purposeEl" class="mt-8 md:mt-16 w-full md:w-[80%] lg:w-[60%] mx-auto text-center px-4">
    <h2 class="text-white text-lg sm:text-xl md:text-2xl font-semibold mb-4">Driven by Purpose: Learning, Freedom, and Impact</h2>
    <p class="text-white text-sm md:text-base mx-auto">
      Every project, every workout, every new skill acquired is a step towards greater understanding and the freedom to create meaningful impact. I am committed to a path of perpetual learning and leveraging technology to empower individuals and businesses.
    </p>
  </div>


  </div>
    
</template>

<script setup>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const yearsOfExperience = computed(() => {
  const startYear = 2023; 
  return new Date().getFullYear() - startYear;
});

const headerEl = ref(null);
const mainContentEl = ref(null);
const quoteEl = ref(null);
const purposeEl = ref(null);

onMounted(() => {
  // Header animation - fade in from top
  gsap.from(headerEl.value, {
    y: -30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  });
  
  // Main content - slide in from left with scroll trigger
  gsap.from(mainContentEl.value, {
    x: -50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: mainContentEl.value,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
  
  // Quote - scale in with scroll trigger
  gsap.from(quoteEl.value, {
    scale: 0.9,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.2)',
    scrollTrigger: {
      trigger: quoteEl.value,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
  
  // Purpose section - fade in from bottom
  gsap.from(purposeEl.value, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: purposeEl.value,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
});
</script>