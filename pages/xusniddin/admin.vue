<template>
  <div class="min-h-screen py-20 px-4 md:px-0">
    <!-- Login Screen -->
    <div v-if="!isAuthenticated" class="max-w-md mx-auto mt-24">
      <div class="glass-panel p-10 rounded-2xl">
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <i class="pi pi-lock text-2xl text-white"></i>
          </div>
          <h1 class="text-3xl text-main font-bold mb-2">{{ $t('admin.loginTitle') }}</h1>
          <p class="text-sub">{{ $t('admin.loginSubtitle') }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-main mb-2">{{ $t('admin.password') }}</label>
            <input
              v-model="password"
              type="password"
              :placeholder="$t('admin.passwordPlaceholder')"
              class="admin-input"
              required
            />
          </div>

          <div v-if="loginError" class="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            {{ loginError }}
          </div>

          <button type="submit" class="w-full admin-btn-primary py-3">
            {{ $t('admin.login') }}
          </button>
        </form>
      </div>
    </div>

    <!-- Admin Dashboard -->
    <div v-else class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-12 md:mb-16">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div>
            <h1 class="text-3xl md:text-5xl text-main font-black tracking-tight">{{ $t('admin.dashboardTitle') }}</h1>
            <p class="text-sub mt-2">{{ $t('admin.dashboardSubtitle') }}</p>
          </div>
          <button @click="handleLogout" class="px-5 py-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all text-sm font-medium">
            <i class="pi pi-sign-out mr-2"></i>{{ $t('admin.logout') }}
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex flex-wrap gap-2 md:gap-3 mb-8">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-5 py-2.5 rounded-xl font-medium transition-all text-sm',
            activeTab === tab.key
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'glass-panel text-sub hover:text-main hover:border-blue-500/30'
          ]"
        >
          <i :class="tab.icon" class="mr-2"></i>{{ tab.label }}
        </button>
      </div>

      <!-- ==================== PROJECTS TAB ==================== -->
      <div v-if="activeTab === 'Projects'" class="glass-panel p-6 md:p-8 rounded-2xl">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 class="text-xl md:text-2xl text-main font-bold">{{ $t('admin.manageProjects') }}</h2>
          <button @click="showProjectForm = true" class="admin-btn-primary">
            <i class="pi pi-plus mr-2"></i>{{ $t('admin.addNewProject') }}
          </button>
        </div>

        <!-- Project Form -->
        <div v-if="showProjectForm" class="glass-panel p-6 rounded-xl mb-8 border border-blue-500/20">
          <h3 class="text-lg text-main font-bold mb-6 flex items-center gap-2">
            <i class="pi pi-pencil text-blue-500"></i>
            {{ editingProject ? $t('admin.editProject') : $t('admin.newProject') }}
          </h3>
          
          <form @submit.prevent="saveProject" class="space-y-5">
            <!-- Language tabs for translatable fields -->
            <div class="flex gap-2 mb-4">
              <button type="button" @click="formLang = 'en'" :class="['px-4 py-1.5 rounded-lg text-sm font-medium transition-all', formLang === 'en' ? 'bg-blue-500 text-white' : 'glass-panel text-sub']">
                🇬🇧 {{ $t('admin.langEn') }}
              </button>
              <button type="button" @click="formLang = 'ru'" :class="['px-4 py-1.5 rounded-lg text-sm font-medium transition-all', formLang === 'ru' ? 'bg-purple-500 text-white' : 'glass-panel text-sub']">
                🇷🇺 {{ $t('admin.langRu') }}
              </button>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="admin-label">{{ $t('admin.title') }} ({{ formLang.toUpperCase() }}) *</label>
                <input v-if="formLang === 'en'" v-model="projectForm.title" type="text" required class="admin-input" placeholder="Project name">
                <input v-else v-model="projectForm.title_ru" type="text" class="admin-input" placeholder="Название проекта">
              </div>
              <div>
                <label class="admin-label">{{ $t('admin.category') }}</label>
                <select v-model="projectForm.category" class="admin-input">
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                </select>
              </div>
            </div>

            <div>
              <label class="admin-label">{{ $t('admin.shortDescription') }} ({{ formLang.toUpperCase() }}) *</label>
              <textarea v-if="formLang === 'en'" v-model="projectForm.description" rows="2" required class="admin-input" placeholder="Brief description"></textarea>
              <textarea v-else v-model="projectForm.description_ru" rows="2" class="admin-input" placeholder="Краткое описание"></textarea>
            </div>

            <div>
              <label class="admin-label">{{ $t('admin.longDescription') }} ({{ formLang.toUpperCase() }})</label>
              <textarea v-if="formLang === 'en'" v-model="projectForm.long_description" rows="4" class="admin-input" placeholder="Detailed description"></textarea>
              <textarea v-else v-model="projectForm.long_description_ru" rows="4" class="admin-input" placeholder="Подробное описание"></textarea>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="admin-label">{{ $t('admin.githubUrl') }}</label>
                <input v-model="projectForm.github_url" type="url" class="admin-input" placeholder="https://github.com/...">
              </div>
              <div>
                <label class="admin-label">{{ $t('admin.demoUrl') }}</label>
                <input v-model="projectForm.demo_url" type="url" class="admin-input" placeholder="https://demo.com">
              </div>
            </div>

            <div>
              <label class="admin-label">{{ $t('admin.technologies') }}</label>
              <input v-model="technologiesString" type="text" class="admin-input" placeholder="Vue.js, Nuxt.js, Tailwind CSS">
            </div>

            <!-- Image Upload -->
            <div>
              <label class="admin-label">{{ $t('admin.projectImage') }}</label>
              <div class="space-y-3">
                <input
                  ref="projectImageInput"
                  type="file"
                  accept="image/*"
                  @change="handleProjectImageUpload"
                  class="admin-input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer"
                >
                <div v-if="imageUploadStatus" class="text-sm" :class="imageUploadStatus.success ? 'text-green-400' : 'text-red-400'">
                  {{ imageUploadStatus.message }}
                </div>
                <div v-if="projectForm.image_url" class="flex items-center gap-3">
                  <img :src="projectForm.image_url" alt="Preview" class="w-32 h-20 object-cover rounded-lg border border-white/10">
                  <button type="button" @click="removeProjectImage" class="text-red-400 text-sm hover:text-red-300 flex items-center gap-1">
                    <i class="pi pi-trash"></i> {{ $t('admin.remove') }}
                  </button>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-3 gap-4">
              <div>
                <label class="admin-label">{{ $t('admin.status') }}</label>
                <select v-model="projectForm.status" class="admin-input">
                  <option value="Completed">{{ $t('admin.completed') }}</option>
                  <option value="In Progress">{{ $t('admin.inProgress') }}</option>
                  <option value="Planned">{{ $t('admin.planned') }}</option>
                </select>
              </div>
              <div class="flex items-center pt-6">
                <label class="flex items-center cursor-pointer gap-2">
                  <input v-model="projectForm.featured" type="checkbox" class="w-4 h-4 rounded accent-blue-500">
                  <span class="text-main text-sm">{{ $t('admin.featured') }}</span>
                </label>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <button type="submit" class="admin-btn-primary">
                {{ editingProject ? $t('admin.update') : $t('admin.create') }}
              </button>
              <button type="button" @click="cancelProjectForm" class="admin-btn-secondary">
                {{ $t('admin.cancel') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Projects List -->
        <div class="space-y-3">
          <div
            v-for="project in projects"
            :key="project.id"
            class="glass-panel p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-blue-500/20 transition-all"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-main font-semibold truncate">{{ project.title }}</h3>
                <span v-if="project.featured" class="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">⭐</span>
              </div>
              <p class="text-sub text-sm line-clamp-1">{{ project.description }}</p>
              <div class="flex flex-wrap gap-1.5 mt-2">
                <span v-for="tech in project.technologies" :key="tech" class="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs">
                  {{ tech }}
                </span>
              </div>
            </div>
            <div class="flex gap-2 shrink-0">
              <button @click="editProject(project)" class="admin-btn-icon text-blue-400 hover:bg-blue-500/10" :title="$t('admin.edit')">
                <i class="pi pi-pencil"></i>
              </button>
              <button @click="deleteProject(project.id)" class="admin-btn-icon text-red-400 hover:bg-red-500/10" :title="$t('admin.delete')">
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== BLOGS TAB ==================== -->
      <div v-if="activeTab === 'Blogs'" class="glass-panel p-6 md:p-8 rounded-2xl">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl md:text-2xl text-main font-bold">{{ $t('admin.manageBlogs') }}</h2>
          <button @click="showBlogForm = true" class="admin-btn-primary">
            <i class="pi pi-plus mr-2"></i>{{ $t('admin.addNewBlog') }}
          </button>
        </div>

        <!-- Blog Form -->
        <div v-if="showBlogForm" class="glass-panel p-6 rounded-xl mb-8 border border-purple-500/20">
          <h3 class="text-lg text-main font-bold mb-6 flex items-center gap-2">
            <i class="pi pi-file-edit text-purple-500"></i>
            {{ editingBlog ? $t('admin.editBlog') : $t('admin.newBlog') }}
          </h3>
          
          <form @submit.prevent="saveBlog" class="space-y-5">
            <!-- Language tabs -->
            <div class="flex gap-2 mb-4">
              <button type="button" @click="formLang = 'en'" :class="['px-4 py-1.5 rounded-lg text-sm font-medium transition-all', formLang === 'en' ? 'bg-blue-500 text-white' : 'glass-panel text-sub']">
                🇬🇧 {{ $t('admin.langEn') }}
              </button>
              <button type="button" @click="formLang = 'ru'" :class="['px-4 py-1.5 rounded-lg text-sm font-medium transition-all', formLang === 'ru' ? 'bg-purple-500 text-white' : 'glass-panel text-sub']">
                🇷🇺 {{ $t('admin.langRu') }}
              </button>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="admin-label">{{ $t('admin.title') }} ({{ formLang.toUpperCase() }}) *</label>
                <input v-if="formLang === 'en'" v-model="blogForm.title" type="text" required class="admin-input" />
                <input v-else v-model="blogForm.title_ru" type="text" class="admin-input" placeholder="Заголовок" />
              </div>
              <div>
                <label class="admin-label">{{ $t('admin.slug') }} *</label>
                <input v-model="blogForm.slug" type="text" placeholder="Auto-generated from title" class="admin-input" />
              </div>
            </div>

            <div>
              <label class="admin-label">{{ $t('admin.excerpt') }} ({{ formLang.toUpperCase() }})</label>
              <textarea v-if="formLang === 'en'" v-model="blogForm.excerpt" rows="2" class="admin-input"></textarea>
              <textarea v-else v-model="blogForm.excerpt_ru" rows="2" class="admin-input" placeholder="Отрывок"></textarea>
            </div>

            <div>
              <label class="admin-label">{{ $t('admin.content') }} ({{ formLang.toUpperCase() }}) *</label>
              <textarea v-if="formLang === 'en'" v-model="blogForm.content" rows="10" required placeholder="Supports Markdown" class="admin-input font-mono"></textarea>
              <textarea v-else v-model="blogForm.content_ru" rows="10" class="admin-input font-mono" placeholder="Поддерживает Markdown"></textarea>
            </div>

            <div>
              <label class="admin-label">{{ $t('admin.image') }}</label>
              <div class="mb-3">
                <label class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg cursor-pointer hover:opacity-90 transition-opacity text-sm font-medium">
                  <i class="pi pi-image mr-2"></i>{{ $t('admin.uploadImage') }}
                  <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" @change="handleBlogImageUpload" class="hidden" />
                </label>
                <span v-if="uploadingImage" class="ml-3 text-blue-400 text-sm">{{ $t('admin.uploading') }}</span>
                <span v-if="uploadError" class="ml-3 text-red-400 text-sm">{{ uploadError }}</span>
              </div>
              <div v-if="blogForm.image_url" class="mb-3 flex items-center gap-3">
                <img :src="blogForm.image_url" alt="Preview" class="h-24 w-auto rounded-lg object-cover border border-white/10" />
                <button type="button" @click="blogForm.image_url = ''" class="text-sm text-red-400 hover:text-red-300 flex items-center gap-1">
                  <i class="pi pi-trash"></i> {{ $t('admin.removeImage') }}
                </button>
              </div>
              <div>
                <label class="block text-xs text-sub mb-1">{{ $t('admin.orEnterUrl') }}</label>
                <input v-model="blogForm.image_url" type="url" placeholder="https://..." class="admin-input" />
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="admin-label">{{ $t('admin.tags') }}</label>
                <input v-model="tagsString" type="text" class="admin-input" placeholder="AI, Web Dev, Tutorial" />
              </div>
              <div class="flex items-center pt-6">
                <label class="flex items-center cursor-pointer gap-2">
                  <input v-model="blogForm.published" type="checkbox" class="w-4 h-4 rounded accent-blue-500">
                  <span class="text-main text-sm">{{ $t('admin.published') }}</span>
                </label>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <button type="submit" class="admin-btn-primary">
                {{ editingBlog ? $t('admin.update') : $t('admin.create') }}
              </button>
              <button type="button" @click="cancelBlogForm" class="admin-btn-secondary">
                {{ $t('admin.cancel') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Blogs List -->
        <div class="space-y-3">
          <div
            v-for="blog in blogs"
            :key="blog.id"
            class="glass-panel p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-purple-500/20 transition-all"
          >
            <div class="flex gap-4 flex-1 min-w-0">
              <img v-if="blog.image_url" :src="blog.image_url" alt="" class="w-16 h-16 object-cover rounded-lg shrink-0 border border-white/10">
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-main font-semibold truncate">{{ blog.title }}</h3>
                  <span :class="[blog.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400', 'text-xs px-2 py-0.5 rounded-full']">
                    {{ blog.published ? $t('admin.published') : $t('admin.draft') }}
                  </span>
                </div>
                <p class="text-sub text-sm line-clamp-1">{{ blog.excerpt || $t('admin.noExcerpt') }}</p>
                <div class="flex items-center gap-3 mt-1 text-xs text-sub">
                  <span>{{ $t('admin.created') }}: {{ new Date(blog.created_at).toLocaleDateString() }}</span>
                  <span v-if="blog.views">{{ $t('admin.views') }}: {{ blog.views }}</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2 shrink-0">
              <button @click="editBlog(blog)" class="admin-btn-icon text-blue-400 hover:bg-blue-500/10">
                <i class="pi pi-pencil"></i>
              </button>
              <button @click="deleteBlog(blog.id)" class="admin-btn-icon text-red-400 hover:bg-red-500/10">
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== EXPERIENCE TAB ==================== -->
      <div v-if="activeTab === 'Experience'" class="glass-panel p-6 md:p-8 rounded-2xl">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl md:text-2xl text-main font-bold">{{ $t('admin.manageExperience') }}</h2>
          <button @click="showExperienceForm = true" class="admin-btn-primary">
            <i class="pi pi-plus mr-2"></i>{{ $t('admin.addNewExperience') }}
          </button>
        </div>

        <!-- Experience Form -->
        <div v-if="showExperienceForm" class="glass-panel p-6 rounded-xl mb-8 border border-green-500/20">
          <h3 class="text-lg text-main font-bold mb-6 flex items-center gap-2">
            <i class="pi pi-briefcase text-green-500"></i>
            {{ editingExperience ? $t('admin.editExperience') : $t('admin.newExperience') }}
          </h3>
          
          <form @submit.prevent="saveExperience" class="space-y-5">
            <!-- Language tabs -->
            <div class="flex gap-2 mb-4">
              <button type="button" @click="formLang = 'en'" :class="['px-4 py-1.5 rounded-lg text-sm font-medium transition-all', formLang === 'en' ? 'bg-blue-500 text-white' : 'glass-panel text-sub']">
                🇬🇧 {{ $t('admin.langEn') }}
              </button>
              <button type="button" @click="formLang = 'ru'" :class="['px-4 py-1.5 rounded-lg text-sm font-medium transition-all', formLang === 'ru' ? 'bg-purple-500 text-white' : 'glass-panel text-sub']">
                🇷🇺 {{ $t('admin.langRu') }}
              </button>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="admin-label">{{ $t('admin.jobTitle') }} ({{ formLang.toUpperCase() }}) *</label>
                <input v-if="formLang === 'en'" v-model="experienceForm.title" type="text" required class="admin-input" placeholder="Frontend Developer">
                <input v-else v-model="experienceForm.title_ru" type="text" class="admin-input" placeholder="Фронтенд Разработчик">
              </div>
              <div>
                <label class="admin-label">{{ $t('admin.company') }} *</label>
                <input v-model="experienceForm.company" type="text" required class="admin-input" placeholder="Company name">
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="admin-label">{{ $t('admin.period') }} *</label>
                <input v-model="experienceForm.period" type="text" required class="admin-input" placeholder="Jan 2024 - Present">
              </div>
              <div>
                <label class="admin-label">{{ $t('admin.order') }}</label>
                <input v-model.number="experienceForm.order_index" type="number" class="admin-input">
              </div>
            </div>

            <div>
              <label class="admin-label">{{ $t('admin.description') }} ({{ formLang.toUpperCase() }})</label>
              <textarea v-if="formLang === 'en'" v-model="experienceForm.description" rows="3" class="admin-input" placeholder="Job responsibilities..."></textarea>
              <textarea v-else v-model="experienceForm.description_ru" rows="3" class="admin-input" placeholder="Должностные обязанности..."></textarea>
            </div>

            <label class="flex items-center cursor-pointer gap-2">
              <input v-model="experienceForm.current" type="checkbox" class="w-4 h-4 rounded accent-blue-500">
              <span class="text-main text-sm">{{ $t('admin.currentPosition') }}</span>
            </label>

            <div class="flex gap-3 pt-2">
              <button type="submit" class="admin-btn-primary">
                {{ editingExperience ? $t('admin.update') : $t('admin.create') }}
              </button>
              <button type="button" @click="cancelExperienceForm" class="admin-btn-secondary">
                {{ $t('admin.cancel') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Experience List -->
        <div class="space-y-3">
          <div
            v-for="exp in experience"
            :key="exp.id"
            class="glass-panel p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-green-500/20 transition-all"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-main font-semibold">{{ exp.title }}</h3>
                <span v-if="exp.current" class="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">{{ $t('admin.current') }}</span>
              </div>
              <p class="text-sub text-sm">{{ exp.company }} · {{ exp.period }}</p>
            </div>
            <div class="flex gap-2 shrink-0">
              <button @click="editExperience(exp)" class="admin-btn-icon text-blue-400 hover:bg-blue-500/10">
                <i class="pi pi-pencil"></i>
              </button>
              <button @click="deleteExperience(exp.id)" class="admin-btn-icon text-red-400 hover:bg-red-500/10">
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== EDUCATION TAB ==================== -->
      <div v-if="activeTab === 'Education'" class="glass-panel p-6 md:p-8 rounded-2xl">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl md:text-2xl text-main font-bold">{{ $t('admin.manageEducation') }}</h2>
          <button @click="showEducationForm = true" class="admin-btn-primary">
            <i class="pi pi-plus mr-2"></i>{{ $t('admin.addNewEducation') }}
          </button>
        </div>

        <!-- Education Form -->
        <div v-if="showEducationForm" class="glass-panel p-6 rounded-xl mb-8 border border-amber-500/20">
          <h3 class="text-lg text-main font-bold mb-6 flex items-center gap-2">
            <i class="pi pi-graduation-cap text-amber-500"></i>
            {{ editingEducation ? $t('admin.editEducation') : $t('admin.newEducation') }}
          </h3>
          
          <form @submit.prevent="saveEducation" class="space-y-5">
            <!-- Language tabs -->
            <div class="flex gap-2 mb-4">
              <button type="button" @click="formLang = 'en'" :class="['px-4 py-1.5 rounded-lg text-sm font-medium transition-all', formLang === 'en' ? 'bg-blue-500 text-white' : 'glass-panel text-sub']">
                🇬🇧 {{ $t('admin.langEn') }}
              </button>
              <button type="button" @click="formLang = 'ru'" :class="['px-4 py-1.5 rounded-lg text-sm font-medium transition-all', formLang === 'ru' ? 'bg-purple-500 text-white' : 'glass-panel text-sub']">
                🇷🇺 {{ $t('admin.langRu') }}
              </button>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="admin-label">{{ $t('admin.degree') }} ({{ formLang.toUpperCase() }}) *</label>
                <input v-if="formLang === 'en'" v-model="educationForm.degree" type="text" required class="admin-input" placeholder="B.Sc. Computer Science">
                <input v-else v-model="educationForm.degree_ru" type="text" class="admin-input" placeholder="Бакалавр Информатики">
              </div>
              <div>
                <label class="admin-label">{{ $t('admin.school') }} *</label>
                <input v-model="educationForm.school" type="text" required class="admin-input" placeholder="University name">
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="admin-label">{{ $t('admin.year') }} *</label>
                <input v-model="educationForm.year" type="text" required class="admin-input" placeholder="2022 - 2026">
              </div>
              <div>
                <label class="admin-label">{{ $t('admin.order') }}</label>
                <input v-model.number="educationForm.order_index" type="number" class="admin-input">
              </div>
            </div>

            <div>
              <label class="admin-label">{{ $t('admin.description') }} ({{ formLang.toUpperCase() }})</label>
              <textarea v-if="formLang === 'en'" v-model="educationForm.description" rows="3" class="admin-input" placeholder="Relevant coursework, achievements..."></textarea>
              <textarea v-else v-model="educationForm.description_ru" rows="3" class="admin-input" placeholder="Курсы, достижения..."></textarea>
            </div>

            <div class="flex gap-3 pt-2">
              <button type="submit" class="admin-btn-primary">
                {{ editingEducation ? $t('admin.update') : $t('admin.create') }}
              </button>
              <button type="button" @click="cancelEducationForm" class="admin-btn-secondary">
                {{ $t('admin.cancel') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Education List -->
        <div class="space-y-3">
          <div
            v-for="edu in education"
            :key="edu.id"
            class="glass-panel p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-amber-500/20 transition-all"
          >
            <div class="flex-1 min-w-0">
              <h3 class="text-main font-semibold">{{ edu.degree }}</h3>
              <p class="text-sub text-sm">{{ edu.school }} · {{ edu.year }}</p>
            </div>
            <div class="flex gap-2 shrink-0">
              <button @click="editEducation(edu)" class="admin-btn-icon text-blue-400 hover:bg-blue-500/10">
                <i class="pi pi-pencil"></i>
              </button>
              <button @click="deleteEducation(edu.id)" class="admin-btn-icon text-red-400 hover:bg-red-500/10">
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== MESSAGES TAB ==================== -->
      <div v-if="activeTab === 'Messages'" class="glass-panel p-6 md:p-8 rounded-2xl">
        <h2 class="text-xl md:text-2xl text-main font-bold mb-8">{{ $t('admin.contactMessages') }}</h2>
        
        <div class="space-y-3">
          <div
            v-for="message in messages"
            :key="message.id"
            class="glass-panel p-5 rounded-xl hover:border-blue-500/20 transition-all"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-main font-semibold">{{ message.name }}</h3>
                <p class="text-sub text-sm">{{ message.email }}</p>
              </div>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  message.read ? 'bg-gray-500/20 text-sub' : 'bg-blue-500/20 text-blue-400'
                ]"
              >
                {{ message.read ? $t('admin.read') : $t('admin.new') }}
              </span>
            </div>
            <p v-if="message.subject" class="text-main font-medium mb-2">{{ message.subject }}</p>
            <p class="text-sub text-sm leading-relaxed">{{ message.message }}</p>
            <div class="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
              <p class="text-sub text-xs">
                {{ new Date(message.created_at).toLocaleString() }}
              </p>
              <button
                v-if="!message.read"
                @click="markAsRead(message.id)"
                class="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <i class="pi pi-check"></i> {{ $t('admin.markAsRead') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Auth state
const isAuthenticated = ref(false)
const password = ref('')
const loginError = ref('')
const authToken = ref('')

// Form language switcher
const formLang = ref('en')

const handleLogin = async () => {
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { password: password.value }
    })

    if (response.success) {
      isAuthenticated.value = true
      authToken.value = response.token
      loginError.value = ''
      
      // Load data
      await loadProjects()
      await loadBlogs()
      await loadExperience()
      await loadEducation()
      await loadMessages()
    } else {
      loginError.value = response.message || 'Invalid password'
    }
  } catch (error) {
    loginError.value = 'Invalid password. Please try again.'
  }
}

const handleLogout = () => {
  isAuthenticated.value = false
  authToken.value = ''
  password.value = ''
}

// Authenticated fetch helper
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
const tabs = [
  { key: 'Projects', label: 'Projects', icon: 'pi pi-folder' },
  { key: 'Blogs', label: 'Blogs', icon: 'pi pi-file-edit' },
  { key: 'Experience', label: 'Experience', icon: 'pi pi-briefcase' },
  { key: 'Education', label: 'Education', icon: 'pi pi-graduation-cap' },
  { key: 'Messages', label: 'Messages', icon: 'pi pi-envelope' }
]
const showProjectForm = ref(false)
const editingProject = ref(null)

// Projects
const projects = ref([])
const projectForm = ref({
  title: '',
  title_ru: '',
  description: '',
  description_ru: '',
  long_description: '',
  long_description_ru: '',
  image_url: '',
  category: 'Frontend',
  github_url: '',
  demo_url: '',
  technologies: [],
  status: 'Completed',
  featured: false
})

const technologiesString = ref('')
const projectImageInput = ref(null)
const imageUploadStatus = ref(null)

// Blogs
const showBlogForm = ref(false)
const editingBlog = ref(null)
const blogs = ref([])
const blogForm = ref({
  title: '',
  title_ru: '',
  slug: '',
  excerpt: '',
  excerpt_ru: '',
  content: '',
  content_ru: '',
  image_url: '',
  tags: [],
  published: false
})
const tagsString = ref('')

// Auto-generate slug from title
watch(() => blogForm.value.title, (newTitle) => {
  if (!editingBlog.value && newTitle) {
    blogForm.value.slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
})

// Experience
const showExperienceForm = ref(false)
const editingExperience = ref(null)
const experience = ref([])
const experienceForm = ref({
  title: '',
  title_ru: '',
  company: '',
  period: '',
  description: '',
  description_ru: '',
  current: false,
  order_index: 0
})

// Education
const showEducationForm = ref(false)
const editingEducation = ref(null)
const education = ref([])
const educationForm = ref({
  degree: '',
  degree_ru: '',
  school: '',
  year: '',
  description: '',
  description_ru: '',
  order_index: 0
})

// Messages
const messages = ref([])

// Load data on mount
onMounted(async () => {
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
    projectForm.value.technologies = technologiesString.value
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    if (editingProject.value) {
      await authFetch(`/api/admin/projects/${editingProject.value.id}`, {
        method: 'PUT',
        body: projectForm.value
      })
    } else {
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
  projectForm.value = { ...project, title_ru: project.title_ru || '', description_ru: project.description_ru || '', long_description_ru: project.long_description_ru || '' }
  technologiesString.value = project.technologies?.join(', ') || ''
  showProjectForm.value = true
  formLang.value = 'en'
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
    title_ru: '',
    description: '',
    description_ru: '',
    long_description: '',
    long_description_ru: '',
    image_url: '',
    category: 'Frontend',
    github_url: '',
    demo_url: '',
    technologies: [],
    status: 'Completed',
    featured: false
  }
  technologiesString.value = ''
  imageUploadStatus.value = null
  formLang.value = 'en'
}

// Image upload functions
const handleProjectImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    imageUploadStatus.value = { message: 'Uploading...', success: true }
    const response = await authFetch('/api/admin/upload-project-image', {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
      projectForm.value.image_url = response.url
      imageUploadStatus.value = { message: 'Image uploaded successfully!', success: true }
    } else {
      throw new Error(response.error || 'Upload failed')
    }
  } catch (error) {
    console.error('Failed to upload image:', error)
    imageUploadStatus.value = { message: 'Failed to upload image', success: false }
  }
}

const removeProjectImage = () => {
  projectForm.value.image_url = ''
  imageUploadStatus.value = null
  if (projectImageInput.value) {
    projectImageInput.value.value = ''
  }
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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed')
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB')
    }

    const formData = new FormData()
    formData.append('file', file)

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
    event.target.value = ''
  }
}

const saveBlog = async () => {
  try {
    blogForm.value.tags = tagsString.value
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    blogForm.value.slug = blogForm.value.slug
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

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
  blogForm.value = { ...blog, title_ru: blog.title_ru || '', excerpt_ru: blog.excerpt_ru || '', content_ru: blog.content_ru || '' }
  tagsString.value = blog.tags?.join(', ') || ''
  showBlogForm.value = true
  formLang.value = 'en'
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
    title_ru: '',
    slug: '',
    excerpt: '',
    excerpt_ru: '',
    content: '',
    content_ru: '',
    image_url: '',
    tags: [],
    published: false
  }
  tagsString.value = ''
  formLang.value = 'en'
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
  experienceForm.value = { ...exp, title_ru: exp.title_ru || '', description_ru: exp.description_ru || '' }
  showExperienceForm.value = true
  formLang.value = 'en'
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
    title_ru: '',
    company: '',
    period: '',
    description: '',
    description_ru: '',
    current: false,
    order_index: 0
  }
  formLang.value = 'en'
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
  educationForm.value = { ...edu, degree_ru: edu.degree_ru || '', description_ru: edu.description_ru || '' }
  showEducationForm.value = true
  formLang.value = 'en'
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
    degree_ru: '',
    school: '',
    year: '',
    description: '',
    description_ru: '',
    order_index: 0
  }
  formLang.value = 'en'
}

// SEO Meta
useSeoMeta({
  title: 'Admin Dashboard',
  robots: 'noindex, nofollow'
})
</script>

<style scoped>
/* Admin Design System - matches user-facing glassmorphism */
.admin-input {
  width: 100%;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  background: var(--glass-bg, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
  color: var(--color-text-primary);
  font-size: 0.875rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}

.admin-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.admin-input::placeholder {
  color: var(--color-text-muted, rgba(255, 255, 255, 0.3));
}

.admin-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.admin-btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.25rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.admin-btn-primary:hover {
  opacity: 0.9;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}

.admin-btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.25rem;
  border-radius: 0.75rem;
  background: transparent;
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.admin-btn-secondary:hover {
  border-color: var(--color-text-primary);
  color: var(--color-text-primary);
}

.admin-btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
  background: transparent;
  transition: all 0.2s ease;
  cursor: pointer;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
