<template>
  <div 
    :class="[
      'card group cursor-pointer border transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl',
      isDark 
        ? 'bg-gradient-to-br from-[#1E2128FF] to-[#2A2D35FF] border-gray-700/50 hover:border-blue-500/50 hover:shadow-blue-500/10' 
        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-400/70 hover:shadow-blue-400/20 shadow-lg'
    ]" 
    @click="openProject"
  >
    <!-- Project Image -->
    <div class="relative overflow-hidden rounded-lg mb-4">
      <img 
        :src="project.image_url || project.image" 
        :alt="project.title"
        class="w-full h-48 object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
        @error="handleImageError"
      >
      
      <!-- Status Badge -->
      <div  
        v-if="project.status"
        :class="[
          'absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border',
          project.status === 'Completed' 
            ? 'bg-green-500/90 text-green-50 border-green-400/50' 
            : project.status === 'In Progress'
            ? 'bg-blue-500/90 text-blue-50 border-blue-400/50'
            : 'bg-gray-500/90 text-gray-50 border-gray-400/50'
        ]"
      >
        {{ project.status }}
      </div>

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <!-- Overlay with Action Buttons -->
      <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
        <div class="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <template v-if="project.demo_url || project.demo">
            <a 
              :href="project.demo_url || project.demo" 
              target="_blank"
              class="bg-white text-gray-900 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              @click.stop
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              {{ $t('projectCard.liveDemo') }}
            </a>
            <a 
              v-if="project.github_url || project.github"
              :href="project.github_url || project.github" 
              target="_blank"
              class="bg-gray-900/90 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 border border-gray-600 shadow-lg hover:shadow-xl transform hover:scale-105"
              @click.stop
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
              </svg>
              {{ $t('projectCard.code') }}
            </a>
          </template>
          <template v-else>
            <a 
              v-if="project.github_url || project.github"
              :href="project.github_url || project.github" 
              target="_blank"
              class="bg-gray-900/90 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 border border-gray-600 shadow-lg hover:shadow-xl transform hover:scale-105"
              @click.stop
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
              </svg>
              {{ $t('projectCard.viewCode') }}
            </a>
          </template>
        </div>
      </div>
    </div>

    <!-- Project Content -->
    <div class="p-1">
      <div class="flex items-start justify-between mb-2">
        <h3 
          :class="[
            'text-xl font-semibold group-hover:text-blue-600 transition-colors',
            isDark ? 'text-white' : 'text-gray-900'
          ]"
        >
          {{ localField(project, 'title') }}
        </h3>
        <div 
          v-if="project.featured"
          class="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2.5 py-1 rounded-full text-xs font-bold ml-3 flex-shrink-0 shadow-lg"
        >
          {{ $t('projectCard.featured') }}
        </div>
      </div>

      <p 
        :class="[
          'mb-4 line-clamp-3 leading-relaxed',
          isDark ? 'text-[#BDC1CAFF]' : 'text-gray-600'
        ]"
      >
        {{ detailed ? localField(project, 'long_description') || localField(project, 'description') : localField(project, 'description') }}
      </p>

      <!-- Technologies -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span 
          v-for="tech in project.technologies" 
          :key="tech"
          :class="[
            'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
            isDark 
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30'
              : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 hover:bg-blue-200'
          ]"
        >
          {{ tech }}
        </span>
      </div>

      <!-- Category (if detailed view) -->
      <div v-if="detailed && project.category" class="mb-4">
        <span 
          :class="[
            'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border',
            isDark 
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-500/30'
              : 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200'
          ]"
        >
          <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          {{ project.category }}
        </span>
      </div>

      <!-- Click to view indicator -->
      <div class="flex items-center justify-between">
        <div 
          :class="[
            'text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2',
            isDark ? 'text-blue-400' : 'text-blue-600'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          {{ $t('projectCard.clickToView') }}
        </div>

        <!-- Action Links (for mobile fallback) -->
        <div class="flex gap-3 md:hidden">
          <a 
            v-if="project.demo_url || project.demo"
            :href="project.demo_url || project.demo" 
            target="_blank"
            :class="[
              'font-medium text-sm flex items-center gap-1 transition-colors',
              isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            ]"
            @click.stop
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            {{ $t('projectCard.demo') }}
          </a>
          <a 
            v-if="project.github_url || project.github"
            :href="project.github_url || project.github" 
            target="_blank"
            :class="[
              'font-medium text-sm flex items-center gap-1 transition-colors',
              isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
            ]"
            @click.stop
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
            </svg>
            {{ $t('projectCard.code') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  detailed: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['openProject'])

// Theme composable
const { isDark } = useTheme()
const { localField } = useLocalizedContent()

const openProject = () => {
  emit('openProject', props.project)
}

const handleImageError = (event) => {
  // Fallback for missing project images
  const fallbackColor = ['3b82f6', '10b981', 'f59e0b', 'ef4444', '8b5cf6'][Math.floor(Math.random() * 5)];
  event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(props.project.title)}&size=400&background=${fallbackColor}&color=fff`;
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card {
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.card:hover::before {
  opacity: 1;
}

.card:hover {
  box-shadow: 
    0 20px 60px rgba(59, 130, 246, 0.15),
    0 8px 25px rgba(59, 130, 246, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom scrollbar for any overflow content */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}
</style>