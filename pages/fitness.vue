<template>
  <div class="min-h-screen py-20 bg-dark-charcoal">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 text-main">
          Forging Discipline, Building Resilience
        </h1>
        <p class="text-xl text-sub max-w-2xl mx-auto mb-4">
          The Synergy of Strength and Code in Life
        </p>
        <p class="text-lg text-main font-semibold mb-4">
          Lifetime Natural • 81kg
        </p>
        <button @click="scrollToWorkouts" class="btn-primary px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105">
          View My Training
        </button>
      </div>

      <!-- Training Philosophy -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-main">My Training Routine</h2>
        <p class="text-lg text-sub max-w-3xl mx-auto">
          Building consistency and discipline through structured training. Starting my fitness journey with a focus on compound movements and daily habits.
        </p>
      </div>

      <!-- Weekly Split Cards -->
      <div id="workouts" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        <div 
          v-for="day in workoutSplit" 
          :key="day.id"
          class="bg-[#1E2128FF] p-6 rounded-lg hover:scale-105 transition-all duration-300 cursor-pointer"
          @click="selectDay(day.id)"
          :class="selectedDay === day.id ? 'ring-2 ring-cyan-400/50' : ''"
        >
          <div class="flex items-center mb-4">
            <i :class="day.icon" class="text-2xl mr-3" :style="{ color: day.color }"></i>
            <h3 class="text-xl font-bold text-main">{{ day.name }}</h3>
          </div>
          
          <p class="text-sub mb-4 text-sm">{{ day.focus }}</p>
          
          <ul class="space-y-2">
            <li 
              v-for="exercise in day.exercises" 
              :key="exercise"
              class="text-sm text-sub flex items-center"
            >
              <span class="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
              {{ exercise }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Personal Records Section -->
      <div class="mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-main">
          Discipline & Progress
        </h2>
        
        <!-- PR Categories -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="category in prCategories" 
            :key="category.name"
            class="bg-[#1E2128FF] p-6 rounded-lg"
          >
            <div class="flex items-center mb-4">
              <i :class="category.icon" class="text-2xl mr-3 text-cyan-400"></i>
              <h3 class="text-xl font-bold text-main">{{ category.name }}</h3>
            </div>
            
            <div class="space-y-3">
              <div 
                v-for="exercise in category.exercises" 
                :key="exercise.name"
                class="flex justify-between items-center p-3 bg-gray-800/50 rounded"
              >
                <span class="text-sub font-medium">{{ exercise.name }}</span>
                <span class="text-cyan-400 font-bold">{{ exercise.pr }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Stats -->
      <div class="grid md:grid-cols-4 gap-6 mb-16">
        <div 
          v-for="stat in progressStats" 
          :key="stat.label"
          class="bg-[#1E2128FF] p-6 rounded-lg text-center"
        >
          <div class="text-3xl font-bold text-cyan-400 mb-2">{{ stat.value }}</div>
          <div class="text-sub text-sm">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Training Philosophy Quote -->
      <div class="text-center bg-[#1E2128FF] p-8 rounded-lg">
        <blockquote class="text-xl md:text-2xl font-medium text-main mb-4 italic">
          "The iron never lies to you. You can walk outside and listen to all kinds of talk, get told you're a god or a total bastard. The iron will always kick you the real deal."
        </blockquote>
        <cite class="text-sub">- Henry Rollins</cite>
      </div>
    </div>
  </div>
</template>

<script setup>
const selectedDay = ref(null);

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