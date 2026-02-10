<template>
  <div class="min-h-screen text-main relative overflow-hidden selection:bg-blue-500 selection:text-white transition-colors duration-500">
    
    <!-- Cinematic Hero Section (Always Dark/Immersive) -->
    <div ref="heroSection" class="relative h-screen flex items-center justify-center overflow-hidden">
      <!-- Background Image with Parallax -->
      <div class="absolute inset-0 z-0 bg-black">
        <div ref="heroBg" class="absolute inset-0 bg-cover bg-center scale-110 md:opacity-80 opacity-0" 
             style="background-image: url('/images/gym1.jpg');"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80"></div>
      </div>
      
      <!-- Minimalist Hero Content -->
      <div class="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 ref="heroTitle" class="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 uppercase text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-400 drop-shadow-2xl opacity-0">
          Iron & Code
        </h1>
        <p ref="heroSubtitle" class="text-xl md:text-2xl font-light tracking-widest text-gray-200 uppercase mb-12 drop-shadow-md opacity-0">
          Forging Resilience • Lifetime Natural • 81kg
        </p>
        <div ref="heroIcon" class="animate-bounce">
          <i class="pi pi-arrow-down text-2xl text-white/50"></i>
        </div>
      </div>
    </div>

    <!-- Editorial Philosophy Section -->
    <div class="py-32 px-6 md:px-12 max-w-5xl mx-auto relative z-10">
      <div ref="philosophyText" class="text-3xl md:text-5xl font-serif font-light leading-tight text-main text-center opacity-0">
        "The gym is my compiler for the mind. Errors are caught under the bar, and optimization happens one rep at a time."
      </div>
    </div>

    <!-- Routine Section (No Cards) -->
    <div ref="routineSection" class="py-24 relative z-10">
      <div class="px-6 md:px-12 mb-16 max-w-7xl mx-auto">
        <h2 class="text-sm font-bold tracking-[0.3em] uppercase text-blue-500 mb-4">The Routine</h2>
        <div class="h-px w-full bg-gray-200 dark:bg-white/10"></div>
      </div>

      <!-- Horizontal Scroll Concept or Vertical Editorial List -->
      <div class="flex flex-col gap-32 px-6 md:px-20 max-w-7xl mx-auto">
        <div v-for="(day, index) in workoutSplit" :key="day.id" 
             class="workout-row flex flex-col md:flex-row gap-8 md:gap-20 items-start group opacity-0">
          <!-- Day Indicator -->
          <div class="md:w-1/4 pt-2">
            <span class="text-6xl md:text-8xl font-black text-gray-200 dark:text-white/5 group-hover:text-blue-500/10 transition-colors duration-500 block -mb-4">
              0{{ index + 1 }}
            </span>
            <h3 class="text-3xl font-bold uppercase tracking-tight text-main">{{ day.name }}</h3>
            <p class="text-blue-500 font-mono text-sm mt-2">{{ day.focus }}</p>
          </div>

          <!-- Exercises List (Minimalist) -->
          <ul class="md:w-3/4 space-y-4 pt-4 border-l border-gray-200 dark:border-white/10 pl-8">
            <li v-for="exercise in day.exercises" :key="exercise" 
                class="text-xl md:text-2xl font-light text-sub group-hover:text-main transition-colors duration-300 flex items-center">
              <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-4 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              {{ exercise }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Parallax Image Break -->
    <div class="h-[60vh] relative overflow-hidden my-24 bg-black">
      <div ref="parallaxImg" class="absolute inset-0 bg-cover bg-center bg-fixed opacity-60 md:opacity-80"
           style="background-image: url('/images/gym2.webp');"></div>
      <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
        <h2 class="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter mix-blend-overlay">
          Endurance
        </h2>
      </div>
    </div>

    <!-- PRs & Stats (Large Typography) -->
    <div ref="statsSection" class="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
        
        <!-- Stats Column -->
        <div>
          <h2 class="text-sm font-bold tracking-[0.3em] uppercase text-purple-500 mb-12">Vital Statistics</h2>
          <div class="space-y-16">
            <div v-for="stat in stats" :key="stat.label" class="stat-item group opacity-0">
              <div class="text-6xl md:text-7xl font-light text-main mb-2 tracking-tight group-hover:text-purple-500 transition-colors">{{ stat.value }}</div>
              <div class="text-sm font-mono text-sub uppercase tracking-widest">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- PRs Column -->
        <div>
          <h2 class="text-sm font-bold tracking-[0.3em] uppercase text-blue-500 mb-12">Personal Records</h2>
          <div class="space-y-12">
            <div v-for="pr in prCategories" :key="pr.name" class="pr-category">
               <h3 class="text-2xl font-bold text-sub mb-6 flex items-center gap-3">
                 <i :class="pr.icon" class="text-blue-500 text-lg"></i> {{ pr.name }}
               </h3>
               <div class="space-y-4">
                 <div v-for="ex in pr.exercises" :key="ex.name" class="flex items-end justify-between border-b border-gray-200 dark:border-white/10 pb-2 group">
                   <span class="text-lg text-sub group-hover:text-main transition-colors">{{ ex.name }}</span>
                   <span class="text-2xl font-mono text-main">{{ ex.weight }}<span class="text-sm text-sub ml-1">kg</span></span>
                 </div>
               </div>
            </div>
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

const heroTitle = ref(null);
const heroSubtitle = ref(null);
const heroBg = ref(null);
const philosophyText = ref(null);
const routineSection = ref(null);
const parallaxImg = ref(null);

// Data
const workoutSplit = [
  { id: 1, name: "Push Day", focus: "Chest, Shoulders, Triceps", exercises: ["Bench Press (5x5)", "Overhead Press", "Incline Dumbbell Press", "Lateral Raises", "Tricep Extensions"] },
  { id: 2, name: "Pull Day", focus: "Back, Biceps, Rear Delts", exercises: ["Deadlifts (3x5)", "Pull-Ups (Weighted)", "Barbell Rows", "Face Pulls", "Hammer Curls"] },
  { id: 3, name: "Legs Day", focus: "Quads, Hamstrings, Calves", exercises: ["Squats (5x5)", "Romanian Deadlifts", "Leg Press", "Calf Raises", "Walking Lunges"] },
  { id: 4, name: "Cardio & Core", focus: "Endurance, Abs", exercises: ["5km Run", "Hanging Leg Raises", "Planks", "Sprints", "Box Jumps"] }
];

const stats = [
  { label: "Body Weight", value: "81kg" },
  { label: "Body Fat", value: "12-14%" },
  { label: "Training Age", value: "2 Years" }
];

const prCategories = [
  { name: "The Big Three", icon: "pi pi-bolt", exercises: [{ name: "Squat", weight: 120 }, { name: "Bench", weight: 90 }, { name: "Deadlift", weight: 140 }] },
  { name: "Calisthenics", icon: "pi pi-star", exercises: [{ name: "Pull-ups", weight: "+10" }, { name: "Dips", weight: "+15" }] }
];

onMounted(() => {
  // Hero Animation
  const tl = gsap.timeline();
  
  tl.fromTo(heroBg.value, { scale: 1.2, opacity: 0 }, { scale: 1.1, opacity: 0.6, duration: 2, ease: "power2.out" })
    .fromTo(heroTitle.value, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, "-=1.5")
    .fromTo(heroSubtitle.value, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=1");

  // Parallax Effect for Hero
  gsap.to(heroBg.value, {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
      trigger: heroBg.value,
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // Philosophy Text Reveal
  gsap.fromTo(philosophyText.value, 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: philosophyText.value,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );

  // Routine Items Stagger
  const workoutRows = document.querySelectorAll('.workout-row');
  workoutRows.forEach((row, i) => {
    gsap.fromTo(row,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: row,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Stats Count Up
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach((item) => {
    gsap.fromTo(item,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
        }
      }
    );
  });
});
</script>

<style scoped>
/* Smooth scrolling for anchor links if needed */
html {
  scroll-behavior: smooth;
}
</style>