// Create shared state outside the composable function
const isDarkState = ref(false)

export const useTheme = () => {
  const toggleTheme = () => {
    isDarkState.value = !isDarkState.value
    updateTheme()
  }

  const updateTheme = () => {
    if (process.client) {
      const theme = isDarkState.value ? 'dark' : 'light'
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
        isDarkState.value = savedTheme === 'dark'
      } else {
        // Default to light mode for now
        isDarkState.value = false
      }
      updateTheme()
    }
  }

  return {
    isDark: readonly(isDarkState),
    toggleTheme,
    initTheme
  }
}