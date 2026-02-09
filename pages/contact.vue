<template>
  <div class="min-h-screen py-24 flex flex-col justify-center px-4 md:px-0">
    <div class="max-w-6xl mx-auto w-full">
      
      <!-- Minimalist Header -->
      <div ref="headerEl" class="mb-20 text-center md:text-left opacity-0">
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-main uppercase mb-6">
          Get in Touch
        </h1>
        <p class="text-xl text-sub font-light max-w-2xl">
          Have a project in mind? Let's build something future-proof.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-20 md:gap-32">
        
        <!-- Contact Form (Minimalist) -->
        <div ref="formEl" class="w-full opacity-0">
          <form @submit.prevent="submitForm" class="space-y-12">
            
            <div class="group relative">
              <input 
                type="text" 
                id="name" 
                v-model="form.name"
                required
                class="block py-4 px-0 w-full text-xl text-main bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer placeholder-transparent"
                placeholder=" "
              />
              <label for="name" class="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-4 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8">
                Your Name
              </label>
            </div>

            <div class="group relative">
              <input 
                type="email" 
                id="email" 
                v-model="form.email"
                required
                class="block py-4 px-0 w-full text-xl text-main bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer placeholder-transparent"
                placeholder=" "
              />
              <label for="email" class="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-4 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8">
                Email Address
              </label>
            </div>

            <div class="group relative">
              <textarea 
                id="message" 
                v-model="form.message"
                rows="4"
                required
                class="block py-4 px-0 w-full text-xl text-main bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer resize-none placeholder-transparent"
                placeholder=" "
              ></textarea>
              <label for="message" class="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-4 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8">
                Tell me about your project
              </label>
            </div>

            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-main transition-all duration-200 bg-transparent border-2 border-gray-300 dark:border-white/20 hover:border-main hover:bg-main hover:text-white dark:hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto overflow-hidden rounded-full"
            >
              <span v-if="!isSubmitting" class="relative z-10 flex items-center">
                SEND MESSAGE 
                <i class="pi pi-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
              </span>
              <span v-else class="relative z-10">SENDING...</span>
            </button>

            <!-- Status Message -->
            <div v-if="submitMessage" class="mt-6 text-sm" :class="submitStatus === 'success' ? 'text-green-500' : 'text-red-500'">
              {{ submitMessage }}
            </div>
          </form>
        </div>

        <!-- Contact Info & Socials -->
        <div ref="contactInfoEl" class="flex flex-col justify-between h-full space-y-12 md:space-y-0 opacity-0">
          <div>
            <h3 class="text-sm font-bold tracking-[0.2em] text-sub uppercase mb-8">Direct Contact</h3>
            <a href="mailto:xusniddinqalandarov2004@gmail.com" class="text-2xl md:text-3xl font-light text-main hover:text-blue-500 transition-colors block mb-4 break-words">
              xusniddinqalandarov2004<br>@gmail.com
            </a>
          </div>

          <div>
             <h3 class="text-sm font-bold tracking-[0.2em] text-sub uppercase mb-8">Socials</h3>
             <ul class="space-y-4">
               <li>
                 <a href="https://github.com/Xusniddin-devv" target="_blank" class="group flex items-center text-xl text-sub hover:text-main transition-colors">
                   <span class="w-8 h-[1px] bg-gray-400 dark:bg-gray-600 group-hover:bg-main mr-4 transition-colors"></span>
                   GitHub
                 </a>
               </li>
               <li>
                 <a href="https://www.linkedin.com/in/xusniddin-qalandarov/" target="_blank" class="group flex items-center text-xl text-sub hover:text-main transition-colors">
                   <span class="w-8 h-[1px] bg-gray-400 dark:bg-gray-600 group-hover:bg-main mr-4 transition-colors"></span>
                   LinkedIn
                 </a>
               </li>
               <li>
                 <a href="https://x.com/Xusniddin_Q" target="_blank" class="group flex items-center text-xl text-sub hover:text-main transition-colors">
                   <span class="w-8 h-[1px] bg-gray-400 dark:bg-gray-600 group-hover:bg-main mr-4 transition-colors"></span>
                   X (Twitter)
                 </a>
               </li>
             </ul>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap';

const form = ref({ name: '', email: '', message: '' });
const isSubmitting = ref(false);
const submitMessage = ref('');
const submitStatus = ref('');

const headerEl = ref(null);
const formEl = ref(null);
const contactInfoEl = ref(null);

const submitForm = async () => {
  isSubmitting.value = true;
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  submitStatus.value = 'success';
  submitMessage.value = 'Message sent successfully. I will be in touch.';
  form.value = { name: '', email: '', message: '' };
  isSubmitting.value = false;
};

onMounted(() => {
  const tl = gsap.timeline();
  
  tl.fromTo(headerEl.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
    .fromTo(formEl.value, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.5")
    .fromTo(contactInfoEl.value, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8");
});

useSeoMeta({
  title: 'Contact - Xusniddin Qalandarov',
  description: 'Get in touch for collaborations.'
})
</script>

<style scoped>
.text-main {
  color: var(--color-text-primary);
}
.text-sub {
  color: var(--color-text-secondary);
}
.bg-main {
  background-color: var(--color-text-primary);
}
.hover\:text-main:hover {
  color: var(--color-text-primary);
}
.hover\:bg-main:hover {
  background-color: var(--color-text-primary);
}
</style>