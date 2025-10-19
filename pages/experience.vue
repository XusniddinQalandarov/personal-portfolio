<template>
  <div class="min-h-screen py-20 bg-dark-charcoal">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-main">Professional Journey</h1>
        <p class="text-xl text-sub max-w-2xl mx-auto">
          Aspiring computer scientist passionate about frontend development and AI agent building. My journey from high school projects to professional development roles.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <p class="text-gray-400 mt-4">Loading experience...</p>
      </div>

      <!-- Experience Timeline -->
      <div v-else class="relative">
        <!-- Timeline Line -->
        <div class="absolute left-1/2 transform -translate-x-1/2 w-1 glow-border h-full"></div>
        
        <!-- Timeline Items -->
        <div v-for="(experience, index) in experiences" :key="experience.id" class="relative mb-12">
          <div :class="[
            'flex items-start',
            index % 2 === 0 ? 'flex-row-reverse' : 'flex-row'
          ]">
            <!-- Content Card -->
            <div :class="[
              'w-5/12 transition-all duration-300 p-6 rounded-lg mt-8 bg-[#1E2128FF]',
              index % 2 === 0 ? 'mr-auto' : 'ml-auto',
              selectedExperience === index ? 'transform scale-105' : ''
            ]">
              <div class="mb-4">
                <h3 class="text-xl font-bold text-main mb-2">{{ experience.title }}</h3>
                <h4 class="text-lg text-[#704343FF] font-semibold mb-2">{{ experience.company }}</h4>
                <p class="text-sm text-[#704343FF] font-medium">{{ experience.period }}</p>
              </div>
              
              <p class="text-sub mb-4">{{ experience.description }}</p>
              
              <!-- Technologies/Skills -->
              <div class="flex flex-wrap gap-2 mb-4" v-if="experience.technologies">
                <span 
                  v-for="tech in experience.technologies" 
                  :key="tech"
                  class="px-3 py-1 bg-[#71444433] text-white rounded-2xl text-sm"
                >
                  {{ tech }}
                </span>
              </div>

              <!-- Key Achievements -->
              <div v-if="experience.achievements" class="mt-4">
                <h5 class="text-sm font-semibold text-main mb-2">Key Achievements:</h5>
                <ul class="text-sm text-sub space-y-1">
                  <li v-for="achievement in experience.achievements" :key="achievement" class="flex items-start">
                    <span class="text-gray-400 mr-2">•</span>
                    {{ achievement }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Timeline Marker -->
            <button 
              @click="selectedExperience = index"
              class="absolute left-1/2 transform -translate-x-1/2 -translate-y-2 w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300 cursor-pointer"
              :class="[
                selectedExperience === index 
                  ? 'bg-gray-500 scale-110' 
                  : 'bg-gray-600 hover:bg-gray-500 hover:scale-105'
              ]">
              <i :class="experience.icon || 'pi pi-briefcase'" class="text-white text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Education Section -->
      <div class="mt-20">
        <h2 class="text-3xl font-bold text-center text-main mb-12">Education & Certifications</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div v-for="edu in education" :key="edu.id" class="bg-[#1E2128FF] p-6 rounded-lg transition-all">
            <h3 class="text-lg font-bold text-main mb-2">{{ edu.degree }}</h3>
            <h4 class="text-main font-semibold mb-1">{{ edu.school }}</h4>
            <p class="text-[#704343FF] font-medium mb-3">{{ edu.year }}</p>
            <p class="text-sub" v-if="edu.description">{{ edu.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const selectedExperience = ref(null);
const loading = ref(true);
const error = ref(null);

// Default experiences - kept as fallback/initial data
const defaultExperiences = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "UZINFOCOM",
    period: "May 2025 - Present",
    description: "Building responsive SPAs and improving UX across multiple projects. Developing interactive data visualization solutions and modernizing university websites.",
    technologies: ["Angular 19, Angular 20", "Tailwind CSS v4", "Angular Material", "PrimeNG", "Apache ECharts", "SVG", "RxJS", "Ng-Zorro"],
    achievements: [
      "Improved page load times by ~20% using Angular 19 and Tailwind CSS",
      "Built interactive SVG map of Uzbekistan with real-time data visualization",
      "Reduced manual reporting workload by 30% with custom dashboards",
      "Attracted ~50 weekly users to personal tech-blog application",
      "Contributed to 10+ end-to-end projects across different domains"
    ],
    icon: "pi pi-code"
  },
  {
    id: 2,
    title: "Mobile Developer",
    company: "Startup",
    period: "June 2025 - Present",
    description: "Developing a React Native Expo mobile app that allows football enthusiasts to book stadiums. Integrated push notifications, deep linking, and over-the-air (OTA) updates using Firebase and CodePush.",
    technologies: ["React Native", "Expo", "Firebase", "CodePush", "FlatList", "Reanimated"],
    achievements: [
      "Improved user engagement and experience with push notifications",
      "Implemented custom animations and optimized list rendering",
      "Integrated deep linking and OTA updates for seamless user experience"
    ],
    icon: "pi pi-mobile"
  },
  {
    id: 3,
    title: "AI & Telegram Bot Developer",
    company: "Independent Projects",
    period: "Dec 2024 - Present",
    description: "Developing intelligent Telegram bots and AI-powered applications for various clients and personal projects.",
    technologies: ["Node.js", "OpenAI API", "Telegram Bot API", "GitHub Actions", "Firebase", "Angular 19"],
    achievements: [
      "Built Content Creator Bot with auto-posting and weather integration",
      "Created Birthday Manager Bot replacing static file checks with database",
      "Developed Notifier Bot sold to U.S. logistics company",
      "Built StudyAssistant bot with AI-integrated quizzes",
      "Created NewsAnalyzeBot for credibility analysis and trust scoring"
    ],
    icon: "pi pi-android"
  },
  {
    id: 4,
    title: "General English / IELTS Instructor",
    company: "King's Academy",
    period: "Oct 2023 - Oct 2024",
    description: "Teaching English and IELTS preparation to 100+ students, developing comprehensive lesson plans and advising on university applications.",
    technologies: ["IELTS", "Problem Solving", "Leadership", "Quizlet", "Lesson Planning", "Assessment Tools"],
    achievements: [
      "Achieved +1.5 average band-score improvement with 85% pass rate",
      "Taught 100+ students achieving Band 7+ targets",
      "Advised 40+ applicants on essays and interviews",
      "Many students secured scholarships to international universities"
    ],
    icon: "pi pi-book"
  },
  {
    id: 5,
    title: "Front-end Developer",
    company: "Selected Projects",
    period: "Dec 2024 - Apr 2025",
    description: "Developing various front-end applications including e-commerce platforms and interactive museum portals.",
    technologies: ["Angular 19", "Ng-Zorro", "Angular Material", "GraphQL", "RxJS"],
    achievements: [
      "Built secure e-commerce platform with real-time inventory",
      "Cut initial payload by 25% using lazy loading and OnPush",
      "Created interactive museum portal with exhibit maps and search",
      "Ensured responsive design across all projects"
    ],
    icon: "pi pi-desktop"
  },
  {
    id: 6,
    title: "Front-end & Game Developer",
    company: "Khiva Presidential School",
    period: "Mar 2020 - May 2021",
    description: "Delivered freelance web projects and developed HTML5 games while creating school website components.",
    technologies: ["HTML5 Canvas", "JavaScript", "CSS3", "Game Development"],
    achievements: [
      "Delivered 5+ freelance web projects on Fiverr",
      "Built Vue.js site for U.S. client boosting CTR by 30%",
      "Developed three 2D HTML5 Canvas games with 80%+ positive feedback",
      "Created login/support pages improving navigation and access control"
    ],
    icon: "pi pi-globe"
  }
];

const defaultEducation = [
  {
    id: 1,
    degree: "Bachelor of Science in Computer Science & Engineering",
    school: "Presidential University, Tashkent",
    year: "Expected June 2026",
    description: "Relevant Coursework: Data Structures & Algorithms, Web Development, Network Security. Aspiring computer scientist passionate about frontend development and AI agent building."
  },
  {
    id: 2,
    degree: "High School Diploma",
    school: "Khiva Presidential School, Khiva, Khorezm",
    year: "June 2022",
    description: "GPA: 4.92 / 5.00 • Class Rank: 2 / 12 • SAT: 1270 / 1600 • IELTS: 7.5 / 9.0"
  },
  {
    id: 3,
    degree: "Front-end Development Course",
    school: "USTUDY",
    year: "March 2025",
    description: "Comprehensive frontend development certification covering modern frameworks and best practices."
  },
  {
    id: 4,
    degree: "Bronze Medal - AIMO",
    school: "International Mathematical Olympiad",
    year: "2020",
    description: "International recognition in mathematics demonstrating analytical and problem-solving skills."
  },
  {
    id: 5,
    degree: "Top 100 Uzbekistan Start-ups Award",
    school: "National Recognition",
    year: "2020",
    description: "Recognition for innovative startup idea and entrepreneurial excellence in technology sector."
  }
];

const experiences = ref([...defaultExperiences]);
const education = ref([...defaultEducation]);

// Load data from database
onMounted(async () => {
  try {
    loading.value = true;
    
    // Load experience from database
    try {
      const expResponse = await $fetch('/api/experience');
      let dbExperiences = [];
      
      // Handle response format
      if (expResponse && typeof expResponse === 'object' && 'data' in expResponse) {
        dbExperiences = Array.isArray(expResponse.data) ? expResponse.data : [];
      } else if (Array.isArray(expResponse)) {
        dbExperiences = expResponse;
      }
      
      if (dbExperiences.length > 0) {
        // Merge database entries with defaults, avoiding duplicates by id
        const dbIds = dbExperiences.map(exp => exp.id);
        const filteredDefaults = defaultExperiences.filter(exp => !dbIds.includes(exp.id));
        experiences.value = [...dbExperiences, ...filteredDefaults];
      }
    } catch (expErr) {
      console.warn('Failed to load experience from database, using defaults:', expErr);
    }

    // Load education from database
    try {
      const eduResponse = await $fetch('/api/admin/education');
      let dbEducation = [];
      
      // Handle response format
      if (eduResponse && typeof eduResponse === 'object' && 'data' in eduResponse) {
        dbEducation = Array.isArray(eduResponse.data) ? eduResponse.data : [];
      } else if (Array.isArray(eduResponse)) {
        dbEducation = eduResponse;
      }
      
      if (dbEducation.length > 0) {
        // Merge database entries with defaults, avoiding duplicates by id
        const dbIds = dbEducation.map(edu => edu.id);
        const filteredDefaults = defaultEducation.filter(edu => !dbIds.includes(edu.id));
        education.value = [...dbEducation, ...filteredDefaults];
      }
    } catch (eduErr) {
      console.warn('Failed to load education from database, using defaults:', eduErr);
    }
  } catch (err) {
    console.error('Failed to load data:', err);
    error.value = 'Failed to load some data. Showing defaults.';
  } finally {
    loading.value = false;
  }
});

// SEO Meta
useSeoMeta({
  title: 'Experience - Xusniddin Qalandarov',
  ogTitle: 'Experience - Xusniddin Qalandarov',
  description: 'Professional journey of Xusniddin Qalandarov - Frontend Developer, AI & Telegram Bot Developer, and Computer Science student.',
  ogDescription: 'Professional journey of Xusniddin Qalandarov - Frontend Developer, AI & Telegram Bot Developer, and Computer Science student.',
})
</script>

<style scoped>
/* Mobile responsiveness */
@media screen and (max-width: 768px) {
  /* Timeline container adjustments */
  .relative.mb-12 {
    margin-left: 0 !important;
    padding-left: 4rem;
  }

  /* Force all items to align left on mobile */
  .flex.items-start {
    flex-direction: row !important;
    justify-content: flex-start !important;
  }

  .flex-row-reverse {
    flex-direction: row !important;
  }
  
  /* Content cards - full width on mobile */
  .w-5\/12 {
    width: 100% !important;
  }
  
  /* Remove auto margins on mobile */
  .mr-auto,
  .ml-auto {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  /* Timeline markers - position on left */
  .absolute.left-1\/2 {
    left: 1.5rem !important;
    transform: translateX(-50%) translateY(-0.5rem) !important;
  }

  /* Timeline line - position on left */
  .glow-border {
    left: 1.5rem !important;
    transform: translateX(-50%) !important;
    width: 2px !important;
  }

  /* Ensure content doesn't overlap with timeline */
  .w-5\/12.transition-all {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}
</style>