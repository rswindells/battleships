<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  variant: {
    type: String as () => 'info' | 'warning' | 'error',
    default: 'info',
  },
});

const variantClass = computed(() => {
  switch (props.variant) {
    case 'warning':
      return 'bg-yellow-50 text-yellow-700 ';
    case 'error':
      return 'bg-red-50 text-red-700 ';
    case 'info':
    default:
      return 'bg-blue-50 text-blue-700';
  }
});
</script>
<template>
  <div :class="variantClass" class="p-4 rounded-md mb-4">
    <p class="m-0 text-sm font-semibold mb-1">
      {{ title }}
    </p>
    <p class="m-0 text-sm italic">{{ description }}</p>
  </div>
</template>
