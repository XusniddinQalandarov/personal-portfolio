module.exports = {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdfcfb',
          100: '#f5f0eb',
          200: '#ede8e3',
          300: '#d4c4b0',
          400: '#c9a96e',
          500: '#b08d57',
          600: '#8b7355',
          700: '#6b5a42',
          800: '#4a3f2e',
          900: '#2a231a',
        },
        dark: {
          900: '#0c0a09',
          800: '#1c1917',
          700: '#292524',
          600: '#44403c',
        },
        accent: {
          amber: '#d4a574',
          copper: '#c9a96e',
          bronze: '#8b7355',
          gold: '#b08d57',
        },
        stone: {
          warm: {
            50: '#fafaf9',
            100: '#f5f0eb',
            200: '#ede8e3',
            300: '#d6d0ca',
            400: '#a8a29e',
            500: '#78716c',
            600: '#57534e',
            700: '#44403c',
            800: '#292524',
            900: '#1c1917',
            950: '#0c0a09',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'gradient-shift': 'gradientShift 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 165, 116, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 165, 116, 0.3)' },
        },
      }
    },
  },
  plugins: [],
}