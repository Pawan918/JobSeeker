<template>
  <div class="h-full bg-gray-100 flex items-center justify-center px-4 bg-[url('/background.png')] bg-cover bg-center dark:bg-zinc-950">
    <div class="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl dark:bg-zinc-900 dark:border dark:border-zinc-800">
      <h2 class="text-3xl font-bold text-gray-900 text-center mb-6 dark:text-zinc-100">Create Account</h2>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <BaseInput v-model="form.name" type="text" name="name" autocomplete="name" required placeholder="Full Name" />
          <p v-if="errors.name" class="text-sm text-red-500 dark:text-red-400">{{ errors.name }}</p>
        </div>
        <div>
          <BaseInput v-model="form.email" type="email" name="email" autocomplete="email" required
            placeholder="Email address" />
          <p v-if="errors.email" class="text-sm text-red-500 dark:text-red-400">{{ errors.email }}</p>
        </div>
        <div>
          <BaseInput v-model="form.password" :type="showPassword ? 'text' : 'password'" name="password"
            autocomplete="new-password" required placeholder="Password" class="relative">
            <template #iconRight>
              <div @click="showPassword = !showPassword" class="cursor-pointer">
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeSlashIcon v-else class="w-5 h-5" />
              </div>
            </template>
          </BaseInput>
          <p v-if="errors.password" class="text-sm text-red-500 dark:text-red-400">{{ errors.password }}</p>
        </div>
        <BaseButton type="submit" class="w-full py-3 font-semibold text-lg" :disabled="isSignUpBtnDisabled"
          variant="primary">
          <ArrowPathIcon v-if="isLoading" class="w-5 h-5 mr-2 animate-spin inline-block" />
          <span> Sign Up </span>
        </BaseButton>
      </form>
      <p class="text-sm text-gray-600 mt-4 text-center dark:text-zinc-300">
        Already have an account?
        <NuxtLink to="/login" class="text-blue-600 hover:underline dark:text-cyan-300">Login</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'

const router = useRouter()
const toast = useNotification();

const form = reactive({ name: '', email: '', password: '' })
const isLoading = ref(false)
const showPassword = ref(false);
const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})
const { validate, errors } = useValidation(schema)

const isSignUpBtnDisabled = computed(() => {
  return !form.name || !form.email || !form.password || isLoading.value
})

async function handleRegister() {
  if (!validate(form)) return
  isLoading.value = true
  try {
    await useApi('/auth/register', {
      method: 'POST',
      body: form
    })
    toast.success('Registered successfully!')
    router.push('/login')
  } catch (error: any) {
    toast.error(error?.data?.error || 'Signup failed')
  } finally {
    isLoading.value = false
  }
}
</script>
