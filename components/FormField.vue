<template>
    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-800">{{ label }}</label>
      <slot />
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  defineProps<{ label: string }>()
  </script>
  