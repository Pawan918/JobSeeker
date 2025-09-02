export const useAuth = () => {
  const token = useCookie<string | null>('token', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
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
    if (user.value) return
    try {
      if (!token.value) {
        const newToken = await refreshToken()
        token.value = newToken
      }
      const { user: fetchedUser } = await useApi<{ user: any }>('/auth/me', {
        method: 'GET',
        server: true,
      })
      user.value = fetchedUser
    } catch (err) {
      console.error('Failed to fetch user data:', err)
      clearAuth()
    }
  }
  const refreshToken = async () => {
    try {
      const { accessToken } = await useApi('/auth/refresh-token', {
        method: 'POST',
        credentials: 'include',
      })
      token.value = accessToken
      return accessToken
    } catch (err) {
      logout()
      throw err
    }
  }

  const logout = async () => {
    try {
      await useApi('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      clearAuth()
    }
  }


  const isAuthenticated = computed(() => !!token.value && !!user.value)

  return { token, user, setAuth, clearAuth, initAuth, refreshToken, logout, isAuthenticated }
}
