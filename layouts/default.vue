<template>
  <div class="min-h-screen grid grid-rows-[auto_1fr] bg-gray-50 text-gray-800">
    <Header />
    <main class="pt-4">
      <NuxtPage />
    </main>
  </div>
</template>


<script setup lang="ts">
import Header from '@/components/Header.vue'

onMounted(() => {
  useAuth().initAuth()
})
</script>