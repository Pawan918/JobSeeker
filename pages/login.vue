<template>
  <div class="h-full bg-gray-100 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
      <h2 class="text-3xl font-bold text-gray-900 text-center mb-6">Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <BaseInput v-model="form.email" type="email" required placeholder="Email address" autocomplete="username" />
        <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>

        <BaseInput v-model="form.password" type="password" required placeholder="Password"
          autocomplete="current-password" />
        <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>

        <BaseButton type="submit" variant="primary" :disabled="isLoginBtnDisabled" class="w-full py-3">Log In
        </BaseButton>
      </form>

      <p class="text-sm text-gray-600 mt-4 text-center">
        Don’t have an account?
        <NuxtLink to="/register" class="text-blue-600 hover:underline">Sign up</NuxtLink>
      </p>
      <p class="text-sm text-center">
        <NuxtLink to="/forgot-password" class="text-blue-600 hover:underline">Forgot password?</NuxtLink>
      </p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { z } from 'zod'

const form = reactive({ email: '', password: '' })
const isLoading = ref(false)
const router = useRouter()
const { setAuth } = useAuth()


const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

const errors = reactive<{ email?: string; password?: string }>({})

const isLoginBtnDisabled = computed(() => {
  return !form.email || !form.password || isLoading.value
})


async function handleLogin() {
  try {
    errors.email = undefined
    errors.password = undefined

    loginSchema.parse(form)

    isLoading.value = true
    const res = await useApi('/auth/login', {
      method: 'POST',
      body: form
    })
    setAuth(res.token, res.user)
    router.push('/')
  } catch (error: any) {
    isLoading.value = false

    if (error instanceof z.ZodError) {
      error.errors.forEach((err: any) => {
        if (err.path[0] === 'email') errors.email = err.message
        if (err.path[0] === 'password') errors.password = err.message
      })
      return
    }

    alert(error?.data?.error || 'Login failed')
  }
}

onBeforeMount(() => {
  isLoading.value = false
})
</script>