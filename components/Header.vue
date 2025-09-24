<template>
  <header class="bg-white border-b shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-bold text-blue-600 tracking-tight">
          DevJobsHub
        </NuxtLink>

        <div class="flex items-center space-x-4 text-sm">
          <template v-if="user">
            <!-- Notifications Popover -->
            <BasePopover>
              <template #trigger>
                <button class="relative p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
                  <BellIcon class="w-5 h-5 text-gray-600" />
                  <span v-if="unreadCount > 0"
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {{ unreadCount }}
                  </span>
                </button>
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
                      No notifications
                    </div>
                  </div>
                </ClientOnly>
              </template>
            </BasePopover>

            <BasePopover>
              <template #trigger>
                <BaseAvatar :name="user.name" />
              </template>
              <template #content>
                <button class="w-32 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  @click="handleLogout">
                  <ArrowLeftStartOnRectangleIcon class="w-4 h-4" />
                  Log out
                </button>
              </template>
            </BasePopover>
          </template>

          <template v-else>
            <NuxtLink to="/login" class="text-blue-600 hover:underline">Login</NuxtLink>
            <NuxtLink to="/register" class="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition">
              Sign Up
            </NuxtLink>
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


const { user, logout, token } = useAuth()
const { notifications, markAsRead } = useRealtime()

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