<script setup lang="ts">
import { defineModel, defineProps } from 'vue';

const inputValue = defineModel<string>('modelValue', {
  type: String,
  required: true,
});

defineProps<{
  hasError: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxlength?: number;
}>();
</script>

<template>
  <input
    v-model="inputValue"
    type="text"
    class="px-4 py-3 border-2 border-gray-400 rounded-md text-base text-center transition-all duration-200 min-w-15 max-w-30 focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed"
    :class="{ 'border-red-500': hasError }"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :disabled="disabled"
  />
</template>
