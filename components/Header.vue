<template>
  <header class="bg-white border-b shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto">
      <div class="flex h-16 items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-bold text-blue-600 tracking-tight">
          DevJobsHub
        </NuxtLink>
        <nav class="hidden md:flex items-center space-x-6 text-sm text-gray-700 font-medium">
          <NuxtLink activeClass="text-blue-600" :to="nav.to" class="hover:text-blue-600 transition"
            v-for="(nav) in navigationRoutes" :key="nav.name">
            {{ nav.name }}
          </NuxtLink>
        </nav>
        <div class="flex items-center space-x-4 text-sm">
          <template v-if="user">
            <BasePopover>
              <template #trigger>
                <BaseAvatar :name="user.name">
                </BaseAvatar>
              </template>
              <template #content>
                <button class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  @click="logout">
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
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/24/solid'

const { user, clearAuth } = useAuth()

const navigationRoutes = [
  {
    name: 'Home',
    to: '/'
  },
  {
    name: 'My Jobs',
    to: '/my-jobs'
  },
  {
    name: 'Applied Jobs',
    to: '/application'
  }
]

function logout() {
  clearAuth()
  navigateTo('/login')
}
</script>