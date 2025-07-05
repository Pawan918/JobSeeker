export const useAuth = () => {
  const token = useCookie<string | null>('token') as Ref<string | null>
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
      const { data: fetchedUser } = await useAsyncData('user', async () => {
        return await useApi<{ user: any }>('/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        })
      })
      user.value = fetchedUser.value?.user
    } catch (err) {
      clearAuth()
    }
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  return { token, user, setAuth, clearAuth, initAuth, isAuthenticated }
}
