export default defineNuxtRouteMiddleware((to, from) => {
  const { token } = useAuth()

  const restrictedRoutes = ['/post', '/my-jobs', '/application']
  if (restrictedRoutes.includes(to.path) && !token.value) {
    return navigateTo('/login')
  }
})
