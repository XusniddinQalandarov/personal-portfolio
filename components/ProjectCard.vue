<template>
  <div class="card group cursor-pointer bg-[#1E2128FF]">
    <!-- Project Image -->
    <div class="relative overflow-hidden rounded-lg mb-4">
      <img 
        :src="project.image" 
        :alt="project.title"
        class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        @error="handleImageError"
      >
      
      <!-- Status Badge -->
      <div  
        v-if="project.status"
        :class="[
          'absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium',
          project.status === 'Completed' 
            ? 'bg-green-100 text-green-800' 
            : project.status === 'In Progress'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        ]"
      >
        {{ project.status }}
      </div>

      <!-- Overlay with Action Buttons -->
      <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div class="flex gap-3">
          <template v-if="project.demo">
            <a 
              :href="project.demo" 
              target="_blank"
              class="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
              @click.stop
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              Live Demo
            </a>
            <a 
              v-if="project.github"
              :href="project.github" 
              target="_blank"
              class="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              @click.stop
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
              </svg>
              Code
            </a>
          </template>
          <template v-else>
            <a 
              v-if="project.github"
              :href="project.github" 
              target="_blank"
              class="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              @click.stop
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
              </svg>
              View Code
            </a>
          </template>
        </div>
      </div>
    </div>

    <!-- Project Content -->
    <div>
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-xl font-semibold text-white group-hover:text-blue-600 transition-colors">
          {{ project.title }}
        </h3>
        <div 
          v-if="project.featured"
          class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0"
        >
          Featured
        </div>
      </div>

      <p class="text-[#BDC1CAFF] mb-4 line-clamp-3">
        {{ detailed ? project.longDescription || project.description : project.description }}
      </p>

      <!-- Technologies -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span 
          v-for="tech in project.technologies" 
          :key="tech"
          class="px-3 py-1 bg-[#71444433] text-white rounded-2xl text-sm"
        >
          {{ tech }}
        </span>
      </div>

      <!-- Category (if detailed view) -->
      <div v-if="detailed && project.category" class="mb-4">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {{ project.category }}
        </span>
      </div>

      <!-- Action Links (for non-hover state on mobile) -->
      <div class="flex gap-3 md:opacity-0 group-hover:opacity-100 md:group-hover:opacity-0">
        <a 
          v-if="project.demo"
          :href="project.demo" 
          target="_blank"
          class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          Live Demo
        </a>
        <a 
          v-if="project.github"
          :href="project.github" 
          target="_blank"
          class="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
          </svg>
          View Code
        </a>
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
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>