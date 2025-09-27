<template>
  <div class="h-full bg-gray-100 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
      <h2 class="text-3xl font-bold text-gray-900 text-center mb-6">Create Account</h2>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <BaseInput v-model="form.name" type="text" name="name" autocomplete="name" required placeholder="Full Name" />
        <BaseInput v-model="form.email" type="email" name="email" autocomplete="email" required
          placeholder="Email address" />
        <BaseInput v-model="form.password" type="password" name="password" autocomplete="new-password" required
          placeholder="Password" />
        <BaseButton type="submit" class="w-full py-3 font-semibold">Sign Up</BaseButton>
      </form>
      <p class="text-sm text-gray-600 mt-4 text-center">
        Already have an account?
        <NuxtLink to="/login" class="text-blue-600 hover:underline">Login</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const form = reactive({ name: '', email: '', password: '' })
const router = useRouter()

async function handleRegister() {
  try {
    await useApi('/auth/register', {
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
