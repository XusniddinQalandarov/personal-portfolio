<template>
  <div class="min-h-screen py-24 px-4 md:px-0 transition-colors duration-300">
    <div class="max-w-4xl mx-auto">
      
      <!-- Minimalist Header -->
      <div ref="headerEl" class="mb-20 text-center md:text-left opacity-0">
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-main uppercase mb-6 leading-none">
          {{ $t('contact.title') }}
        </h1>
        <div class="h-1 w-24 bg-blue-500 mt-6 mb-8 mx-auto md:mx-0"></div>
        <p class="text-xl text-sub font-light max-w-xl">
          {{ $t('contact.subtitle') }}
        </p>
      </div>

      <div class="grid md:grid-cols-5 gap-16 md:gap-20">

        <!-- Contact Form (Minimal) -->
        <div ref="formEl" class="md:col-span-3 opacity-0">
          <form @submit.prevent="sendMessage" class="space-y-10">
            
            <div class="relative">
              <input 
                v-model="form.name" 
                type="text" 
                required
                :placeholder="$t('contact.yourName')"
                class="w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 py-4 text-lg text-main placeholder-transparent focus:outline-none focus:border-blue-500 transition-colors peer"
                id="name"
              />
              <label for="name" class="absolute left-0 -top-3 text-sm text-sub font-mono uppercase tracking-widest peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm transition-all pointer-events-none">
                {{ $t('contact.yourName') }}
              </label>
            </div>
            
            <div class="relative">
              <input 
                v-model="form.email" 
                type="email" 
                required
                :placeholder="$t('contact.emailAddress')"
                class="w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 py-4 text-lg text-main placeholder-transparent focus:outline-none focus:border-blue-500 transition-colors peer"
                id="email"
              />
              <label for="email" class="absolute left-0 -top-3 text-sm text-sub font-mono uppercase tracking-widest peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm transition-all pointer-events-none">
                {{ $t('contact.emailAddress') }}
              </label>
            </div>
            
            <div class="relative">
              <textarea 
                v-model="form.message" 
                required
                :placeholder="$t('contact.tellProject')"
                rows="5"
                class="w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 py-4 text-lg text-main placeholder-transparent focus:outline-none focus:border-blue-500 transition-colors resize-none peer"
                id="message"
              ></textarea>
              <label for="message" class="absolute left-0 -top-3 text-sm text-sub font-mono uppercase tracking-widest peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm transition-all pointer-events-none">
                {{ $t('contact.tellProject') }}
              </label>
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="py-3 px-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 text-sm">
              {{ $t('contact.successMessage') }}
            </div>

            <button 
              type="submit"
              :disabled="sending"
              class="group w-full md:w-auto px-12 py-4 bg-main text-charcoal font-bold text-sm uppercase tracking-[0.2em] rounded-full hover:shadow-lg hover:shadow-blue-500/20 transition-all relative overflow-hidden disabled:opacity-50"
            >
              <span class="relative z-10">{{ sending ? $t('contact.sending') : $t('contact.sendMessage') }}</span>
            </button>
          </form>
        </div>

        <!-- Contact Info (Sidebar) -->
        <div ref="infoEl" class="md:col-span-2 space-y-12 opacity-0">
          
          <!-- Direct Contact -->
          <div>
            <h3 class="text-xs font-bold text-sub uppercase tracking-[0.2em] mb-6">{{ $t('contact.directContact') }}</h3>
            <div class="space-y-4">
              <a href="mailto:xusniddinqalandarov2004@gmail.com" class="flex items-center gap-4 group">
                <i class="pi pi-envelope text-lg text-sub group-hover:text-blue-500 transition-colors"></i>
                <span class="text-sub group-hover:text-main transition-colors text-sm">xusniddinqalandarov2004@gmail.com</span>
              </a>
            </div>
          </div>

          <!-- Socials -->
          <div>
            <h3 class="text-xs font-bold text-sub uppercase tracking-[0.2em] mb-6">{{ $t('contact.socials') }}</h3>
            <div class="space-y-4">
              <a href="https://github.com/Xusniddin-devv" target="_blank" class="flex items-center gap-4 group">
                <i class="pi pi-github text-lg text-sub group-hover:text-main transition-colors"></i>
                <span class="text-sub group-hover:text-main transition-colors text-sm">GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/xusniddin-qalandarov/" target="_blank" class="flex items-center gap-4 group">
                <i class="pi pi-linkedin text-lg text-sub group-hover:text-blue-500 transition-colors"></i>
                <span class="text-sub group-hover:text-main transition-colors text-sm">LinkedIn</span>
              </a>
              <a href="https://x.com/Xusniddin_Q" target="_blank" class="flex items-center gap-4 group">
                <i class="pi pi-twitter text-lg text-sub group-hover:text-blue-400 transition-colors"></i>
                <span class="text-sub group-hover:text-main transition-colors text-sm">X (Twitter)</span>
              </a>
              <a href="https://t.me/invaluable_me" target="_blank" class="flex items-center gap-4 group">
                <i class="pi pi-send text-lg text-sub group-hover:text-blue-500 transition-colors"></i>
                <span class="text-sub group-hover:text-main transition-colors text-sm">Telegram</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap';

const { t } = useI18n()

const form = ref({
  name: '',
  email: '',
  message: ''
})
const sending = ref(false)
const successMessage = ref(false)

const headerEl = ref(null)
const formEl = ref(null)
const infoEl = ref(null)

const sendMessage = async () => {
  sending.value = true
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: form.value
    })

    successMessage.value = true
    form.value = { name: '', email: '', message: '' }
    
    setTimeout(() => {
      successMessage.value = false
    }, 5000)
  } catch (error) {
    console.error('Failed to send message:', error)
    alert('Failed to send message. Please try again.')
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  if (process.client) {
    const tl = gsap.timeline();
    tl.fromTo(headerEl.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out"})
      .fromTo(formEl.value, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out"}, "-=0.8")
      .fromTo(infoEl.value, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out"}, "-=0.8");
  }
});

useSeoMeta({
  title: () => t('contact.seoTitle'),
  description: () => t('contact.seoDescription')
})
</script>

<style scoped>
.text-main { color: var(--color-text-primary); }
.text-sub { color: var(--color-text-secondary); }
.bg-main { background-color: var(--color-text-primary); }
.text-charcoal { color: var(--color-bg-primary); }
</style>