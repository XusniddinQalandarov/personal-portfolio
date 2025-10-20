<template>
  <div class="min-h-screen py-12 md:py-20 bg-dark-charcoal">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Hero Section -->
      <div ref="heroEl" class="text-center mb-12 md:mb-16">
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-main">
          Forging Discipline, Building Resilience
        </h1>
        <p class="text-base md:text-lg lg:text-xl text-sub max-w-2xl mx-auto mb-4">
          The Synergy of Strength and Code in Life
        </p>
        <p class="text-base md:text-lg text-main font-semibold mb-4">
          Lifetime Natural • 81kg
        </p>
        <button @click="scrollToWorkouts" class="btn-primary px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold transition-all hover:scale-105 text-sm md:text-base">
          View My Training
        </button>
      </div>

      <!-- Training Philosophy -->
      <div ref="philosophyEl" class="text-center mb-12 md:mb-16">
        <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-main">My Training Routine</h2>
        <p class="text-base md:text-lg text-sub max-w-3xl mx-auto">
          Building consistency and discipline through structured training. Starting my fitness journey with a focus on compound movements and daily habits.
        </p>
      </div>

      <!-- Weekly Split Cards -->
      <div ref="workoutsEl" id="workouts" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-20">
        <div 
          v-for="day in workoutSplit" 
          :key="day.id"
          class="bg-[#1E2128FF] p-4 md:p-6 rounded-lg hover:scale-105 transition-all duration-300 cursor-pointer"
          @click="selectDay(day.id)"
          :class="selectedDay === day.id ? 'ring-2 ring-cyan-400/50' : ''"
        >
          <div class="flex items-center gap-4 mb-5 md:mb-6">
            <i :class="day.icon" class="text-3xl md:text-4xl flex-shrink-0" :style="{ color: day.color }"></i>
            <h3 class="text-xl md:text-2xl font-bold text-main">{{ day.name }}</h3>
          </div>
          
          <p class="text-sub mb-5 md:mb-6 text-sm md:text-base leading-relaxed">{{ day.focus }}</p>
          
          <ul class="space-y-2 md:space-y-3">
            <li 
              v-for="exercise in day.exercises" 
              :key="exercise"
              class="text-sm md:text-base text-sub flex items-center"
            >
              <span class="w-2 h-2 md:w-2.5 md:h-2.5 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></span>
              {{ exercise }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Personal Records Section -->
      <div ref="prsEl" class="mb-12 md:mb-16">
        <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-main">
          Discipline & Progress
        </h2>
        
        <!-- PR Categories -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div 
            v-for="category in prCategories" 
            :key="category.name"
            class="bg-[#1E2128FF] p-4 md:p-6 rounded-lg"
          >
            <div class="flex items-center gap-4 mb-5 md:mb-6">
              <i :class="category.icon" class="text-3xl md:text-4xl text-cyan-400 flex-shrink-0"></i>
              <h3 class="text-xl md:text-2xl font-bold text-main">{{ category.name }}</h3>
            </div>
            
            <div class="space-y-3 md:space-y-4">
              <div 
                v-for="exercise in category.exercises" 
                :key="exercise.name"
                class="flex justify-between items-center p-2 md:p-3 bg-gray-800/50 rounded"
              >
                <span class="text-sub font-medium text-sm md:text-base">{{ exercise.name }}</span>
                <span class="text-cyan-400 font-bold text-sm md:text-base">{{ exercise.pr }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Stats -->
      <div ref="statsEl" class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
        <div 
          v-for="stat in progressStats" 
          :key="stat.label"
          class="bg-[#1E2128FF] p-4 md:p-6 rounded-lg text-center"
        >
          <div class="text-2xl md:text-3xl font-bold text-cyan-400 mb-1 md:mb-2">{{ stat.value }}</div>
          <div class="text-sub text-xs md:text-sm">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Training Philosophy Quote -->
      <div ref="quoteEl" class="text-center bg-[#1E2128FF] p-6 md:p-8 rounded-lg">
        <blockquote class="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-main mb-4 italic">
          "The iron never lies to you. You can walk outside and listen to all kinds of talk, get told you're a god or a total bastard. The iron will always kick you the real deal."
        </blockquote>
        <cite class="text-sub text-sm md:text-base">- Henry Rollins</cite>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const selectedDay = ref(null);

const heroEl = ref(null);
const philosophyEl = ref(null);
const workoutsEl = ref(null);
const prsEl = ref(null);
const statsEl = ref(null);
const quoteEl = ref(null);

onMounted(() => {
  nextTick(() => {
    animateFitness();
  });
});

const animateFitness = () => {
  try {
    console.log('Fitness animations initialized');
  
  // Hero section - multiple elements animating
  const heroTitle = heroEl.value?.querySelector('h1');
  const heroSubtitles = heroEl.value?.querySelectorAll('p');
  const heroButton = heroEl.value?.querySelector('button');
  
  if (heroTitle) {
    gsap.from(heroTitle, {
      y: -40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });
  }
  
  if (heroSubtitles.length > 0) {
    gsap.from(heroSubtitles, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      delay: 0.3,
      ease: 'power3.out',
    });
  }
  
  if (heroButton) {
    // Ensure button starts visible in DOM
    gsap.set(heroButton, { opacity: 1, scale: 1 });
    
    gsap.from(heroButton, {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      delay: 0.7,
      ease: 'back.out(1.7)',
    });
  }
  
  // Philosophy section with stagger
  const philoTitle = philosophyEl.value?.querySelector('h2');
  const philoText = philosophyEl.value?.querySelector('p');
  
  gsap.from(philoTitle, {
    y: -20,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: philosophyEl.value,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
  
  gsap.from(philoText, {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    scrollTrigger: {
      trigger: philosophyEl.value,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
  
  // Workout cards with enhanced animations
  if (workoutsEl.value) {
    const workoutCards = workoutsEl.value.querySelectorAll(':scope > div');
    if (workoutCards.length > 0) {
      // Animate cards
      gsap.from(workoutCards, {
        y: 50,
        opacity: 0,
        scale: 0.9,
        rotation: -5,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: workoutsEl.value,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
      
      // Animate icons inside cards
      workoutCards.forEach((card, index) => {
        const icon = card.querySelector('i');
        if (icon) {
          gsap.from(icon, {
            scale: 0,
            rotation: 360,
            opacity: 0,
            duration: 0.6,
            delay: 0.3 + (index * 0.15),
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: workoutsEl.value,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });
        }
      });
    }
  }
  
  // PR section title
  const prTitle = prsEl.value?.querySelector('h2');
  if (prTitle) {
    gsap.from(prTitle, {
      y: -20,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: prsEl.value,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }
  
  // PR cards with rotation
  if (prsEl.value) {
    const prCards = prsEl.value.querySelectorAll('.grid > div');
    if (prCards.length > 0) {
      gsap.from(prCards, {
        y: 40,
        opacity: 0,
        scale: 0.95,
        rotation: 3,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: prsEl.value.querySelector('.grid'),
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
      
      // Animate PR icons
      prCards.forEach((card) => {
        const icon = card.querySelector('i');
        if (icon) {
          gsap.from(icon, {
            scale: 0,
            rotation: -180,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        }
      });
    }
  }
  
  // Stats with bounce
  if (statsEl.value) {
    const statCards = statsEl.value.querySelectorAll('> div');
    if (statCards.length > 0) {
      gsap.from(statCards, {
        y: 30,
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: statsEl.value,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
      
      // Animate stat values with counting effect
      statCards.forEach((card) => {
        const value = card.querySelector('.text-2xl, .text-3xl');
        if (value) {
          gsap.from(value, {
            scale: 0,
            rotation: 360,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        }
      });
    }
  }
  
  // Quote with dramatic entrance
  gsap.from(quoteEl.value, {
    scale: 0.8,
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: quoteEl.value,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
  
  // Animate quote text separately
  const quoteText = quoteEl.value?.querySelector('blockquote');
  const quoteCite = quoteEl.value?.querySelector('cite');
  
  if (quoteText) {
    gsap.from(quoteText, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      scrollTrigger: {
        trigger: quoteEl.value,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }
  
  if (quoteCite) {
    gsap.from(quoteCite, {
      x: -20,
      opacity: 0,
      duration: 0.6,
      delay: 0.5,
      scrollTrigger: {
        trigger: quoteEl.value,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }
  } catch (error) {
    console.error('Fitness animation error:', error);
  }
};

// Workout Split Data
const workoutSplit = ref([
  {
    id: 1,
    name: "Monday",
    focus: "Upper Body: Chest, Biceps, Triceps, Shoulders",
    color: "#FF6B6B",
    icon: "pi pi-circle",
    exercises: [
      "Bench Press",
      "Incline Press", 
      "Shoulder Press",
      "Bicep Curls",
      "Triceps Extensions"
    ]
  },
  {
    id: 2,
    name: "Tuesday", 
    focus: "Recovery Day: Push-ups & Light Activity",
    color: "#4ECDC4",
    icon: "pi pi-heart",
    exercises: [
      "100 Push-ups",
      "Light Running",
      "Stretching",
      "Recovery Work"
    ]
  },
  {
    id: 3,
    name: "Wednesday",
    focus: "Upper Body 2: Back, Biceps, Triceps, Shoulders", 
    color: "#45B7D1",
    icon: "pi pi-circle",
    exercises: [
      "Pull-ups",
      "Barbell Rows",
      "Overhead Press",
      "Bicep Curls",
      "Triceps Work"
    ]
  },
  {
    id: 4,
    name: "Thursday",
    focus: "Recovery Day: Push-ups & Light Activity",
    color: "#96CEB4",
    icon: "pi pi-heart",
    exercises: [
      "100 Push-ups",
      "Light Physical Activities",
      "Mobility Work"
    ]
  },
  {
    id: 5,
    name: "Friday", 
    focus: "Lower Body & Shoulders",
    color: "#FECA57",
    icon: "pi pi-star",
    exercises: [
      "Squats",
      "Deadlifts",
      "Shoulder Press Machine",
      "Leg Press",
      "Core Work"
    ]
  },
  {
    id: 6,
    name: "Weekend",
    focus: "Recovery & Light Activities",
    color: "#FF9FF3",
    icon: "pi pi-sun",
    exercises: [
      "100 Push-ups Daily",
      "Light Running",
      "Recovery Activities",
      "Rest & Stretching"
    ]
  }
]);

// Personal Records Categories
const prCategories = ref([
  {
    name: "Compound Lifts",
    icon: "pi pi-bolt",
    exercises: [
      { name: "Deadlift", pr: "130 kg" },
      { name: "Squat", pr: "90 kg" },
      { name: "Bench Press", pr: "85 kg" },
      { name: "Overhead Press", pr: "70 kg" }
    ]
  },
  {
    name: "Upper Body",
    icon: "pi pi-star",
    exercises: [
      { name: "Pull-ups", pr: "10 reps" },
      { name: "Dips", pr: "15 reps" },
      { name: "Barbell Rows", pr: "100 kg" },
      { name: "Incline Press", pr: "80 kg" }
    ]
  },
  {
    name: "Shoulders & Core",
    icon: "pi pi-heart",
    exercises: [
      { name: "Shoulder Press (DB)", pr: "60 kg" },
      { name: "Shoulder Press Machine", pr: "100 kg" },
      { name: "Plank Hold", pr: "3:27" },
      { name: "Push-ups", pr: "60 reps" }
    ]
  }
]);

// Progress Statistics
const progressStats = ref([
  { label: "Training Years", value: "1+" },
  { label: "Workouts/Week", value: "3-4" },
  { label: "Daily Push-ups", value: "100" },
  { label: "Training Days", value: "Mon, Wed, Fri" },
]);

// Methods
const selectDay = (dayId) => {
  selectedDay.value = selectedDay.value === dayId ? null : dayId;
};

const scrollToWorkouts = () => {
  document.getElementById('workouts').scrollIntoView({ 
    behavior: 'smooth' 
  });
};

// SEO Meta
useSeoMeta({
  title: 'Fitness Journey - Xusniddin Qalandarov',
  ogTitle: 'Fitness Journey - Xusniddin Qalandarov', 
  description: 'My fitness journey, workout splits, and personal records. Forging discipline through strength training.',
  ogDescription: 'My fitness journey, workout splits, and personal records. Forging discipline through strength training.',
});
</script>

<style scoped>
/* Ensure content is visible by default - prevents animation hiding issues */
button, h1, h2, h3, p, div {
  opacity: 1;
}

/* Custom animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.pulse {
  animation: pulse 2s infinite;
}

/* Hover effects */
.hover\:glow:hover {
  box-shadow: 0 0 20px rgba(0, 255, 247, 0.3);
}

/* Mobile responsiveness */
@media screen and (max-width: 768px) {
  .grid.lg\:grid-cols-3 {
    grid-template-columns: 1fr !important;
  }
  
  .grid.md\:grid-cols-2 {
    grid-template-columns: 1fr !important;
  }
  
  .text-5xl.md\:text-6xl {
    font-size: 2.5rem !important;
  }
}
</style>