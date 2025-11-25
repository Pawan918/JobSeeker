<template>
  <div class="h-full bg-gray-100 flex items-center justify-center px-4 bg-[url('/background.png')] bg-cover bg-center">
    <div class="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
      <h2 class="text-3xl font-bold text-gray-900 text-center mb-6">{{ $t('login') }}</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <BaseInput v-model="form.email" type="email" required placeholder="Email address" autocomplete="username" />
          <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
        </div>

        <div>
          <BaseInput v-model="form.password" :type="showPassword ? 'text' : 'password'" required placeholder="Password"
            autocomplete="current-password">
            <template #iconRight>
              <div @click="showPassword = !showPassword" class="cursor-pointer">
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeSlashIcon v-else class="w-5 h-5" />
              </div>
            </template>
          </BaseInput>
          <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
        </div>

        <BaseButton type="submit" variant="primary" :disabled="isLoginBtnDisabled"
          class="w-full py-3 text-lg font-semibold">
          <ArrowPathIcon v-if="isLoading" class="w-5 h-5 mr-2 animate-spin inline-block" />
          <span> Log In </span>
        </BaseButton>
      </form>

      <p class="text-sm text-gray-600 mt-4 text-center">
        Don’t have an account?
        <NuxtLink to="/register" class="text-blue-600 hover:underline">{{ $t('sign_up') }}</NuxtLink>
      </p>
      <p class="text-sm text-center">
        <NuxtLink to="/forgot-password" class="text-blue-600 hover:underline">Forgot password?</NuxtLink>
      </p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';
import { z } from 'zod'

const form = reactive({ email: '', password: '' })
const showPassword = ref(false);
const isLoading = ref(false)
const router = useRouter()
const { setAuth } = useAuth()
const toast = useNotification();
const { locales, setLocale } = useI18n()

const $t = useI18n().t

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})
const { validate, errors } = useValidation(loginSchema)

const isLoginBtnDisabled = computed(() => {
  return !form.email || !form.password || isLoading.value
})


async function handleLogin() {
  if (!validate(form)) return
  isLoading.value = true
  try {
    const res = await useApi('/auth/login', {
      method: 'POST',
      body: form
    })
    setAuth(res.token, res.user)
    toast.success('Logged in successfully!')
    router.push('/')
  } catch (error: any) {
    toast.error(error?.data?.error || 'Login failed')
  } finally {
    isLoading.value = false
  }
}
</script>