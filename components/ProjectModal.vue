<template>
  <Teleport to="body">
    <div 
      v-if="isOpen && project" 
      class="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-6"
      @click="closeModal"
    >
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
        @click="closeModal"
      ></div>
      
      <!-- Modal Container -->
      <div 
        class="relative w-full max-w-5xl max-h-screen md:max-h-[85vh] overflow-y-auto bg-primary text-main shadow-2xl md:rounded-2xl flex flex-col transform transition-all duration-300 scale-100"
        @click.stop
      >
        <!-- Close Button -->
        <button
          @click="closeModal"
          class="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
        >
          <i class="pi pi-times text-xl"></i>
        </button>

        <!-- Hero Image -->
        <div class="relative w-full aspect-video md:aspect-[21/9] shrink-0">
          <img 
            :src="project.image_url || '/images/project-placeholder.jpg'" 
            :alt="project.title"
            class="w-full h-full object-contain"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div class="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
            <div class="flex items-center gap-2 text-sm font-mono text-blue-400 uppercase tracking-widest mb-2">
              {{ project.category }}
            </div>
            <h2 class="text-3xl md:text-5xl font-bold leading-tight">{{ project.title }}</h2>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 md:p-10 space-y-8">
          
          <!-- Quick Status & Technologies -->
          <div class="flex flex-wrap items-center justify-between gap-6 border-b border-gray-200 dark:border-white/10 pb-8">
            <div class="flex flex-wrap gap-2">
              <span v-for="tech in project.technologies" :key="tech" class="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full text-xs font-mono uppercase tracking-wide text-sub">
                {{ tech }}
              </span>
            </div>
            
            <div class="flex items-center gap-4">
               <a v-if="project.demo_url" :href="project.demo_url" target="_blank" class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-main hover:text-blue-500 transition-colors">
                 Live Demo <i class="pi pi-arrow-up-right"></i>
               </a>
               <a v-if="project.github_url" :href="project.github_url" target="_blank" class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sub hover:text-main transition-colors">
                 Code <i class="pi pi-github"></i>
               </a>
            </div>
          </div>

          <!-- Description -->
          <div class="grid md:grid-cols-3 gap-10">
            <div class="md:col-span-2 text-lg text-sub font-light leading-relaxed whitespace-pre-line">
              {{ project.description }}
              
              <div v-if="project.long_description" class="mt-4">
                 {{ project.long_description }}
              </div>
            </div>
            
            <div class="space-y-6">
              <div v-if="project.client">
                <h3 class="text-xs font-bold text-sub uppercase tracking-widest mb-1">Client</h3>
                <p class="text-main">{{ project.client }}</p>
              </div>
              <div v-if="project.year">
                <h3 class="text-xs font-bold text-sub uppercase tracking-widest mb-1">Year</h3>
                <p class="text-main">{{ project.year }}</p>
              </div>
              <div v-if="project.role">
                <h3 class="text-xs font-bold text-sub uppercase tracking-widest mb-1">Role</h3>
                <p class="text-main">{{ project.role }}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  project: Object
})

const emit = defineEmits(['close'])

const closeModal = () => emit('close')

onMounted(() => {
  const handleKeydown = (e) => {
    if (e.key === 'Escape' && props.isOpen) closeModal()
  }
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  })
})

watch(() => props.isOpen, (open) => {
  if (process.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})
</script>
