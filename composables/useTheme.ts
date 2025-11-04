export const useTheme = () => {
  const isDark = ref(false) // Start with light mode to match what's shown

  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateTheme()
  }

  const updateTheme = () => {
    if (process.client) {
      const theme = isDark.value ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
      console.log('Theme updated to:', theme) // Debug log
    }
  }

  const initTheme = () => {
    if (process.client) {
      // Check localStorage first, then system preference
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        isDark.value = savedTheme === 'dark'
      } else {
        // Default to light mode for now
        isDark.value = false
      }
      updateTheme()
    }
  }

  return {
    isDark: readonly(isDark),
    toggleTheme,
    initTheme
  }
}