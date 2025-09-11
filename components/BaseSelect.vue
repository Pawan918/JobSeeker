<template>
    <div class="relative w-64" ref="dropdownRef">
        <!-- Label -->
        <label v-if="label" class="text-sm font-medium text-gray-700 mb-1 block">
            {{ label }}
        </label>

        <!-- Trigger button -->
        <button type="button"
            class="w-full px-4 py-2.5 rounded-lg text-sm border border-gray-300 shadow-sm flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
            @click="toggleDropdown">
            <span class="truncate">
                {{ selectedOption?.label || placeholder }}
            </span>
            <component :is="isOpen ? ChevronUpIcon : ChevronDownIcon"
                class="w-5 h-5 text-gray-500 transition-transform duration-200" />
        </button>


        <transition name="fade">
            <ul v-if="isOpen"
                class="absolute mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-60 overflow-auto">
                <li v-for="(option, index) in options" :key="index" @click="selectOption(option)"
                    class="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50"
                    :class="{ 'bg-blue-100 font-medium': option.value === modelValue }">
                    {{ option.label }}
                </li>
            </ul>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { useClickOutside } from '~/composables/useClickOutside'
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid"

const props = defineProps({
    label: String,
    options: { type: Array, required: true },
    modelValue: [String, Number, null],
    placeholder: { type: String, default: "Select an option" },
})

const emit = defineEmits(["update:modelValue"])

const dropdownRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const selectedOption = computed(() =>
    props.options.find((opt: any) => opt.value === props.modelValue)
)

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

const selectOption = (option) => {
    emit("update:modelValue", option.value)
    isOpen.value = false
}

useClickOutside(dropdownRef, () => {
    console.log('clicked outside')
    isOpen.value = false
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
