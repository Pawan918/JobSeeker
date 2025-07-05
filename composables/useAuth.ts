export const useAuth = () => {
  const token = useCookie<string | null>('token') as Ref<string | null>
  const user = useState<any | null>('user', () => null)

  const setAuth = (newToken: string, userData: any) => {
    token.value = newToken
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('user')
  }

  const initAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  const isAuthenticated = () => {
    return !!token.value && !!user.value
  }

  return { token, user, setAuth, clearAuth, initAuth, isAuthenticated  }
}
