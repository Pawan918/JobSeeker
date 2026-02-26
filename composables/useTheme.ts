type ThemeMode = 'light' | 'dark'

export const useTheme = () => {
  const theme = useState<ThemeMode>('theme', () => 'light')
  const initialized = useState<boolean>('theme_initialized', () => false)

  const applyTheme = (next: ThemeMode) => {
    theme.value = next
    if (process.client) {
      document.documentElement.classList.toggle('dark', next === 'dark')
      localStorage.setItem('theme', next)
    }
  }

  if (process.client && !initialized.value) {
    const stored = localStorage.getItem('theme') as ThemeMode | null
    if (stored === 'light' || stored === 'dark') {
      applyTheme(stored)
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark')
    } else {
      applyTheme('light')
    }
    initialized.value = true
  }

  const toggleTheme = () => applyTheme(theme.value === 'dark' ? 'light' : 'dark')

  return { theme, applyTheme, toggleTheme }
}
