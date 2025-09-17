<script setup lang="ts">
import { defineProps, computed, type PropType } from 'vue';

const props = defineProps({
  variant: {
    type: String as PropType<'primary' | 'secondary'>,
    default: 'primary',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const buttonClasses = computed(() => {
  const base =
    'px-6 py-3 rounded-md text-base font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md disabled:bg-gray-200 disabled:text-gray-600 disabled:grayscale-100 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none';

  if (props.variant === 'primary') {
    return `${base} bg-red-600 text-white hover:bg-red-700 active:bg-red-800`;
  } else {
    return `${base} bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700`;
  }
});
</script>

<template>
  <button :class="buttonClasses" :disabled="disabled">
    <span v-if="$slots.icon" class="mr-4"><slot name="icon" /></span>
    <span><slot /></span>
  </button>
</template>
