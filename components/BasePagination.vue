<template>
    <div class="flex justify-center gap-4 items-center mt-12">
        <BaseButton @click="$emit('update:page', page - 1)" :disabled="isPrevPage" variant="outline" size="sm">
            <ChevronLeftIcon class="h-4 w-4" />
            <span class="ml-1">{{ $t('prev') }}</span>
        </BaseButton>

        <span class="text-sm text-gray-600 dark:text-zinc-300">
            Page {{ page }} of {{ totalPages }}
        </span>

        <BaseButton @click="$emit('update:page', page + 1)" :disabled="isNextPage" variant="outline" size="sm">
            <span class="mr-1">{{ $t('next') }}</span>
            <ChevronRightIcon class="h-4 w-4" />
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import BaseButton from './BaseButton.vue'

const $t = useI18n().t
const props = defineProps<{
    page: number
    totalPages: number
}>()

defineEmits<{
    (e: 'update:page', newPage: number): void
}>()

const isNextPage = computed(() => props.page >= props.totalPages);
const isPrevPage = computed(() => props.page <= 1);
</script>
