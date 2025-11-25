<template>
  <header class="bg-white border-b shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-bold text-blue-600 tracking-tight">
          <img src="/jobhunt.png" alt="JobHunt Logo" class="h-16 w-auto inline-block mr-2" />
        </NuxtLink>

        <nav class="hidden md:flex items-center space-x-6 text-sm text-gray-700 font-medium">
          <NuxtLink activeClass="text-blue-600" :to="nav.to" class="hover:text-blue-600 transition"
            v-for="(nav) in navigationRoutes" :key="nav.name">
            {{ nav.name }}
          </NuxtLink>
        </nav>
        <div class="flex items-center space-x-4 text-sm">
          <BaseSelect v-if="token" :options="languageOptions" v-model="language" class="!w-40"
            @update:modelValue="(lang) => setLocale(lang)" />
          <template v-if="user">
            <!-- Notifications Popover -->
            <BasePopover>
              <template #trigger>
                <BaseButton variant="gray-light" rounded class="!p-3 relative" :title="$t('notifications')">
                  <BellIcon class="w-5 h-5" />
                  <span v-if="unreadCount > 0"
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {{ unreadCount > 9 ? '9+' : unreadCount }}
                  </span>
                </BaseButton>
              </template>
              <template #content>
                <ClientOnly>
                  <div class="max-h-64 overflow-y-auto w-64">
                    <div v-for="notif in notifications" :key="notif.id"
                      class="px-4 py-2 border-b last:border-b-0 border-gray-200 cursor-pointer flex items-start gap-2 hover:bg-gray-50"
                      :class="notif.isRead ? 'bg-white' : 'bg-gray-100 font-medium'" @click="toggleRead(notif.id)">

                      <div class="flex-1">
                        <p class="text-sm">
                          <span class="font-semibold capitalize">{{ notif.actor.name }}</span>
                          {{ formatNotification(notif) }}
                        </p>
                        <p class="text-xs text-gray-400">{{ formatDate(notif.createdAt) }}</p>
                      </div>

                      <div v-if="!notif.isRead" class="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
                    </div>

                    <div v-if="notifications.length === 0" class="p-2 text-sm text-gray-400">
                      {{ $t('no_notifications') }}
                    </div>
                  </div>
                </ClientOnly>
              </template>
            </BasePopover>

            <BasePopover>
              <template #trigger>
                <BaseAvatar :name="user.name" class="cursor-pointer" />
              </template>
              <template #content>
                <button class="w-32 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  @click="handleLogout">
                  <ArrowLeftStartOnRectangleIcon class="w-4 h-4" />
                  {{ $t('logout') }}
                </button>
              </template>
            </BasePopover>
          </template>

          <template v-else>
            <BaseButton to="/login" variant="outline" class="text-blue-600 hover:bg-blue-50">{{ $t('login') }}</BaseButton>
            <BaseButton to="/register" variant="primary">
              {{ $t('sign_up') }}
            </BaseButton>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Notification } from '~/types/notification'

import { ArrowLeftStartOnRectangleIcon, BellIcon } from '@heroicons/vue/24/solid'
import { useAuth } from '~/composables/useAuth'
import { useRealtime } from '~/composables/useRealtime'
import { formatDate } from '~/utils/index'
const { locales, setLocale } = useI18n()
const $t = useI18n().t


const { user, logout, token } = useAuth()
const { notifications, markAsRead } = useRealtime()

const navigationRoutes = computed(() => [
  { name: $t('home'), to: '/' },
  { name: $t('my_jobs'), to: '/my-jobs' },
  { name: $t('applied_jobs'), to: '/application' }
])

const languageOptions = ref(locales.value.map(loc => ({ label: loc.name, value: loc.code })))
const language = ref(useI18n().locale.value)

const unreadCount = computed(() =>
  notifications.value.filter(n => !n.isRead).length
)

const formatNotification = (notif: Notification) => {
  switch (notif.type) {
    case 'APPLY':
      return `${notif.actor.name} applied to your job "${notif.job?.title}"`

    case 'HIRED':
      return `Congratulations! ${notif.actor.name} hired you for "${notif.job?.title}"`

    case 'COMMENT':
      return `${notif.actor.name} commented: "${notif.message}"`

    default:
      return notif.message || `${notif.actor.name} did something`
  }
}

const toggleRead = (id: number) => {
  const notif = notifications.value.find(n => n.id === id)
  if (notif && !notif.read) {
    markAsRead(id)
  }
}


async function handleLogout() {
  await logout()
  navigateTo('/login')
}
</script>