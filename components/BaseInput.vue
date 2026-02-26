<template>
  <div>
    <label v-if="label" class="text-sm font-medium text-gray-700 mb-1 block dark:text-zinc-200">
      {{ label }}
    </label>

    <div class="relative">
      <input :type="type" :value="modelValue" :placeholder="placeholder"
        @input="$emit('update:modelValue', $event.target.value)" :class="[
          'w-full py-2.5 rounded-lg text-sm border border-gray-300 shadow-sm placeholder-gray-400 bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 dark:placeholder-zinc-500',
          hasIconLeft ? 'pl-10' : 'pl-4',
          hasIconRight ? 'pr-10' : 'pr-4',
          'focus-visible:outline-blue-500 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 dark:focus:ring-cyan-900/40 dark:focus:border-cyan-400'
        ]" />

      <!-- Left Icon -->
      <div v-if="$slots.iconLeft" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400">
        <slot name="iconLeft" />
      </div>

      <!-- Right Icon -->
      <div v-if="$slots.iconRight" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400">
        <slot name="iconRight" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSlots, computed } from 'vue'

const props = defineProps({
  label: String,
  modelValue: [String, Number],
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
})

defineEmits(['update:modelValue'])

const slots = useSlots()
const hasIconLeft = computed(() => !!slots.iconLeft)
const hasIconRight = computed(() => !!slots.iconRight)
</script>
