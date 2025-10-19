<template>
  <div class="min-h-screen py-20">
    <!-- Login Screen -->
    <div v-if="!isAuthenticated" class="max-w-md mx-auto px-4">
      <div class="glass-panel p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl text-white font-bold mb-2">Admin Login</h1>
          <p class="text-[#BDC1CAFF]">Enter your password to access the admin panel</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white mb-2">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="Enter admin password"
              class="w-full px-4 py-3 bg-transparent text-white rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none transition-colors"
              required
            />
          </div>

          <div v-if="loginError" class="text-red-500 text-sm">
            {{ loginError }}
          </div>

          <button type="submit" class="w-full btn-primary px-6 py-3">
            Login
          </button>
        </form>
      </div>
    </div>

    <!-- Admin Dashboard -->
    <div v-else class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-4xl md:text-5xl text-white font-bold">Admin Dashboard</h1>
          <button @click="handleLogout" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            Logout
          </button>
        </div>
        <p class="text-xl text-[#BDC1CAFF] max-w-2xl mx-auto">
          Manage your portfolio content
        </p>
      </div>

      <!-- Tabs -->
      <div class="flex flex-wrap gap-4 mb-8">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'px-6 py-2 rounded-lg font-semibold transition-colors',
            activeTab === tab
              ? 'bg-cyan-400 text-black'
              : 'bg-[#1E2128FF] text-white hover:bg-[#323743FF]'
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Projects Management -->
      <div v-if="activeTab === 'Projects'" class="bg-[#1E2128FF] p-6 rounded-lg">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl text-white font-semibold">Manage Projects</h2>
          <button @click="showProjectForm = true" class="btn-primary px-4 py-2">
            Add New Project
          </button>
        </div>

        <!-- Project Form -->
        <div v-if="showProjectForm" class="bg-[#323743FF] p-6 rounded-lg mb-6">
          <h3 class="text-xl text-white font-semibold mb-4">
            {{ editingProject ? 'Edit Project' : 'New Project' }}
          </h3>
          
          <form @submit.prevent="saveProject" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-white mb-2">Title *</label>
                <input
                  v-model="projectForm.title"
                  type="text"
                  required
                  class="w-full px-4 py-2 rounded-lg bg-[#1E2128FF] text-white"
                  placeholder="Project name"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-white mb-2">Category</label>
                <select
                  v-model="projectForm.category"
                  class="w-full px-4 py-2 rounded-lg bg-[#1E2128FF] text-white"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">Short Description *</label>
              <textarea
                v-model="projectForm.description"
                rows="2"
                required
                class="w-full px-4 py-2 rounded-lg bg-[#1E2128FF] text-white"
                placeholder="Brief description"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">Long Description</label>
              <textarea
                v-model="projectForm.long_description"
                rows="4"
                class="w-full px-4 py-2 rounded-lg bg-[#1E2128FF] text-white"
                placeholder="Detailed description"
              ></textarea>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-white mb-2">GitHub URL</label>
                <input
                  v-model="projectForm.github_url"
                  type="url"
                  class="w-full px-4 py-2 rounded-lg bg-[#1E2128FF] text-white"
                  placeholder="https://github.com/..."
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-white mb-2">Demo URL</label>
                <input
                  v-model="projectForm.demo_url"
                  type="url"
                  class="w-full px-4 py-2 rounded-lg bg-[#1E2128FF] text-white"
                  placeholder="https://demo.com"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">Technologies (comma-separated)</label>
              <input
                v-model="technologiesString"
                type="text"
                class="w-full px-4 py-2 rounded-lg bg-[#1E2128FF] text-white"
                placeholder="Vue.js, Nuxt.js, Tailwind CSS"
              >
            </div>

            <div class="grid md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-white mb-2">Status</label>
                <select
                  v-model="projectForm.status"
                  class="w-full px-4 py-2 rounded-lg bg-[#1E2128FF] text-white"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>
              <div class="flex items-center">
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="projectForm.featured"
                    type="checkbox"
                    class="mr-2"
                  >
                  <span class="text-white">Featured</span>
                </label>
              </div>
            </div>

            <div class="flex gap-4">
              <button type="submit" class="btn-primary px-6 py-2">
                {{ editingProject ? 'Update' : 'Create' }}
              </button>
              <button 
                type="button" 
                @click="cancelProjectForm"
                class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Projects List -->
        <div class="space-y-4">
          <div
            v-for="project in projects"
            :key="project.id"
            class="bg-[#323743FF] p-4 rounded-lg flex justify-between items-start"
          >
            <div class="flex-1">
              <h3 class="text-lg text-white font-semibold">{{ project.title }}</h3>
              <p class="text-sub text-sm">{{ project.description }}</p>
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="tech in project.technologies"
                  :key="tech"
                  class="px-2 py-1 bg-[#1E2128FF] text-white rounded text-xs"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            <div class="flex gap-2 ml-4">
              <button
                @click="editProject(project)"
                class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                @click="deleteProject(project.id)"
                class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Messages -->
      <div v-if="activeTab === 'Messages'" class="bg-[#1E2128FF] p-6 rounded-lg">
        <h2 class="text-2xl text-white font-semibold mb-6">Contact Messages</h2>
        
        <div class="space-y-4">
          <div
            v-for="message in messages"
            :key="message.id"
            class="bg-[#323743FF] p-4 rounded-lg"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="text-lg text-white font-semibold">{{ message.name }}</h3>
                <p class="text-sub text-sm">{{ message.email }}</p>
              </div>
              <span
                :class="[
                  'px-3 py-1 rounded text-xs',
                  message.read ? 'bg-gray-600 text-gray-300' : 'bg-cyan-400 text-black'
                ]"
              >
                {{ message.read ? 'Read' : 'New' }}
              </span>
            </div>
            <p class="text-white font-medium mb-2">{{ message.subject }}</p>
            <p class="text-sub">{{ message.message }}</p>
            <p class="text-gray-500 text-xs mt-2">
              {{ new Date(message.created_at).toLocaleString() }}
            </p>
            <button
              v-if="!message.read"
              @click="markAsRead(message.id)"
              class="mt-2 px-3 py-1 bg-cyan-400 text-black rounded hover:bg-cyan-500 text-sm"
            >
              Mark as Read
            </button>
          </div>
        </div>
      </div>

      <!-- Blogs Management -->
      <div v-if="activeTab === 'Blogs'" class="bg-[#1E2128FF] p-6 rounded-lg">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl text-white font-semibold">Manage Blogs</h2>
          <button @click="showBlogForm = true" class="btn-primary px-4 py-2">
            Add New Blog
          </button>
        </div>

        <!-- Blog Form -->
        <div v-if="showBlogForm" class="bg-[#323743FF] p-6 rounded-lg mb-6">
          <h3 class="text-xl text-white font-semibold mb-4">
            {{ editingBlog ? 'Edit Blog' : 'New Blog' }}
          </h3>
          
          <form @submit.prevent="saveBlog" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-white mb-2">Title *</label>
                <input
                  v-model="blogForm.title"
                  type="text"
                  required
                  class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-white mb-2">Slug *</label>
                <input
                  v-model="blogForm.slug"
                  type="text"
                  placeholder="Auto-generated from title"
                  class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">Excerpt</label>
              <textarea
                v-model="blogForm.excerpt"
                rows="2"
                class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">Content *</label>
              <textarea
                v-model="blogForm.content"
                rows="10"
                required
                placeholder="Supports Markdown"
                class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg font-mono"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">Image</label>
              
              <!-- Image Upload Option -->
              <div class="mb-3">
                <label class="inline-flex items-center px-4 py-2 bg-cyan-400 text-black rounded-lg cursor-pointer hover:bg-cyan-500 transition-colors">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Image
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    @change="handleBlogImageUpload"
                    class="hidden"
                  />
                </label>
                <span v-if="uploadingImage" class="ml-3 text-cyan-400">Uploading...</span>
                <span v-if="uploadError" class="ml-3 text-red-500">{{ uploadError }}</span>
              </div>

              <!-- Current Image Preview -->
              <div v-if="blogForm.image_url" class="mb-3">
                <img :src="blogForm.image_url" alt="Preview" class="h-32 w-auto rounded-lg object-cover" />
                <button
                  type="button"
                  @click="blogForm.image_url = ''"
                  class="mt-2 text-sm text-red-400 hover:text-red-300"
                >
                  Remove Image
                </button>
              </div>

              <!-- Or URL Input -->
              <div>
                <label class="block text-xs text-gray-400 mb-1">Or enter image URL:</label>
                <input
                  v-model="blogForm.image_url"
                  type="url"
                  placeholder="https://..."
                  class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">Tags (comma-separated)</label>
              <input
                v-model="tagsString"
                type="text"
                placeholder="Vue, Nuxt, Web Dev"
                class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg"
              />
            </div>

            <div>
              <label class="flex items-center text-white">
                <input
                  v-model="blogForm.published"
                  type="checkbox"
                  class="mr-2"
                />
                Published
              </label>
            </div>

            <div class="flex gap-4">
              <button type="submit" class="btn-primary px-6 py-2">
                {{ editingBlog ? 'Update' : 'Create' }} Blog
              </button>
              <button type="button" @click="cancelBlogForm" class="px-6 py-2 bg-gray-600 text-white rounded-lg">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Blog List -->
        <div class="space-y-4">
          <div
            v-for="blog in blogs"
            :key="blog.id"
            class="bg-[#323743FF] p-4 rounded-lg"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg text-white font-semibold">{{ blog.title }}</h3>
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs',
                      blog.published ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                    ]"
                  >
                    {{ blog.published ? 'Published' : 'Draft' }}
                  </span>
                </div>
                <p class="text-sub text-sm mb-2">{{ blog.excerpt || 'No excerpt' }}</p>
                <div class="flex gap-2 flex-wrap mb-2">
                  <span
                    v-for="tag in blog.tags"
                    :key="tag"
                    class="px-2 py-1 bg-cyan-400/20 text-cyan-400 rounded text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
                <p class="text-gray-500 text-xs">
                  Created: {{ new Date(blog.created_at).toLocaleDateString() }} | 
                  Views: {{ blog.views || 0 }}
                </p>
              </div>
              <div class="flex gap-2 ml-4">
                <button
                  @click="editBlog(blog)"
                  class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  @click="deleteBlog(blog.id)"
                  class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Experience Management -->
      <div v-if="activeTab === 'Experience'" class="bg-[#1E2128FF] p-6 rounded-lg">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl text-white font-semibold">Manage Experience</h2>
          <button @click="showExperienceForm = true" class="btn-primary px-4 py-2">
            Add New Experience
          </button>
        </div>

        <!-- Experience Form -->
        <div v-if="showExperienceForm" class="bg-[#323743FF] p-6 rounded-lg mb-6">
          <h3 class="text-xl text-white font-semibold mb-4">
            {{ editingExperience ? 'Edit Experience' : 'New Experience' }}
          </h3>
          
          <form @submit.prevent="saveExperience" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-white mb-2">Job Title *</label>
                <input
                  v-model="experienceForm.title"
                  type="text"
                  required
                  class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-white mb-2">Company *</label>
                <input
                  v-model="experienceForm.company"
                  type="text"
                  required
                  class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg"
                />
              </div>
            </div>

            <div class="grid md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-white mb-2">Period *</label>
                <input
                  v-model="experienceForm.period"
                  type="text"
                  placeholder="2020 - 2023"
                  required
                  class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-white mb-2">Order</label>
                <input
                  v-model.number="experienceForm.order_index"
                  type="number"
                  class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg"
                />
              </div>
              <div>
                <label class="flex items-center text-white mt-7">
                  <input
                    v-model="experienceForm.current"
                    type="checkbox"
                    class="mr-2"
                  />
                  Current Position
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                v-model="experienceForm.description"
                rows="4"
                class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg"
              ></textarea>
            </div>

            <div class="flex gap-4">
              <button type="submit" class="btn-primary px-6 py-2">
                {{ editingExperience ? 'Update' : 'Create' }} Experience
              </button>
              <button type="button" @click="cancelExperienceForm" class="px-6 py-2 bg-gray-600 text-white rounded-lg">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Experience List -->
        <div class="space-y-4">
          <div
            v-for="exp in experience"
            :key="exp.id"
            class="bg-[#323743FF] p-4 rounded-lg"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg text-white font-semibold">{{ exp.title }}</h3>
                  <span
                    v-if="exp.current"
                    class="px-2 py-1 bg-green-600 text-white rounded text-xs"
                  >
                    Current
                  </span>
                </div>
                <p class="text-cyan-400 text-sm mb-2">{{ exp.company }}</p>
                <p class="text-sub text-sm mb-2">{{ exp.period }}</p>
                <p class="text-sub text-sm">{{ exp.description }}</p>
              </div>
              <div class="flex gap-2 ml-4">
                <button
                  @click="editExperience(exp)"
                  class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  @click="deleteExperience(exp.id)"
                  class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Education Management -->
      <div v-if="activeTab === 'Education'" class="bg-[#1E2128FF] p-6 rounded-lg">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl text-white font-semibold">Manage Education</h2>
          <button @click="showEducationForm = true" class="btn-primary px-4 py-2">
            Add New Education
          </button>
        </div>

        <!-- Education Form -->
        <div v-if="showEducationForm" class="bg-[#323743FF] p-6 rounded-lg mb-6">
          <h3 class="text-xl text-white font-semibold mb-4">
            {{ editingEducation ? 'Edit Education' : 'New Education' }}
          </h3>
          
          <form @submit.prevent="saveEducation" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-white mb-2">Degree *</label>
                <input
                  v-model="educationForm.degree"
                  type="text"
                  required
                  class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-white mb-2">School *</label>
                <input
                  v-model="educationForm.school"
                  type="text"
                  required
                  class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg"
                />
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-white mb-2">Year *</label>
                <input
                  v-model="educationForm.year"
                  type="text"
                  placeholder="2018 - 2022"
                  required
                  class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-white mb-2">Order</label>
                <input
                  v-model.number="educationForm.order_index"
                  type="number"
                  class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                v-model="educationForm.description"
                rows="3"
                class="w-full px-4 py-2 bg-[#1E2128FF] text-white rounded-lg"
              ></textarea>
            </div>

            <div class="flex gap-4">
              <button type="submit" class="btn-primary px-6 py-2">
                {{ editingEducation ? 'Update' : 'Create' }} Education
              </button>
              <button type="button" @click="cancelEducationForm" class="px-6 py-2 bg-gray-600 text-white rounded-lg">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Education List -->
        <div class="space-y-4">
          <div
            v-for="edu in education"
            :key="edu.id"
            class="bg-[#323743FF] p-4 rounded-lg"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="text-lg text-white font-semibold mb-2">{{ edu.degree }}</h3>
                <p class="text-cyan-400 text-sm mb-2">{{ edu.school }}</p>
                <p class="text-sub text-sm mb-2">{{ edu.year }}</p>
                <p class="text-sub text-sm">{{ edu.description }}</p>
              </div>
              <div class="flex gap-2 ml-4">
                <button
                  @click="editEducation(edu)"
                  class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  @click="deleteEducation(edu.id)"
                  class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Authentication
const isAuthenticated = ref(false)
const password = ref('')
const loginError = ref('')
const authToken = ref('')

// Check if already authenticated on mount
onMounted(() => {
  const savedToken = localStorage.getItem('adminToken')
  if (savedToken) {
    authToken.value = savedToken
    isAuthenticated.value = true
    // Set default header for all requests
    setAuthHeader(savedToken)
  }
})

const setAuthHeader = (token) => {
  // This will be used in all admin API calls
  authToken.value = token
}

const handleLogin = async () => {
  try {
    loginError.value = ''
    
    // Call the login endpoint to verify password
    const result = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        password: password.value
      }
    })
    
    // If successful, save token and authenticate
    const token = result.token
    localStorage.setItem('adminToken', token)
    authToken.value = token
    isAuthenticated.value = true
    setAuthHeader(token)
    
    // Load all data after successful login
    await loadProjects()
    await loadBlogs()
    await loadExperience()
    await loadEducation()
    await loadMessages()
    
  } catch (error) {
    console.error('Login failed:', error)
    loginError.value = 'Invalid password. Please try again.'
  }
}

const handleLogout = () => {
  localStorage.removeItem('adminToken')
  authToken.value = ''
  isAuthenticated.value = false
  password.value = ''
}

// Helper function to make authenticated requests
const authFetch = (url, options = {}) => {
  return $fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': authToken.value
    }
  })
}

// Active tab
const activeTab = ref('Projects')
const tabs = ['Projects', 'Blogs', 'Experience', 'Education', 'Messages']
const showProjectForm = ref(false)
const editingProject = ref(null)

// Projects
const projects = ref([])
const projectForm = ref({
  title: '',
  description: '',
  long_description: '',
  category: 'Frontend',
  github_url: '',
  demo_url: '',
  technologies: [],
  status: 'Completed',
  featured: false
})

const technologiesString = ref('')

// Blogs
const showBlogForm = ref(false)
const editingBlog = ref(null)
const blogs = ref([])
const blogForm = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  image_url: '',
  tags: [],
  published: false
})
const tagsString = ref('')

// Experience
const showExperienceForm = ref(false)
const editingExperience = ref(null)
const experience = ref([])
const experienceForm = ref({
  title: '',
  company: '',
  period: '',
  description: '',
  current: false,
  order_index: 0
})

// Education
const showEducationForm = ref(false)
const editingEducation = ref(null)
const education = ref([])
const educationForm = ref({
  degree: '',
  school: '',
  year: '',
  description: '',
  order_index: 0
})

// Messages
const messages = ref([])

// Load data on mount
onMounted(async () => {
  // Wait a bit for auth to be set
  await nextTick()
  
  if (isAuthenticated.value) {
    await loadProjects()
    await loadBlogs()
    await loadExperience()
    await loadEducation()
    await loadMessages()
  }
})

const loadProjects = async () => {
  try {
    const { data } = await $fetch('/api/projects')
    projects.value = data || []
  } catch (error) {
    console.error('Failed to load projects:', error)
  }
}

const loadMessages = async () => {
  try {
    const { data } = await authFetch('/api/admin/messages')
    messages.value = data || []
  } catch (error) {
    console.error('Failed to load messages:', error)
  }
}

const saveProject = async () => {
  try {
    // Parse technologies
    projectForm.value.technologies = technologiesString.value
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    if (editingProject.value) {
      // Update existing project
      await authFetch(`/api/admin/projects/${editingProject.value.id}`, {
        method: 'PUT',
        body: projectForm.value
      })
    } else {
      // Create new project
      await authFetch('/api/admin/projects', {
        method: 'POST',
        body: projectForm.value
      })
    }

    await loadProjects()
    cancelProjectForm()
    alert('Project saved successfully!')
  } catch (error) {
    console.error('Failed to save project:', error)
    alert('Failed to save project')
  }
}

const editProject = (project) => {
  editingProject.value = project
  projectForm.value = { ...project }
  technologiesString.value = project.technologies?.join(', ') || ''
  showProjectForm.value = true
}

const deleteProject = async (id) => {
  if (!confirm('Are you sure you want to delete this project?')) return

  try {
    await authFetch(`/api/admin/projects/${id}`, {
      method: 'DELETE'
    })
    await loadProjects()
    alert('Project deleted successfully!')
  } catch (error) {
    console.error('Failed to delete project:', error)
    alert('Failed to delete project')
  }
}

const cancelProjectForm = () => {
  showProjectForm.value = false
  editingProject.value = null
  projectForm.value = {
    title: '',
    description: '',
    long_description: '',
    category: 'Frontend',
    github_url: '',
    demo_url: '',
    technologies: [],
    status: 'Completed',
    featured: false
  }
  technologiesString.value = ''
}

const markAsRead = async (id) => {
  try {
    await authFetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      body: { read: true }
    })
    await loadMessages()
  } catch (error) {
    console.error('Failed to mark message as read:', error)
  }
}

// ===== BLOGS CRUD =====
const loadBlogs = async () => {
  try {
    const { data } = await authFetch('/api/admin/blogs')
    blogs.value = data || []
  } catch (error) {
    console.error('Failed to load blogs:', error)
  }
}

// Image upload state
const uploadingImage = ref(false)
const uploadError = ref('')

// Handle blog image upload
const handleBlogImageUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  uploadingImage.value = true
  uploadError.value = ''

  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed')
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB')
    }

    // Create form data
    const formData = new FormData()
    formData.append('file', file)

    // Upload to API
    const response = await $fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    })

    if (response.success && response.url) {
      blogForm.value.image_url = response.url
    } else {
      throw new Error(response.error || 'Upload failed')
    }

  } catch (error) {
    console.error('Image upload error:', error)
    uploadError.value = error.message || 'Failed to upload image'
  } finally {
    uploadingImage.value = false
    // Reset the file input
    event.target.value = ''
  }
}

const saveBlog = async () => {
  try {
    // Parse tags
    blogForm.value.tags = tagsString.value
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    if (editingBlog.value) {
      await authFetch(`/api/admin/blogs/${editingBlog.value.id}`, {
        method: 'PUT',
        body: blogForm.value
      })
    } else {
      await authFetch('/api/admin/blogs', {
        method: 'POST',
        body: blogForm.value
      })
    }

    await loadBlogs()
    cancelBlogForm()
    alert('Blog saved successfully!')
  } catch (error) {
    console.error('Failed to save blog:', error)
    alert('Failed to save blog')
  }
}

const editBlog = (blog) => {
  editingBlog.value = blog
  blogForm.value = { ...blog }
  tagsString.value = blog.tags?.join(', ') || ''
  showBlogForm.value = true
}

const deleteBlog = async (id) => {
  if (!confirm('Are you sure you want to delete this blog?')) return

  try {
    await authFetch(`/api/admin/blogs/${id}`, {
      method: 'DELETE'
    })
    await loadBlogs()
    alert('Blog deleted successfully!')
  } catch (error) {
    console.error('Failed to delete blog:', error)
    alert('Failed to delete blog')
  }
}

const cancelBlogForm = () => {
  showBlogForm.value = false
  editingBlog.value = null
  blogForm.value = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    tags: [],
    published: false
  }
  tagsString.value = ''
}

// ===== EXPERIENCE CRUD =====
const loadExperience = async () => {
  try {
    const { data } = await $fetch('/api/experience')
    experience.value = data || []
  } catch (error) {
    console.error('Failed to load experience:', error)
  }
}

const saveExperience = async () => {
  try {
    if (editingExperience.value) {
      await authFetch(`/api/admin/experience/${editingExperience.value.id}`, {
        method: 'PUT',
        body: experienceForm.value
      })
    } else {
      await authFetch('/api/admin/experience', {
        method: 'POST',
        body: experienceForm.value
      })
    }

    await loadExperience()
    cancelExperienceForm()
    alert('Experience saved successfully!')
  } catch (error) {
    console.error('Failed to save experience:', error)
    alert('Failed to save experience')
  }
}

const editExperience = (exp) => {
  editingExperience.value = exp
  experienceForm.value = { ...exp }
  showExperienceForm.value = true
}

const deleteExperience = async (id) => {
  if (!confirm('Are you sure you want to delete this experience?')) return

  try {
    await authFetch(`/api/admin/experience/${id}`, {
      method: 'DELETE'
    })
    await loadExperience()
    alert('Experience deleted successfully!')
  } catch (error) {
    console.error('Failed to delete experience:', error)
    alert('Failed to delete experience')
  }
}

const cancelExperienceForm = () => {
  showExperienceForm.value = false
  editingExperience.value = null
  experienceForm.value = {
    title: '',
    company: '',
    period: '',
    description: '',
    current: false,
    order_index: 0
  }
}

// ===== EDUCATION CRUD =====
const loadEducation = async () => {
  try {
    const { data } = await $fetch('/api/education')
    education.value = data || []
  } catch (error) {
    console.error('Failed to load education:', error)
  }
}

const saveEducation = async () => {
  try {
    if (editingEducation.value) {
      await authFetch(`/api/admin/education/${editingEducation.value.id}`, {
        method: 'PUT',
        body: educationForm.value
      })
    } else {
      await authFetch('/api/admin/education', {
        method: 'POST',
        body: educationForm.value
      })
    }

    await loadEducation()
    cancelEducationForm()
    alert('Education saved successfully!')
  } catch (error) {
    console.error('Failed to save education:', error)
    alert('Failed to save education')
  }
}

const editEducation = (edu) => {
  editingEducation.value = edu
  educationForm.value = { ...edu }
  showEducationForm.value = true
}

const deleteEducation = async (id) => {
  if (!confirm('Are you sure you want to delete this education?')) return

  try {
    await authFetch(`/api/admin/education/${id}`, {
      method: 'DELETE'
    })
    await loadEducation()
    alert('Education deleted successfully!')
  } catch (error) {
    console.error('Failed to delete education:', error)
    alert('Failed to delete education')
  }
}

const cancelEducationForm = () => {
  showEducationForm.value = false
  editingEducation.value = null
  educationForm.value = {
    degree: '',
    school: '',
    year: '',
    description: '',
    order_index: 0
  }
}

// SEO Meta
useSeoMeta({
  title: 'Admin Dashboard',
  robots: 'noindex, nofollow'
})
</script>
