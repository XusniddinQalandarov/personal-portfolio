<template>
  <div class="min-h-screen py-12 md:py-20">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <div ref="headerEl" class="text-center mb-12 md:mb-16">
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-main font-bold mb-6">Get In Touch</h1>
        <p class="text-base md:text-lg lg:text-xl text-sub max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? I'd love to hear from you!
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-8 md:gap-12">

        <!-- Contact Form -->
        <div ref="formEl">
          <div class="glass-panel p-4 md:p-6 rounded-lg">
            <h2 class="text-xl md:text-2xl text-main font-semibold mb-4 md:mb-6">Send Me a Message</h2>
            
            <form @submit.prevent="submitForm" class="space-y-4 md:space-y-6">
              <div class="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-main mb-2">
                    Name  <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-charcoal text-main text-sm md:text-base border border-transparent focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="Your name"
                  >
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-main mb-2">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-charcoal text-main text-sm md:text-base border border-transparent focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="name@gmail.com"
                  >
                </div>
              </div>

              <div>
                <label for="subject" class="block text-sm font-medium text-main mb-2">
                  Subject <span class="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  v-model="form.subject"
                  type="text"
                  required
                  class="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-charcoal text-main text-sm md:text-base border border-transparent focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="What's this about?"
                >
              </div>

              <div>
                <label for="message" class="block text-sm font-medium text-main mb-2">
                  Message <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="5"
                  required
                  class="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-charcoal text-main resize-none text-sm md:text-base border border-transparent focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Tell me about your project or just say hello!"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  :class="[
                    'w-full py-2.5 md:py-3 px-4 md:px-6 rounded-lg font-semibold transition-colors text-sm md:text-base',
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'btn-primary'
                  ]"
                >
                  <span v-if="!isSubmitting">Send Message</span>
                  <span v-else>Sending...</span>
                </button>
              </div>
            </form>

            <!-- Success/Error Messages -->
            <div v-if="submitMessage" class="mt-4 md:mt-6">
              <div 
                :class="[
                  'p-3 md:p-4 rounded-lg text-sm md:text-base',
                  submitStatus === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                ]"
              >
                {{ submitMessage }}
              </div>
            </div>
          </div>
        </div>
        <!-- Contact Information -->
        <div ref="contactInfoEl">
          <div class="glass-panel p-4 md:p-6 rounded-lg">
            <h2 class="text-xl md:text-2xl text-main font-semibold mb-4 md:mb-6">Let's Connect</h2>
            <p class="text-sub mb-6 md:mb-8 text-sm">
             Always open to collaboration, code, or a good workout.
            </p>
            
            <!-- Contact Methods -->
            <div class="space-y-4 md:space-y-6">
              <div class="flex items-center gap-3 md:gap-4">
                <div class="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-lg flex items-center justify-center bg-transparent border border-cyan-400">
                  <i class="pi pi-envelope text-red-600 text-lg md:text-2xl"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="font-semibold text-main text-sm md:text-base">Email</h3>
                  <a href="mailto:xusniddinqalandarov2004@gmail.com" class="text-cyan-400 hover:underline text-xs md:text-sm break-all">
                    xusniddinqalandarov2004@gmail.com
                  </a>
                </div>
              </div>

              <div class="flex items-center gap-3 md:gap-4">
                  <div class="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-lg flex items-center justify-center bg-transparent border border-cyan-400">
                  <i class="pi pi-twitter text-main text-lg md:text-2xl"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="font-semibold text-main text-sm md:text-base">X</h3>
                  <a href="https://x.com/Xusniddin_Q" target="_blank" class="text-cyan-400 hover:underline text-xs md:text-sm">
                    @Xusniddin_Q
                  </a>
                </div>
              </div>

              <div class="flex items-center gap-3 md:gap-4">
                <div class="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-lg flex items-center justify-center bg-transparent border border-cyan-400">
                  <i class="pi pi-linkedin text-blue-600 text-lg md:text-2xl"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="font-semibold text-main text-sm md:text-base">LinkedIn</h3>
                  <a href="https://www.linkedin.com/in/xusniddin-qalandarov/" target="_blank" class="text-cyan-400 hover:underline text-xs md:text-sm">
                    @xusniddin-qalandarov
                  </a>
                </div>
              </div>

              <div class="flex items-center gap-3 md:gap-4">
                  <div class="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-lg flex items-center justify-center bg-transparent border border-cyan-400">
                  <i class="pi pi-github text-main text-lg md:text-2xl"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="font-semibold text-main text-sm md:text-base">GitHub</h3>
                  <a href="https://github.com/Xusniddin-devv" target="_blank" class="text-cyan-400 hover:underline text-xs md:text-sm">
                    @Xusniddin-devv
                  </a>
                </div>
              </div>
            </div>

            <!-- Response Time -->
            <div class="mt-8 md:mt-12 pt-4 md:pt-6 border-t border-gray-700">
              <p class="text-main text-xs md:text-sm">
                I typically respond to messages within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const isSubmitting = ref(false);
const submitMessage = ref('');
const submitStatus = ref('');

const headerEl = ref(null);
const formEl = ref(null);
const contactInfoEl = ref(null);

const submitForm = async () => {
  isSubmitting.value = true;
  submitMessage.value = '';
  
  try {
    // Call the API endpoint
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        subject: form.value.subject,
        message: form.value.message
      }
    });
    
    // Success
    submitStatus.value = 'success';
    submitMessage.value = 'Thank you for your message! I\'ll get back to you soon.';
    
    // Reset form
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
    
  } catch (err) {
    console.error('Error submitting form:', err);
    submitStatus.value = 'error';
    // Handle any error type
    submitMessage.value = (err && typeof err === 'object' && 'data' in err && err.data?.statusMessage) || 'Sorry, there was an error sending your message. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  // Create timeline for smooth animations
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  // Header fade in from top
  tl.from(headerEl.value, {
    y: -30,
    opacity: 0,
    duration: 0.8,
  });
  
  // Form slide in from left
  tl.from(formEl.value, {
    x: -50,
    opacity: 0,
    duration: 0.8,
  }, '-=0.4');
  
  // Contact info slide in from right
  tl.from(contactInfoEl.value, {
    x: 50,
    opacity: 0,
    duration: 0.8,
  }, '-=0.6');
});

// SEO Meta
useSeoMeta({
  title: 'Contact - Your Name',
  ogTitle: 'Contact - Your Name',
  description: 'Get in touch with me for project collaborations, opportunities, or just to say hello!',
  ogDescription: 'Get in touch with me for project collaborations, opportunities, or just to say hello!',
})
</script>