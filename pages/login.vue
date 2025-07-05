<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div class="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-6">Login</h2>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <input v-model="form.email" type="email" required placeholder="Email address"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="form.password" type="password" required placeholder="Password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit"
            class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
            Log In
          </button>
        </form>
        <p class="text-sm text-gray-600 mt-4 text-center">
          Don’t have an account?
          <NuxtLink to="/register" class="text-blue-600 hover:underline">Sign up</NuxtLink>
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const form = reactive({ email: '', password: '' })
  const router = useRouter()
  const { setAuth } = useAuth()
  
  async function handleLogin() {
  try {
    const res = await useApi('/login', {
      method: 'POST',
      body: form
    })
    setAuth(res.token, res.user)
    router.push('/')
  } catch (error: any) {
    alert(error?.data?.error || 'Login failed')
  }
}
  </script>
  