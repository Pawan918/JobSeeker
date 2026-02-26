<template>
  <div class="min-h-screen grid grid-rows-[auto_1fr] bg-gray-50 text-gray-800 dark:bg-zinc-950 dark:text-zinc-100">
    <Header />
    <main>
      <NuxtPage />
    </main>
  </div>
</template>


<script setup lang="ts">
import Header from '@/components/Header.vue'
</script>
