<template>
  <div
    class="auth-shell h-full bg-gray-100 flex items-center justify-center px-4 bg-[url('/background.png')] bg-cover bg-center dark:bg-zinc-950">
    <div class="auth-overlay" aria-hidden="true"></div>
    <div class="auth-orb auth-orb-1" aria-hidden="true"></div>
    <div class="auth-orb auth-orb-2" aria-hidden="true"></div>

    <div class="auth-card w-full max-w-md bg-white rounded-2xl p-8 shadow-xl dark:bg-zinc-900 dark:border dark:border-zinc-800">
      <h2 class="text-3xl font-bold text-gray-900 text-center mb-2 dark:text-zinc-100">{{ $t('login') }}</h2>
      <p class="text-center text-sm text-gray-500 dark:text-zinc-400 mb-6">
        Welcome back. Let’s get you into your dashboard.
      </p>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <BaseInput v-model="form.email" type="email" required placeholder="Email address" autocomplete="username" />
          <p v-if="errors.email" class="text-sm text-red-500 dark:text-red-400">{{ errors.email }}</p>
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
          <p v-if="errors.password" class="text-sm text-red-500 dark:text-red-400">{{ errors.password }}</p>
        </div>

        <BaseButton type="submit" variant="primary" :disabled="isLoginBtnDisabled"
          class="w-full py-3 text-lg font-semibold auth-button">
          <ArrowPathIcon v-if="isLoading" class="w-5 h-5 mr-2 animate-spin inline-block" />
          <span> Log In </span>
        </BaseButton>
      </form>

      <p v-if="isLoading" class="mt-3 text-center text-xs text-gray-500 dark:text-zinc-400">
        Authenticating<span class="auth-dots"></span>
      </p>

        <p class="text-sm text-gray-600 mt-4 text-center dark:text-zinc-300">
        Don’t have an account?
          <NuxtLink to="/register" class="text-blue-600 hover:underline dark:text-cyan-300">{{ $t('sign_up') }}</NuxtLink>
      </p>
        <p class="text-sm text-center">
          <NuxtLink to="/forgot-password" class="text-blue-600 hover:underline dark:text-cyan-300">Forgot password?</NuxtLink>
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

<style scoped>
.auth-shell {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.auth-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(80% 80% at 10% 10%, rgba(14, 116, 144, 0.15), transparent 60%),
    radial-gradient(80% 80% at 90% 10%, rgba(59, 130, 246, 0.15), transparent 60%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.12), rgba(15, 23, 42, 0.28));
  z-index: 0;
}

.auth-orb {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 999px;
  filter: blur(24px);
  opacity: 0.6;
  z-index: 0;
  animation: float 10s ease-in-out infinite;
}

.auth-orb-1 {
  top: -120px;
  left: -80px;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.4), transparent 60%);
}

.auth-orb-2 {
  bottom: -140px;
  right: -80px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.35), transparent 60%);
  animation-delay: 1.5s;
}

.auth-card {
  position: relative;
  z-index: 1;
  border: 1px solid rgba(148, 163, 184, 0.2);
  backdrop-filter: blur(6px);
  animation: rise 420ms ease-out both;
}

.auth-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  background: linear-gradient(90deg, rgba(34, 211, 238, 0.25), rgba(59, 130, 246, 0.18));
  border: 1px solid rgba(34, 211, 238, 0.35);
  margin: 0 auto 10px;
  width: fit-content;
}

.auth-button {
  position: relative;
  overflow: hidden;
}

.auth-button::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-120%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  animation: sheen 2.8s ease-in-out infinite;
  pointer-events: none;
}

.auth-dots::after {
  content: " .";
  animation: dots 1.2s steps(3, end) infinite;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(18px);
  }
}

@keyframes sheen {
  0% {
    transform: translateX(-120%);
  }
  60% {
    transform: translateX(120%);
  }
  100% {
    transform: translateX(120%);
  }
}

@keyframes dots {
  0% {
    content: " .";
  }
  33% {
    content: " ..";
  }
  66% {
    content: " ...";
  }
  100% {
    content: " .";
  }
}
</style>
