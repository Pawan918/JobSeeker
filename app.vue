<template>
  <NuxtLoadingIndicator color="oklch(54.6% 0.245 262.881)" :height="4"/>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
const { initAuth } = useAuth()
onMounted(() => {
  initAuth()
})
</script>
