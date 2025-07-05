<template>
  <div>
    <label v-if="label" class="text-sm font-medium text-gray-700 mb-1 block">
      {{ label }}
    </label>

    <div class="relative">
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
        :class="[
          'w-full py-2.5 pr-4 rounded-lg text-sm border border-gray-300',
          hasIcon ? 'pl-10' : 'px-4',
          'focus-visible:outline-blue-500 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm placeholder-gray-400'
        ]"
      />
      <div v-if="$slots.icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <slot name="icon" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
  hasIcon: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue'])
</script>
