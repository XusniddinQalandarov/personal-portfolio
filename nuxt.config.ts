// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // App configuration
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/images/icon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap' }
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
    '@nuxt/image',
    '@nuxtjs/i18n'
  ],
  
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ru', name: 'Русский', file: 'ru.json' }
    ],
    defaultLocale: 'en',
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

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