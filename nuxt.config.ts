// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // App configuration
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/icon.png' }
      ]
    }
  },
  
  // Netlify deployment preset
  nitro: {
    preset: 'netlify'
  },
  
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss', 
    '@nuxt/image'
  ],
  supabase: {
    redirect: false, // Disable auto-redirect to /login
    types: false, // Disable automatic type generation
  },
  css: [
    '~/assets/css/main.css',
    'primeicons/primeicons.css'
  ],
  runtimeConfig: {
    // Private keys (server-side only)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    // Public keys (exposed to client)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
    }
  }
})