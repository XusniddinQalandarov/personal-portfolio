<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <!-- Backdrop -->
      <div 
        :class="[
          'fixed inset-0 transition-opacity',
          isDark ? 'bg-black/80' : 'bg-white/80'
        ]"
        class="backdrop-blur-sm"
      ></div>
      
      <!-- Modal Container with scroll -->
      <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div 
          :class="[
            'rounded-2xl shadow-2xl border overflow-hidden',
            isDark 
              ? 'bg-gradient-to-br from-[#1E2128FF] to-[#2A2D35FF] border-gray-700/50' 
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          ]"
          @click.stop
        >
          <!-- Close Button -->
          <button
            @click="closeModal"
            :class="[
              'absolute top-4 right-4 z-10 p-2.5 rounded-full transition-all duration-200 backdrop-blur-sm border',
              isDark 
                ? 'bg-black/60 text-white hover:bg-black/80 border-gray-600/50 hover:border-gray-500'
                : 'bg-white/60 text-gray-700 hover:bg-white/80 border-gray-300/50 hover:border-gray-400'
            ]"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Project Image -->
          <div class="relative h-64 md:h-80 overflow-hidden">
            <img 
              :src="project.image_url || project.image" 
              :alt="project.title"
              class="w-full h-full object-cover"
              @error="handleImageError"
            >
            
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            <!-- Status Badge -->
            <div  
              v-if="project.status"
              :class="[
                'absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm border',
                project.status === 'Completed' 
                  ? 'bg-green-500/90 text-green-50 border-green-400/50' 
                  : project.status === 'In Progress'
                  ? 'bg-blue-500/90 text-blue-50 border-blue-400/50'
                  : 'bg-gray-500/90 text-gray-50 border-gray-400/50'
              ]"
            >
              {{ project.status }}
            </div>

            <!-- Featured Badge -->
            <div 
              v-if="project.featured"
              class="absolute top-4 right-16 bg-yellow-500/90 text-yellow-50 px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm border border-yellow-400/50"
            >
              Featured
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 md:p-8">
            <!-- Header -->
            <div class="mb-6">
              <div class="flex items-start justify-between mb-4">
                <h2 
                  :class="[
                    'text-2xl md:text-3xl font-bold leading-tight',
                    isDark ? 'text-white' : 'text-gray-900'
                  ]"
                >
                  {{ project.title }}
                </h2>
                <div 
                  v-if="project.category" 
                  :class="[
                    'ml-4 px-3 py-1.5 rounded-full text-sm font-semibold border flex items-center',
                    isDark 
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-500/30'
                      : 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200'
                  ]"
                >
                  <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                  {{ project.category }}
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-8">
              <p 
                :class="[
                  'text-lg leading-relaxed',
                  isDark ? 'text-[#BDC1CAFF]' : 'text-gray-600'
                ]"
              >
                {{ project.long_description || project.description }}
              </p>
            </div>

            <!-- Technologies -->
            <div class="mb-8">
              <h3 
                :class="[
                  'text-lg font-semibold mb-4 flex items-center gap-2',
                  isDark ? 'text-white' : 'text-gray-900'
                ]"
              >
                <svg 
                  :class="[
                    'w-5 h-5',
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  ]" 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
                Technologies Used
              </h3>
              <div class="flex flex-wrap gap-3">
                <span 
                  v-for="tech in project.technologies" 
                  :key="tech"
                  :class="[
                    'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                    isDark 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30'
                      : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 hover:bg-blue-200'
                  ]"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-4">
              <a 
                v-if="project.demo_url || project.demo"
                :href="project.demo_url || project.demo" 
                target="_blank"
                :class="[
                  'inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105',
                  isDark 
                    ? 'bg-white text-black hover:bg-gray-100'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                Live Demo
              </a>
              
              <a 
                v-if="project.github_url || project.github"
                :href="project.github_url || project.github" 
                target="_blank"
                :class="[
                  'inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-200 border shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm',
                  isDark 
                    ? 'bg-gray-700/80 text-white hover:bg-gray-600 border-gray-600/50 hover:border-gray-500'
                    : 'bg-white/80 text-gray-700 hover:bg-gray-50 border-gray-300/50 hover:border-gray-400'
                ]"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
                </svg>
                View Code
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  project: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

// Theme composable
const { isDark } = useTheme()

const closeModal = () => {
  emit('close')
}

// Close modal on escape key
onMounted(() => {
  const handleKeydown = (event) => {
    if (event.key === 'Escape' && props.isOpen) {
      closeModal()
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    // Cleanup body styles
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  })
})

// Prevent body scroll when modal is open, but allow modal scroll
watch(() => props.isOpen, (isOpen) => {
  if (typeof document !== 'undefined') {
    if (isOpen) {
      // Get scrollbar width to prevent layout shift
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollBarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }
})

const handleImageError = (event) => {
  // Fallback for missing project images
  const fallbackColor = ['3b82f6', '10b981', 'f59e0b', 'ef4444', '8b5cf6'][Math.floor(Math.random() * 5)]
  event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(props.project.title)}&size=800&background=${fallbackColor}&color=fff`
}
</script>

<style scoped>
/* Custom scrollbar for modal content */
.overflow-y-auto::-webkit-scrollbar {
  width: 10px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(59, 130, 246, 0.8));
  border-radius: 6px;
  border: 2px solid transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 1));
}

/* Ensure modal is always centered and scrollable */
.modal-container {
  scroll-behavior: smooth;
}

/* Enhanced modal animations */
.modal-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* Backdrop blur animation */
.backdrop-enter-active, .backdrop-leave-active {
  transition: all 0.3s ease;
}

.backdrop-enter-from, .backdrop-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}
</style>