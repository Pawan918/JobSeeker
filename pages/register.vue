<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div class="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-6">Create Account</h2>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <input v-model="form.name" type="text" required placeholder="Full Name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="form.email" type="email" required placeholder="Email address"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="form.password" type="password" required placeholder="Password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit"
            class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
            Sign Up
          </button>
        </form>
        <p class="text-sm text-gray-600 mt-4 text-center">
          Already have an account?
          <NuxtLink to="/login" class="text-blue-600 hover:underline">Login</NuxtLink>
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const form = reactive({ name: '', email: '', password: '' })
  const router = useRouter()
  
  async function handleRegister() {
  try {
    await useApi('/register', {
      method: 'POST',
      body: form
    })

    alert('Registered successfully!')
    router.push('/login')
  } catch (error: any) {
    alert(error?.data?.error || 'Signup failed')
  }
}
  </script>
  