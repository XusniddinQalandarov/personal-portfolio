<template>
  <div class="min-h-screen py-20">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl text-white font-bold mb-6">Get In Touch</h1>
        <p class="text-xl text-sub max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? I'd love to hear from you!
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-12">

        <!-- Contact Form -->
        <div>
          <div class="bg-[#1E2128FF] p-6 rounded-lg">
            <h2 class="text-2xl text-white font-semibold mb-6">Send Me a Message</h2>
            
            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-white mb-2">
                    Name  <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-2 rounded-lg bg-[#323743FF] text-white"
                    placeholder="Your name"
                  >
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-white mb-2">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full px-4 py-2 rounded-lg bg-[#323743FF] text-white"
                    placeholder="your.email@example.com"
                  >
                </div>
              </div>

              <div>
                <label for="subject" class="block text-sm font-medium text-white mb-2">
                  Subject <span class="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  v-model="form.subject"
                  type="text"
                  required
                  class="w-full px-4 py-2 rounded-lg bg-[#323743FF] text-white"
                  placeholder="What's this about?"
                >
              </div>

              <div>
                <label for="message" class="block text-sm font-medium text-white mb-2">
                  Message <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="5"
                  required
                  class="w-full px-4 py-2 rounded-lg bg-[#323743FF] text-white resize-none"
                  placeholder="Tell me about your project or just say hello!"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  :class="[
                    'w-full py-3 px-6 rounded-lg font-semibold transition-colors',
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#253A6AFF] hover:bg-[#2c3e50] text-white'
                  ]"
                >
                  <span v-if="!isSubmitting">Send Message</span>
                  <span v-else>Sending...</span>
                </button>
              </div>
            </form>

            <!-- Success/Error Messages -->
            <div v-if="submitMessage" class="mt-6">
              <div 
                :class="[
                  'p-4 rounded-lg',
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
        <div>
          <div class="bg-[#1E2128FF] p-6 rounded-lg">
            <h2 class="text-2xl text-main font-semibold mb-6">Let's Connect</h2>
            <p class="text-sub mb-8 text-sm">
             Always open to collaboration, code, or a good workout.
            </p>
            
            <!-- Contact Methods -->
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-transparent border border-white">
                  <i class="pi pi-envelope text-red-600 text-2xl"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-main">Email</h3>
                  <a href="mailto:xusniddinqalandarov2004@gmail.com" class="text-blue-600 hover:underline">
                    xusniddinqalandarov2004@gmail.com
                  </a>
                </div>
              </div>

              <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-transparent border border-white">
                  <i class="pi pi-twitter text-white text-2xl"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-main">X</h3>
                  <a href="https://x.com/Xusniddin_Q" target="_blank" class="text-blue-600 hover:underline">
                    @Xusniddin_Q
                  </a>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-transparent border border-white">
                  <i class="pi pi-linkedin text-blue-600 text-2xl"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-main">LinkedIn</h3>
                  <a href="https://www.linkedin.com/in/xusniddin-qalandarov/" target="_blank" class="text-blue-600 hover:underline">
                    @xusniddin-qalandarov
                  </a>
                </div>
              </div>

              <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-transparent border border-white">
                  <i class="pi pi-github text-white text-2xl"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-main">GitHub</h3>
                  <a href="https://github.com/Xusniddin-devv" target="_blank" class="text-blue-600 hover:underline">
                    @Xusniddin-devv
                  </a>
                </div>
              </div>
            </div>

            <!-- Response Time -->
            <div class="mt-20 pt-2">
              <p class="text-main text-sm mt-1">
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
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const isSubmitting = ref(false);
const submitMessage = ref('');
const submitStatus = ref('');

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

// SEO Meta
useSeoMeta({
  title: 'Contact - Your Name',
  ogTitle: 'Contact - Your Name',
  description: 'Get in touch with me for project collaborations, opportunities, or just to say hello!',
  ogDescription: 'Get in touch with me for project collaborations, opportunities, or just to say hello!',
})
</script>