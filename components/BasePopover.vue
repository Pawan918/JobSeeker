<template>
    <div class="relative" ref="popoverRef">
        <button @click="toggle" class="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
            <slot name="trigger">
                <EllipsisHorizontalIcon class="w-5 h-5 text-gray-500" />
            </slot>
        </button>

        <div v-if="isOpen"
            class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-100 z-30">
            <slot name="content" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useClickOutside } from '~/composables/useClickOutside'
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/solid'

const isOpen = ref(false)
const popoverRef = ref<HTMLElement | null>(null)

const toggle = () => {
    isOpen.value = !isOpen.value
}


useClickOutside(popoverRef, () => {
    isOpen.value = false
})
</script>