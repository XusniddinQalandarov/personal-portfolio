<template>
  <div class="min-h-screen py-12 md:py-20">
    <div class="max-w-4xl mx-auto px-4">
      <div ref="headerEl" class="text-center mb-12 md:mb-16">
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-main">Crafting Digital Experiences. Forged by Discipline.</h1>
        <p class="text-base md:text-lg text-sub mx-auto">
            A deeper dive into my journey, philosophy, and the principles that drive my work and life.
        </p>
      </div>

    </div>
        <!-- Main Content -->
       <div ref="mainContentEl" class="grid lg:grid-cols-2 gap-8 md:gap-12 items-center glass-panel p-6 md:p-12 lg:p-24 shadow-lg mx-4 md:mx-auto rounded-lg">
          <div class="flex items-center justify-center mx-auto">
          <NuxtImg
            src="/images/second.jpg"
            alt="About Me Photo"
            width="600"
            height="600"
            quality="90"
            format="webp"
            class="w-[200px] h-[200px] md:w-[250px] md:h-[250px] lg:w-[500px] lg:h-[600px] rounded-full lg:rounded-3xl object-cover shadow-lg"
          />
          </div>
          <!-- Bio Section -->
          <div>
          <div class="-mt-4">
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-semibold text-main mb-4">My Story</h2>
                        <div class="space-y-6 text-main text-sm md:text-base leading-relaxed">
              <p>
                Hey, I'm a full-stack developer with real-world experience in building scalable, meaningful digital products — but my journey is about more than just writing code. I come from a place where success isn't handed to you — it's built line by line, like software.
              </p>
              
              <p>
                What began as curiosity has transformed into a mission: to master technology, build impactful solutions, and create a life of freedom — for myself, my family, and others who dream big.
              </p>
              
              <p>
                Over the past {{ yearsOfExperience }} years, I've worked professionally as a frontend developer (Angular & Nuxt), expanded into full-stack development, and built AI-powered applications, Telegram bots, and automation tools. I love taking an idea from concept to deployment — frontend, backend, logic, UX, AI integration — the full journey.
              </p>

              <p>
                I'm currently leveling up my expertise to senior-level standards, mastering product thinking, building automation startups, and exploring how AI can power the next generation of digital experiences.
              </p>

              <div class="mt-6">
                <p class="font-medium mb-3">When I'm not developing, I'm probably:</p>
                <ul class="space-y-2 ml-4">
                  <li>⚡ Lifting weights and pushing physical limits</li>
                  <li>📚 Learning something that makes me sharper</li>
                  <li>🤖 Exploring AI workflows and building side products</li>
                  <li>💡 Planning how to build something that impacts thousands</li>
                </ul>
              </div>

              <div class="text-center mt-8 pt-4">
                <p class="text-lg font-medium mb-2">
                  I don't just build apps — I build solutions, freedom, and a future where technology works for people, not the other way around.
                </p>
                <p class="text-xl font-bold">
                  Let's create something game-changing.
                </p>
              </div>
            </div>
          </div>
        </div>
     </div>

    <div class="h-8 md:h-16"></div>


     <div ref="quoteEl" class="mt-8 md:mt-16 w-full md:w-[85%] lg:w-[70%] flex justify-center items-center glass-panel rounded-lg p-6 md:p-12 lg:p-16 mx-auto">
        <h2 class="text-main text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold italic text-center">"Discipline in the gym. Precision in code."</h2>
     </div>


     <div class="h-8 md:h-16"></div>
     

  <div ref="purposeEl" class="mt-8 md:mt-16 w-full md:w-[80%] lg:w-[60%] mx-auto text-center px-4">
    <h2 class="text-main text-lg sm:text-xl md:text-2xl font-semibold mb-4">Driven by Purpose: Learning, Freedom, and Impact</h2>
    <p class="text-main text-sm md:text-base mx-auto">
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