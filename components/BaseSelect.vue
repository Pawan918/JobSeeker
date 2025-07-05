<template>
    <div class="relative">
        <label v-if="label" class="text-sm font-medium text-gray-700 mb-1 block">{{ label }}</label>

        <div class="relative">
            <select ref="selectEl" :value="modelValue" @change="handleChange" @focus="isOpen = true"
                @blur="isOpen = false"
                class="appearance-none w-full pr-10 px-4 py-2.5 rounded-lg text-sm border focus:outline-blue-500 border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm">
                <option v-if="placeholder" :value="''">{{ placeholder }}</option>
                <option v-for="(option, index) in options" :key="index" :value="option.value">
                    {{ option.label }}
                </option>
            </select>

            <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <component :is="isOpen ? ChevronUpIcon : ChevronDownIcon"
                    class="w-5 h-5 transition-transform duration-200" />
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid'

const isOpen = ref(false)
const selectEl = ref(null)

defineProps({
    label: String,
    options: {
        type: Array,
        required: true
    },
    modelValue: [String, Number],
    placeholder: String
})

const emit = defineEmits(['update:modelValue'])

function handleChange(e) {
    emit('update:modelValue', e.target.value)
    selectEl.value?.blur()
}
</script>
