export default defineNuxtPlugin(async () => {
  const auth = useAuth()
  const { init: socketInitialization, disconnect } = useRealtime()

  await auth.initAuth()
  watch(
    () => auth.token.value,
    (newToken, oldToken) => {
      if (newToken) {
        socketInitialization(newToken as string)
      } else {
        disconnect()
      }
    },
    { immediate: true }
  )
})
