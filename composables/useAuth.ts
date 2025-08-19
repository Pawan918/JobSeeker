export const useAuth = () => {
  const token = useCookie<string | null>('token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/', // Important for SSR apps
    sameSite: 'lax', // Or 'strict'/'none' depending on your setup
  }) as Ref<string | null>
  const user = useState<any | null>('user', () => null)

  const setAuth = (newToken: string, userData: any) => {
    token.value = newToken
    user.value = userData
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
  }

  const initAuth = async () => {
    if (!token.value || user.value) return
    try {
      const { user: fetchedUser } = await useApi<{ user: any }>('/auth/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token.value}` },
        server: true,
      })
      user.value = fetchedUser
    } catch (err) {
      console.error('Failed to fetch user data:', err)
      clearAuth()
    }
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  return { token, user, setAuth, clearAuth, initAuth, isAuthenticated }
}
