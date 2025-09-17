<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '@/stores/game';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';
import BaseAlert from './BaseAlert.vue';

const gameStore = useGameStore();

const inputValue = ref('');
const errorMessage = ref('');
const hasError = computed(() => Boolean(errorMessage.value));

// todo
function isValidCoordinate(coord: string): boolean {
  const regex = /^[A-J](10|[1-9])$/;
  return regex.test(coord);
}

function selectTarget(): void {
  const coordinate = inputValue.value.trim().toUpperCase();

  if (!coordinate) {
    showError('Please enter coordinates');
    return;
  }

  if (!isValidCoordinate(coordinate)) {
    showError('Invalid coordinates. Must be of the format "A1".');
    return;
  }

  // todo
}

function showError(message: string): void {
  errorMessage.value = message;
}

function clearError(): void {
  errorMessage.value = '';
}
</script>

<template>
  <form
    @submit.prevent="selectTarget"
    class="bg-gray-50 border border-gray-100 shadow-md rounded p-5 my-5 max-w-lg mx-auto"
  >
    <h2 class="text-2xl font-bold text-center mb-4 text-slate-700">Choose Your Target</h2>
    <div class="mb-4">
      <BaseAlert
        title="Enter a coordinate by clicking the grid or typing below"
        description="It must be a letter followed by a number e.g B10"
        variant="info"
      />

      <div>
        <div class="flex justify-between gap-3 items-end">
          <label for="coordinate-input" class="relative grow block text-slate-700 text-base">
            <span class="block mb-2">Grid coordinates:</span>
            <BaseInput
              id="coordinate-input"
              v-model="inputValue"
              placeholder="e.g. A1"
              :hasError
              @keyup.enter="selectTarget"
              @input="clearError"
              :disabled="gameStore.finished"
              :maxlength="3"
            />
          </label>
          <BaseButton
            type="submit"
            variant="primary"
            :disabled="!inputValue || gameStore.finished"
            @click="selectTarget"
          >
            <template #icon>
              <span role="img" aria-label="gun">🔫</span>
            </template>
            Submit
          </BaseButton>
        </div>
        <p v-if="errorMessage" class="w-full text-red-700 text-sm mt-2">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </form>
</template>
